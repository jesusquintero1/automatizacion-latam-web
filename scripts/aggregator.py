"""
Agregador automático de noticias de automatización industrial.

Flujo:
  1. Lee feeds RSS definidos en sources.yml.
  2. Filtra noticias ya procesadas (state/processed.json).
  3. Para cada noticia nueva, llama a Claude Haiku 4.5 para:
     - Traducir/reescribir el titular en español.
     - Generar un resumen original (no copia del texto fuente).
     - Categorizar la noticia.
     - Producir el cuerpo del artículo en español neutro.
  4. Escribe un .md en src/content/noticias/ con frontmatter compatible
     con el schema de Astro.
  5. Actualiza el estado de procesados.

Importante (cumplimiento AdSense):
  - NUNCA copia texto literal de la fuente.
  - El resumen es siempre reescrito por el modelo.
  - Se cita la fuente original con enlace.

Uso:
    python aggregator.py             # corrida normal
    python aggregator.py --dry-run   # no escribe archivos, solo log
    python aggregator.py --verbose   # log detallado
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import feedparser
import yaml
from anthropic import Anthropic, APIError, RateLimitError
from bs4 import BeautifulSoup
from dateutil import parser as date_parser
from slugify import slugify

# Carga .env si existe (para desarrollo local). En CI las vars vienen del runner.
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src" / "content" / "noticias"
STATE_DIR = Path(__file__).resolve().parent / "state"
STATE_FILE = STATE_DIR / "processed.json"
SOURCES_FILE = Path(__file__).resolve().parent / "sources.yml"

CATEGORIAS_VALIDAS = [
    "PLC y Control",
    "Robótica",
    "Industria 4.0",
    "Inteligencia Artificial",
    "Ciberseguridad OT",
    "Energía y Sostenibilidad",
    "Mercado y Negocios",
    "Casos de Estudio",
    "General",
]

# System prompt estable para que el prompt caching de Anthropic funcione.
# Cualquier byte que cambie aquí invalida el caché — manténlo congelado.
SYSTEM_PROMPT = """Eres editor especializado en automatización industrial y traduces/reescribes \
noticias del sector para el público latinoamericano. Tu trabajo es producir contenido ORIGINAL \
a partir del titular y el resumen en inglés de una fuente, sin copiar texto literal.

Reglas críticas (no negociables):
- NUNCA traduzcas palabra-por-palabra. Reescribe siempre con tus propias palabras en español neutro.
- NUNCA copies frases completas del texto fuente. Si una cita textual es esencial, ponla entre \
  comillas y deja claro que es cita literal.
- Adapta el tono a un ingeniero o técnico hispanohablante.
- Si el texto fuente menciona empresas, modelos de equipos o estándares, conserva los nombres \
  propios (Schneider, Siemens, IEC 61131, OPC UA, etc).
- Categoriza usando EXACTAMENTE una de estas 9 etiquetas. Lee TODAS las definiciones antes de \
  decidir; "Industria 4.0" NO es cajón de sastre — solo úsala cuando ninguna otra encaje:
  * "PLC y Control" — PLCs, HMI, SCADA, DCS, lazos de control, lenguajes IEC 61131 (LADDER, ST, \
    FBD), instrumentación de campo, variadores, motion control, sensores industriales, \
    automatización definida por software.
  * "Robótica" — brazos robóticos, cobots, robots colaborativos, AGV, AMR, robots móviles, \
    visión de máquina aplicada a robótica, end-effectors, programación de robots.
  * "Inteligencia Artificial" — modelos generativos y plataformas IA de propósito general \
    (GPT, Claude, Gemini, Llama, Mistral, DeepSeek), agentes de IA, modelos de imagen/video \
    (DALL·E, Midjourney, Veo, Sora, Runway), LLMs, fine-tuning, frameworks (LangChain, \
    Hugging Face), papers de investigación, anuncios de OpenAI/Anthropic/Google DeepMind/Meta AI, \
    regulación de IA, ética y seguridad de IA, GPUs para IA (NVIDIA H100, AMD MI300). \
    Usar SIEMPRE que la noticia sea sobre IA GENERAL, no específicamente industrial.
  * "Industria 4.0" — convergencia IT/OT en abstracto: IIoT, gemelos digitales, MES, fábrica \
    conectada, edge computing industrial sin foco en un equipo específico. NO uses esta para \
    IA generativa o LLMs — esos van en "Inteligencia Artificial".
  * "Ciberseguridad OT" — ataques a infraestructura industrial, vulnerabilidades en PLC/HMI/RTU, \
    ransomware OT, segmentación de redes OT/IT, post-cuántica, NIST OT, CISA, normas IEC 62443.
  * "Energía y Sostenibilidad" — gestión energética, microgrids, renovables, descarbonización, \
    eficiencia, refrigeración de data centers, agua, economía circular.
  * "Mercado y Negocios" — fusiones, adquisiciones, lanzamientos comerciales, resultados \
    financieros, alianzas, eventos corporativos, certificaciones (CMMC, ISO).
  * "Casos de Estudio" — implementación REAL en una planta o fábrica concreta, con resultados \
    medibles, retrofits, modernizaciones documentadas.
  * "General" — solo si verdaderamente no encaja en ninguna de las anteriores.
  Reglas de desempate:
  - Si menciona un LLM, modelo de imagen/video, OpenAI, Anthropic, Gemini, Veo, Sora, DALL·E, \
    ChatGPT, Copilot → "Inteligencia Artificial" (NO "Industria 4.0").
  - Si el artículo describe un PLC, HMI, SCADA, variador o lazo de control específico → \
    "PLC y Control" (NO "Industria 4.0").
  - Si el artículo es sobre un robot, AGV o cobot específico → "Robótica" (NO "Industria 4.0").
  - Si hay un ataque, CVE, ransomware o vulnerabilidad OT → "Ciberseguridad OT".
  - Si menciona una planta cliente concreta + métricas de mejora → "Casos de Estudio".

Formato de salida — SIEMPRE responde con un objeto JSON válido con esta estructura exacta:
{
  "titulo": "Titular en español, atractivo, máximo 90 caracteres",
  "resumen": "Resumen original de 2-3 frases (max 280 caracteres). Da el qué y el porqué.",
  "categoria": "Una de las 8 categorías permitidas",
  "porQueImporta": "1-2 frases sobre el impacto para la industria en LatAm.",
  "cuerpo": "Artículo en markdown de 450-650 palabras (no menos de 450). Usa ## para 3-4 \
secciones: contexto, qué se anunció, cómo funciona/detalles técnicos, implicaciones para LatAm. \
Profundiza: aporta cifras concretas, nombres de tecnologías y ejemplos cuando estén disponibles. \
NO uses tablas ni HTML — solo markdown puro.",
  "tags": ["3-5", "palabras", "clave", "lowercase", "sin-tildes"]
}

No agregues texto antes ni después del JSON. No envuelvas el JSON en ```json``` fences."""

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%H:%M:%S",
    )

log = logging.getLogger("aggregator")

# ---------------------------------------------------------------------------
# Tipos
# ---------------------------------------------------------------------------

@dataclass
class FeedItem:
    titulo_original: str
    resumen_original: str
    url: str
    fecha: dt.datetime
    fuente_nombre: str
    imagen: str = ""
    item_id: str = field(default="")

    def __post_init__(self) -> None:
        if not self.item_id:
            self.item_id = hashlib.sha256(self.url.encode("utf-8")).hexdigest()[:16]


@dataclass
class RewrittenArticle:
    titulo: str
    resumen: str
    categoria: str
    por_que_importa: str
    cuerpo: str
    tags: list[str]


# ---------------------------------------------------------------------------
# Estado de procesados (deduplicación)
# ---------------------------------------------------------------------------

def load_state() -> dict[str, Any]:
    if not STATE_FILE.exists():
        return {"procesados": {}, "ultima_corrida": None}
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        log.warning("State corrupto, empezando de cero.")
        return {"procesados": {}, "ultima_corrida": None}


def save_state(state: dict[str, Any]) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    state["ultima_corrida"] = dt.datetime.now(dt.timezone.utc).isoformat()
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")


# ---------------------------------------------------------------------------
# Lectura de feeds
# ---------------------------------------------------------------------------

def _clean_html(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True))


def _extract_image(entry: Any) -> str:
    """Busca la imagen representativa de un item RSS en varios lugares."""
    # 1) media:content / media:thumbnail (Yahoo Media RSS)
    for media in (entry.get("media_content") or []) + (entry.get("media_thumbnail") or []):
        url = (media or {}).get("url", "")
        if url and url.startswith("http"):
            return url
    # 2) enclosure (RSS clásico)
    for enc in entry.get("enclosures") or []:
        url = (enc or {}).get("url") or (enc or {}).get("href") or ""
        if url.startswith("http") and any(ext in url.lower() for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif")):
            return url
    # 3) imagen explícita en el feed (algunos la exponen)
    if entry.get("image", {}).get("href"):
        return entry["image"]["href"]
    # 4) primera <img src=...> del summary/content
    html_blob = (
        entry.get("summary")
        or entry.get("description")
        or (entry.get("content") or [{}])[0].get("value", "")
        or ""
    )
    if html_blob:
        soup = BeautifulSoup(html_blob, "html.parser")
        img = soup.find("img", src=True)
        if img:
            src = img.get("src", "").strip()
            if src.startswith("http"):
                return src
    return ""


def fetch_feed(fuente: dict[str, Any], user_agent: str) -> list[FeedItem]:
    log.info("Leyendo feed: %s", fuente["nombre"])
    parsed = feedparser.parse(fuente["url"], agent=user_agent)
    if parsed.bozo and not parsed.entries:
        log.warning("  Feed inválido o vacío (%s): %s", fuente["nombre"], parsed.bozo_exception)
        return []

    items: list[FeedItem] = []
    for entry in parsed.entries[:10]:
        url = entry.get("link", "").strip()
        if not url:
            continue
        title = entry.get("title", "").strip()
        if not title:
            continue

        summary = _clean_html(
            entry.get("summary") or entry.get("description") or entry.get("subtitle") or ""
        )

        fecha_str = entry.get("published") or entry.get("updated") or ""
        try:
            fecha = date_parser.parse(fecha_str) if fecha_str else dt.datetime.now(dt.timezone.utc)
        except (ValueError, TypeError):
            fecha = dt.datetime.now(dt.timezone.utc)
        if fecha.tzinfo is None:
            fecha = fecha.replace(tzinfo=dt.timezone.utc)

        items.append(FeedItem(
            titulo_original=title,
            resumen_original=summary[:1500],  # cap razonable
            url=url,
            fecha=fecha,
            fuente_nombre=fuente["nombre"],
            imagen=_extract_image(entry),
        ))
    log.info("  %d items leídos", len(items))
    return items


# ---------------------------------------------------------------------------
# Llamada a Claude (con prompt caching del system prompt)
# ---------------------------------------------------------------------------

def rewrite_with_claude(
    client: Anthropic,
    item: FeedItem,
    modelo: str,
) -> RewrittenArticle | None:
    user_message = (
        f"Fuente: {item.fuente_nombre}\n"
        f"URL: {item.url}\n\n"
        f"TITULAR ORIGINAL (inglés):\n{item.titulo_original}\n\n"
        f"RESUMEN ORIGINAL (inglés):\n{item.resumen_original}\n\n"
        f"Reescribe en español según las reglas. Devuelve solo el JSON."
    )

    # Hasta 3 intentos con backoff para errores transitorios.
    for intento in range(3):
        try:
            response = client.messages.create(
                model=modelo,
                max_tokens=2048,
                system=[
                    {
                        "type": "text",
                        "text": SYSTEM_PROMPT,
                        # cache_control hace que el system prompt (~600 tokens) se cachee
                        # entre llamadas → 90% más barato a partir del 2do hit.
                        "cache_control": {"type": "ephemeral"},
                    },
                ],
                messages=[{"role": "user", "content": user_message}],
            )
            usage = response.usage
            log.debug(
                "  tokens: in=%d cache_read=%d cache_create=%d out=%d",
                usage.input_tokens,
                getattr(usage, "cache_read_input_tokens", 0) or 0,
                getattr(usage, "cache_creation_input_tokens", 0) or 0,
                usage.output_tokens,
            )

            text = "".join(b.text for b in response.content if b.type == "text").strip()
            data = _parse_json_robust(text)
            if data is None:
                log.warning("  Claude devolvió JSON inválido, descartando item.")
                return None

            return _validate_article(data)

        except RateLimitError:
            espera = 2 ** intento * 5
            log.warning("  Rate limit, reintentando en %ds…", espera)
            time.sleep(espera)
        except APIError as e:
            log.error("  Error de API: %s", e)
            if intento == 2:
                return None
            time.sleep(3)

    return None


def _parse_json_robust(text: str) -> dict[str, Any] | None:
    """Intenta parsear JSON aunque Claude lo envuelva en code fences."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # último intento: extraer primer {…} balanceado
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                return None
        return None


def _validate_article(data: dict[str, Any]) -> RewrittenArticle | None:
    required = ["titulo", "resumen", "categoria", "porQueImporta", "cuerpo", "tags"]
    for k in required:
        if k not in data:
            log.warning("  Campo faltante en JSON: %s", k)
            return None

    cat = data["categoria"].strip()
    if cat not in CATEGORIAS_VALIDAS:
        log.warning("  Categoría inválida '%s', forzando 'General'", cat)
        cat = "General"

    tags = data.get("tags", [])
    if not isinstance(tags, list):
        tags = []
    tags = [str(t).lower().strip() for t in tags if t][:5]

    return RewrittenArticle(
        titulo=str(data["titulo"]).strip()[:140],
        resumen=str(data["resumen"]).strip()[:300],
        categoria=cat,
        por_que_importa=str(data["porQueImporta"]).strip()[:500],
        cuerpo=str(data["cuerpo"]).strip(),
        tags=tags,
    )


# ---------------------------------------------------------------------------
# Escritura de .md
# ---------------------------------------------------------------------------

def _yaml_escape(s: str) -> str:
    # Comillas dobles + escape de comillas internas
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def write_article(item: FeedItem, article: RewrittenArticle, dry_run: bool) -> Path:
    fecha_str = item.fecha.strftime("%Y-%m-%d")
    slug_base = slugify(article.titulo, max_length=70)
    filename = f"{fecha_str}-{slug_base}.md"
    path = CONTENT_DIR / filename

    # Si ya existe, añade un sufijo numérico
    counter = 1
    while path.exists():
        path = CONTENT_DIR / f"{fecha_str}-{slug_base}-{counter}.md"
        counter += 1

    tags_yaml = "\n".join(f"  - {t}" for t in article.tags) if article.tags else "  []"
    imagen_yaml = f"imagen: {_yaml_escape(item.imagen)}\n" if item.imagen else ""

    frontmatter = f"""---
titulo: {_yaml_escape(article.titulo)}
resumen: {_yaml_escape(article.resumen)}
porQueImporta: {_yaml_escape(article.por_que_importa)}
categoria: {_yaml_escape(article.categoria)}
{imagen_yaml}fuente:
  nombre: {_yaml_escape(item.fuente_nombre)}
  url: {_yaml_escape(item.url)}
fecha: {item.fecha.strftime("%Y-%m-%dT%H:%M:%SZ")}
tags:
{tags_yaml if article.tags else "  []"}
---

{article.cuerpo}
"""

    if dry_run:
        log.info("[dry-run] escribiría: %s", path.relative_to(ROOT))
    else:
        CONTENT_DIR.mkdir(parents=True, exist_ok=True)
        path.write_text(frontmatter, encoding="utf-8")
        log.info("Escrito: %s", path.relative_to(ROOT))
    return path


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="No escribe archivos")
    ap.add_argument("--verbose", action="store_true", help="Log detallado")
    ap.add_argument("--max", type=int, default=None, help="Override tope de noticias por run")
    args = ap.parse_args()

    setup_logging(args.verbose)

    # En dry-run no se llama a Claude, así que la API key no es obligatoria.
    if not args.dry_run and "ANTHROPIC_API_KEY" not in os.environ:
        log.error("Falta ANTHROPIC_API_KEY en el entorno. Configúrala en .env o como secret en CI.")
        return 1

    if not SOURCES_FILE.exists():
        log.error("No existe sources.yml en %s", SOURCES_FILE)
        return 1

    config_full = yaml.safe_load(SOURCES_FILE.read_text(encoding="utf-8"))
    fuentes = [f for f in config_full.get("fuentes", []) if f.get("activa", True)]
    config = config_full.get("config", {})
    max_total = args.max or config.get("max_noticias_por_run", 8)
    max_por_fuente = config.get("max_por_fuente", 2)
    modelo = config.get("modelo", "claude-haiku-4-5")
    user_agent = config.get("user_agent", "AutomatizacionLatAm-Aggregator/0.1")

    log.info("Modelo: %s · max total: %d · max/fuente: %d", modelo, max_total, max_por_fuente)

    state = load_state()
    procesados: dict[str, Any] = state.get("procesados", {})

    # Recolectar candidatos
    candidatos: list[FeedItem] = []
    for fuente in fuentes:
        items = fetch_feed(fuente, user_agent)
        nuevos = [i for i in items if i.item_id not in procesados][:max_por_fuente]
        candidatos.extend(nuevos)

    if not candidatos:
        log.info("Sin noticias nuevas. Termino.")
        save_state(state)
        return 0

    # Ordenar por fecha desc y tomar los top N
    candidatos.sort(key=lambda i: i.fecha, reverse=True)
    candidatos = candidatos[:max_total]
    log.info("Procesando %d noticias nuevas con Claude…", len(candidatos))

    client: Anthropic | None = None if args.dry_run else Anthropic()
    escritas = 0
    for item in candidatos:
        log.info("→ %s (%s)", item.titulo_original[:80], item.fuente_nombre)
        if args.dry_run:
            log.info("  [dry-run] saltando llamada a Claude")
            escritas += 1
            continue
        assert client is not None
        article = rewrite_with_claude(client, item, modelo)
        if article is None:
            log.warning("  saltado")
            continue
        write_article(item, article, args.dry_run)
        procesados[item.item_id] = {
            "url": item.url,
            "fuente": item.fuente_nombre,
            "fecha_proceso": dt.datetime.now(dt.timezone.utc).isoformat(),
        }
        escritas += 1

    state["procesados"] = procesados
    if not args.dry_run:
        save_state(state)

    log.info("Listo. %d noticias publicadas.", escritas)
    return 0


if __name__ == "__main__":
    sys.exit(main())

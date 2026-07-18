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
import urllib.request
import urllib.error
import urllib.parse
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
PLAN_FILE = STATE_DIR / "daily-plan.json"
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

REGLA #0 — Filtro de alcance (la más importante, evalúala PRIMERO):
Si el titular o resumen NO trata sobre alguno de estos temas, debes responder EXACTAMENTE con \
este JSON (sin texto extra, sin explicaciones, sin disculpas, sin recomendaciones):
  {"skip": true, "razon": "off-topic"}

Temas en alcance (lista cerrada):
- Automatización industrial, PLC, HMI, SCADA, DCS, instrumentación, motion control, variadores.
- Robótica industrial, cobots, AGV, AMR, visión de máquina industrial.
- Industria 4.0, IIoT, gemelos digitales, MES, edge computing industrial.
- Inteligencia artificial generativa, LLMs, agentes IA, modelos de imagen/video (GPT, Claude, \
  Gemini, Veo, Sora, DALL·E), IA aplicada a manufactura, regulación y ética de IA, GPUs IA.
- Ciberseguridad OT, ataques a infraestructura industrial, vulnerabilidades PLC/HMI, normas \
  IEC 62443, post-cuántica, NIST OT, CISA.
- Energía industrial, gestión energética, microgrids, renovables a escala industrial, \
  descarbonización de plantas, refrigeración de data centers.
- Mercado y negocios del sector (fusiones, lanzamientos comerciales, certificaciones CMMC/ISO).
- Casos de estudio reales en plantas/fábricas con métricas medibles.
- Salud pública / regulación / política SOLO cuando esté relacionada con automatización o \
  ciberseguridad industrial.

Temas FUERA de alcance (responde SIEMPRE con skip:true):
- Cine, series, televisión, anime, manga, streaming.
- Música, conciertos, álbumes, artistas musicales.
- Cultura pop, celebridades, famosos, farándula, realeza.
- Deportes, fútbol, atletismo, eSports.
- Gaming/videojuegos de consumo (no industrial).
- Moda, belleza, lifestyle.
- Gastronomía, recetas, restaurantes.
- Viajes, turismo, hoteles.
- Horóscopos, espiritualidad, astrología.
- Política general, elecciones, partidos políticos.
- Smartphones de consumo, gadgets domésticos (excepto los relacionados con IA o industria).
- Salud personal individual (consejos médicos a usuarios).

CRÍTICO: si la nota es off-topic, NO escribas un artículo de rechazo, NO expliques las reglas, \
NO sugieras alternativas, NO uses los campos titulo/resumen/cuerpo para explicarte. Solo el \
JSON {"skip": true, "razon": "..."}.

Reglas críticas (no negociables — aplican solo si la nota está EN alcance):
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
  "titulo": "Titular en español, atractivo y descriptivo, MÁXIMO 65 caracteres (para que Google no lo trunque)",
  "resumen": "Resumen original de 2-3 frases (max 280 caracteres). Da el qué y el porqué.",
  "categoria": "Una de las 8 categorías permitidas",
  "porQueImporta": "1-2 frases sobre el impacto para la industria en LatAm.",
  "cuerpo": "Artículo en markdown de 700-1000 palabras (NUNCA menos de 700). Usa ## para 5-6 \
secciones bien desarrolladas, por ejemplo: contexto del sector, qué se anunció, cómo funciona / \
detalles técnicos, cifras y datos concretos, implicaciones prácticas para plantas y equipos en \
LatAm, y qué vigilar a futuro. Profundiza de verdad: cada sección con 2-4 párrafos sustanciales, \
aporta cifras específicas, nombres propios de tecnologías, equipos y estándares (IEC, OPC UA, \
Siemens, Schneider, etc.), ejemplos concretos y comparaciones. Escribe para un ingeniero o \
técnico que quiere entender a fondo, no un resumen superficial. NO uses tablas ni HTML — solo \
markdown puro con encabezados ## y párrafos.",
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
    imagen_atribucion: str = ""    # Texto a mostrar bajo la imagen (Foto: ...)
    imagen_fuente: str = ""        # "Openverse" | "Wikimedia" | "" si viene del feed RSS
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


def load_daily_plan(path: Path) -> dict[str, Any]:
    """Carga el daily-plan.json del orquestador. Best-effort: si no existe o está
    corrupto devuelve un plan vacío y el agregador se comporta como siempre."""
    if not path.exists():
        log.info("Sin daily-plan (%s) — selección por fecha, sin cuotas.", path.name)
        return {"max_por_categoria": {}, "keywords_prioritarias": []}
    try:
        plan = json.loads(path.read_text(encoding="utf-8"))
        kws = plan.get("keywords_prioritarias", []) or []
        cuotas = plan.get("max_por_categoria", {}) or {}
        log.info("Daily-plan cargado: %d keywords, %d categorías con cuota.", len(kws), len(cuotas))
        return {"max_por_categoria": cuotas, "keywords_prioritarias": kws}
    except (json.JSONDecodeError, OSError) as e:
        log.warning("Daily-plan ilegible (%s) — sigo sin él.", e)
        return {"max_por_categoria": {}, "keywords_prioritarias": []}


def _keyword_hits(item: "FeedItem", keywords: list[str]) -> int:
    """Cuántas keywords prioritarias aparecen en el titular+resumen crudos."""
    if not keywords:
        return 0
    texto = f"{item.titulo_original} {item.resumen_original}".lower()
    return sum(1 for kw in keywords if kw in texto)


# ---------------------------------------------------------------------------
# Lectura de feeds
# ---------------------------------------------------------------------------

def _clean_html(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True))


# Stopwords mínimas EN+ES para limpiar la query de búsqueda de imágenes.
_STOPWORDS = frozenset({
    "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with",
    "is", "are", "was", "were", "be", "been", "by", "at", "from", "as",
    "el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o",
    "de", "del", "en", "con", "por", "para", "que", "se", "su", "sus",
    "al", "lo", "es", "son", "fue", "fueron", "ser", "estar", "ha", "han",
})


def _build_image_query(titulo: str) -> str:
    """Genera una query corta de búsqueda a partir del título original.

    Quita stopwords y puntuación, toma las primeras 4-5 palabras
    significativas. Funciona razonablemente bien en inglés y español.
    """
    palabras = re.findall(r"[A-Za-zÁÉÍÓÚÑñáéíóú0-9]+", titulo)
    significativas = [p for p in palabras if p.lower() not in _STOPWORDS and len(p) >= 3]
    return " ".join(significativas[:5])


def _search_image_openverse(query: str, user_agent: str) -> tuple[str, dict[str, str]]:
    """Busca una imagen libre en Openverse (Flickr/Wikimedia/etc agregado).

    Licencias aceptadas: cc0, by (uso comercial OK). Rechaza nd y nc.
    Retorna (url, meta) o ("", {}) si no encontró.
    """
    try:
        url_api = (
            "https://api.openverse.engineering/v1/images/?"
            f"q={urllib.parse.quote(query)}"
            "&license_type=commercial"
            "&size=medium,large"
            "&page_size=10"
        )
        req = urllib.request.Request(
            url_api,
            headers={
                "User-Agent": user_agent,
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        for result in data.get("results", []):
            img_url = (result.get("url") or "").strip()
            if not img_url or not img_url.startswith("http"):
                continue
            license_code = (result.get("license") or "").lower()
            if license_code not in ("cc0", "by", "by-sa", "pdm"):
                continue
            autor = (result.get("creator") or "Desconocido").strip()
            licencia_label = {
                "cc0": "CC0 (dominio público)",
                "pdm": "Dominio público",
                "by": f"CC BY {result.get('license_version', '')}".strip(),
                "by-sa": f"CC BY-SA {result.get('license_version', '')}".strip(),
            }.get(license_code, license_code.upper())
            atribucion = f"Foto: {autor} · Openverse · {licencia_label}"
            return img_url, {
                "atribucion": atribucion,
                "fuente": "Openverse",
            }
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as e:
        log.debug("  Openverse falló (no crítico): %s", e)
    except Exception as e:
        log.debug("  Openverse error inesperado (no crítico): %s", e)
    return "", {}


def _search_image_wikimedia(query: str, user_agent: str) -> tuple[str, dict[str, str]]:
    """Busca una imagen libre en Wikimedia Commons.

    Todas las imágenes en Commons son libres por política. Atribución
    requerida por cortesía. Retorna (url, meta) o ("", {}).
    """
    try:
        url_api = (
            "https://commons.wikimedia.org/w/api.php?"
            "action=query&format=json"
            f"&generator=search&gsrsearch={urllib.parse.quote(query)}"
            "&gsrnamespace=6&gsrlimit=5"
            "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200"
        )
        req = urllib.request.Request(
            url_api,
            headers={
                "User-Agent": "AutomatizacionLatAm/1.0 (https://automatizacionslatam.com; bot@automatizacionslatam.com) " + user_agent,
                "Accept": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        pages = (data.get("query") or {}).get("pages") or {}
        for _, page in pages.items():
            infos = page.get("imageinfo") or []
            if not infos:
                continue
            info = infos[0]
            img_url = info.get("thumburl") or info.get("url") or ""
            # La URL puede tener ?query=string al final; verificar path sin querystring.
            url_path = img_url.split("?", 1)[0].lower()
            if not url_path.endswith((".jpg", ".jpeg", ".png", ".webp")):
                continue
            extm = info.get("extmetadata") or {}
            autor_raw = (extm.get("Artist") or {}).get("value") or "Wikimedia Commons"
            autor = _clean_html(autor_raw)[:80] if autor_raw else "Wikimedia Commons"
            licencia = (extm.get("LicenseShortName") or {}).get("value") or "Libre"
            atribucion = f"Foto: {autor} · Wikimedia Commons · {licencia}"
            return img_url, {
                "atribucion": atribucion,
                "fuente": "Wikimedia",
            }
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as e:
        log.debug("  Wikimedia falló (no crítico): %s", e)
    except Exception as e:
        log.debug("  Wikimedia error inesperado (no crítico): %s", e)
    return "", {}


_IMAGE_QUERY_SYSTEM = """You generate short English keywords (2-3 words max) for free stock-photo APIs (Openverse, Wikimedia). Given an article title in any language, output ONLY 2-3 keywords — no quotes, no punctuation, no explanation. Prefer single visual concrete nouns: "robot", "factory", "server", "laboratory", "hacker", "circuit board". Avoid abstract terms ("innovation", "transformation"). For specific tech (CVE-2025-1234, GPT-5, Vera Rubin) generalize to a visual concept ("hacker computer", "data center", "AI chip"). Stay under 3 words. Output keywords only."""


def _refine_query_with_claude(client: "Anthropic | None", titulo: str, modelo: str) -> str:
    """Usa Claude (best-effort) para convertir el título en keywords visuales.

    Si Claude falla, devuelve "" para que el caller use la heurística.
    El system prompt está congelado para que el prompt-cache de Anthropic
    aplique entre llamadas (90% más barato del 2do hit en adelante).
    """
    if client is None:
        return ""
    try:
        response = client.messages.create(
            model=modelo,
            max_tokens=40,
            system=[
                {
                    "type": "text",
                    "text": _IMAGE_QUERY_SYSTEM,
                    "cache_control": {"type": "ephemeral"},
                },
            ],
            messages=[{"role": "user", "content": f"Title: {titulo}"}],
        )
        text = "".join(b.text for b in response.content if b.type == "text").strip()
        # Limpiar: una sola línea, sin comillas
        text = text.replace('"', '').replace("'", "").split("\n")[0].strip()
        if 3 <= len(text) <= 100:
            return text
    except Exception as e:
        log.debug("  refine_query_with_claude falló (no crítico): %s", e)
    return ""


def _find_image_for(item: "FeedItem", user_agent: str, client: "Anthropic | None" = None, modelo: str = "claude-haiku-4-5") -> None:
    """Pobla item.imagen / imagen_atribucion / imagen_fuente si falta imagen.

    Cascada de queries: Claude refinada → primeras 2 palabras → primera palabra.
    Cascada de fuentes: Openverse → Wikimedia Commons.
    Best-effort: nunca aborta el flujo si las APIs fallan.
    """
    if item.imagen:
        return  # ya tiene imagen del feed
    # Query mejorada con Claude (si disponible), o heurística como fallback.
    primary = _refine_query_with_claude(client, item.titulo_original, modelo) or _build_image_query(item.titulo_original)
    if not primary:
        return
    # Generar cascada de queries: full → 2 palabras → 1 palabra.
    palabras = primary.split()
    candidatas = [primary]
    if len(palabras) > 2:
        candidatas.append(" ".join(palabras[:2]))
    if len(palabras) > 1:
        candidatas.append(palabras[0])
    # Dedupe preservando orden
    seen: set[str] = set()
    queries = [q for q in candidatas if not (q in seen or seen.add(q))]

    for q in queries:
        log.debug("  Probando query: %s", q)
        img, meta = _search_image_openverse(q, user_agent)
        if img:
            item.imagen = img
            item.imagen_atribucion = meta.get("atribucion", "")
            item.imagen_fuente = meta.get("fuente", "")
            log.info("  ✓ Imagen Openverse (q=%s): %s", q, item.imagen_atribucion)
            return
    # Fallback: probar Wikimedia con la primera query
    img, meta = _search_image_wikimedia(queries[0], user_agent)
    if img:
        item.imagen = img
        item.imagen_atribucion = meta.get("atribucion", "")
        item.imagen_fuente = meta.get("fuente", "")
        log.info("  ✓ Imagen Wikimedia: %s", item.imagen_atribucion)
        return
    log.debug("  Sin imagen para esta noticia (no se encontró en ninguna API).")


# --- Filtro pre-Claude: descartar URLs claramente off-topic --------------
# Si una fuente publica eventualmente noticias de cine, deportes, celebridades,
# etc., el path de la URL suele tener un slug categórico. Lo aprovechamos para
# nunca enviar esos items a Claude (ahorra tokens y elimina riesgo de
# contenido off-topic publicado).
_OFF_TOPIC_URL_PATTERNS = (
    "/cine", "/peliculas", "/pelicula", "/television", "/tv-",
    "/series/", "/serie-", "/anime", "/manga",
    "/musica", "/cancion", "/album",
    "/cultura", "/entretenimiento", "/famosos", "/celebridades",
    "/gaming", "/videojuegos", "/videojuego",
    "/deportes", "/futbol", "/basket",
    "/moda", "/belleza", "/estilo-de-vida",
    "/gastronomia", "/recetas", "/cocina",
    "/viajes", "/turismo",
    "/horoscopo", "/zodiaco",
    "/realeza", "/farandula",
)


def _is_url_off_topic(url: str) -> bool:
    """True si la URL contiene un slug categórico claramente off-topic."""
    u = url.lower()
    return any(p in u for p in _OFF_TOPIC_URL_PATTERNS)


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
        # CAPA 1: descartar items off-topic por path de la URL antes de pasarlos a Claude.
        if _is_url_off_topic(url):
            log.info("  ⊘ Off-topic descartado por URL: %s", url[:80])
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

            # CAPA 2: si Claude usó el formato oficial de skip, descartar.
            if isinstance(data, dict) and data.get("skip") is True:
                log.info("  ⊘ Claude marcó skip:true — %s", data.get("razon", "off-topic"))
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


# Patrones que delatan una "respuesta de rechazo" que Claude pudo haber colado
# usando los campos titulo/resumen/cuerpo en vez del JSON {"skip":true}.
# Si alguno de estos aparece en titulo o en el inicio del cuerpo, descartamos.
_REJECTION_TITLE_PATTERNS = (
    "error:", "error ", "aviso:", "aclaración", "aclaracion",
    "fuera de alcance", "fuera del alcance", "no aplicable", "no relevante",
    "no corresponde", "no procede", "disculpa", "lo siento",
    "no puedo procesar", "no es posible procesar",
    "recomendación:", "recomendacion:",
)

_REJECTION_BODY_PATTERNS = (
    "## aclaración", "## aclaracion", "## error",
    "fuera de alcance editorial", "fuera del alcance editorial",
    "fuera del scope", "no corresponde al área de cobertura",
    "no corresponde al area de cobertura",
    "comparta artículos", "comparta articulos", "comparta urls",
    "para procesar adecuadamente",
    "mi función es producir", "mi funcion es producir",
)

_REJECTION_TAG_PATTERNS = (
    "error-alcance", "fuera-de-alcance", "fuera-del-alcance",
    "redireccion-editorial", "contenido-no-industrial",
    "no-aplicable", "no-relevante", "off-topic",
)


def _looks_like_rejection(data: dict[str, Any]) -> str:
    """Devuelve string descriptivo si la respuesta parece un rechazo
    formateado como artículo. Cadena vacía si pasa el filtro.
    """
    titulo = str(data.get("titulo", "")).lower().strip()
    cuerpo = str(data.get("cuerpo", "")).lower().strip()
    tags = [str(t).lower().strip() for t in (data.get("tags") or [])]

    for p in _REJECTION_TITLE_PATTERNS:
        if titulo.startswith(p) or f" {p}" in titulo[:60]:
            return f"título sospechoso (contiene '{p}')"
    # Solo miramos los primeros 400 chars del cuerpo
    cuerpo_inicio = cuerpo[:400]
    for p in _REJECTION_BODY_PATTERNS:
        if p in cuerpo_inicio:
            return f"cuerpo arranca con '{p}'"
    for p in _REJECTION_TAG_PATTERNS:
        if p in tags:
            return f"tag sospechoso '{p}'"
    return ""


def _validate_article(data: dict[str, Any]) -> RewrittenArticle | None:
    required = ["titulo", "resumen", "categoria", "porQueImporta", "cuerpo", "tags"]
    for k in required:
        if k not in data:
            log.warning("  Campo faltante en JSON: %s", k)
            return None

    # CAPA 3: detectar respuestas de rechazo formateadas como artículo real.
    motivo_rechazo = _looks_like_rejection(data)
    if motivo_rechazo:
        log.info("  ⊘ Respuesta parece rechazo — %s", motivo_rechazo)
        return None

    cat = data["categoria"].strip()
    if cat not in CATEGORIAS_VALIDAS:
        log.warning("  Categoría inválida '%s', forzando 'General'", cat)
        cat = "General"

    tags = data.get("tags", [])
    if not isinstance(tags, list):
        tags = []
    tags = [str(t).lower().strip() for t in tags if t][:5]

    # CAPA 4: rechazar artículos cortos. El piso DEBE coincidir con
    # PODA_MIN_PALABRAS del frontend (src/pages/noticia/[...slug].astro): si una
    # noticia nace con < 450 palabras, el frontend la desindexaría de inmediato,
    # así que mejor no escribirla — gasta tokens y engorda el corpus thin que
    # activa el clasificador site-wide de contenido útil de Google.
    MIN_PALABRAS_CUERPO = 450
    cuerpo = str(data["cuerpo"]).strip()
    palabras_cuerpo = len(re.findall(r"\S+", cuerpo))
    if palabras_cuerpo < MIN_PALABRAS_CUERPO:
        log.info("  ⊘ Cuerpo con %d palabras (mínimo %d) — descartando thin content",
                 palabras_cuerpo, MIN_PALABRAS_CUERPO)
        return None

    # CAPA 5: el "por qué importa" es lo único semi-original frente al feed
    # ajeno. Sin él, la noticia es un rewrite puro que el frontend desindexaría;
    # la descartamos aquí para no generarla.
    if not str(data["porQueImporta"]).strip():
        log.info("  ⊘ Sin 'por qué importa' — descartando (sería noindex en el front)")
        return None

    return RewrittenArticle(
        titulo=str(data["titulo"]).strip()[:140],
        resumen=str(data["resumen"]).strip()[:300],
        categoria=cat,
        por_que_importa=str(data["porQueImporta"]).strip()[:500],
        cuerpo=cuerpo,
        tags=tags,
    )


# ---------------------------------------------------------------------------
# Escritura de .md
# ---------------------------------------------------------------------------

def _yaml_escape(s: str) -> str:
    # Comillas dobles + escape de comillas internas
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def notify_indexnow(urls: list[str], site_host: str, key: str) -> None:
    """Avisa a Bing/Yandex/Naver/etc que hay URLs nuevas (IndexNow protocol).

    No falla el run si IndexNow responde error — es best-effort.
    """
    if not urls or not key or not site_host:
        return
    payload = {
        "host": site_host,
        "key": key,
        "keyLocation": f"https://{site_host}/{key}.txt",
        "urlList": urls,
    }
    try:
        req = urllib.request.Request(
            "https://api.indexnow.org/indexnow",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            log.info("IndexNow: %d URLs notificadas (status %d)", len(urls), resp.status)
    except urllib.error.HTTPError as e:
        # 202 Accepted es éxito; otros códigos los loguea pero no abortan.
        if e.code == 200 or e.code == 202:
            log.info("IndexNow: %d URLs notificadas (status %d)", len(urls), e.code)
        else:
            log.warning("IndexNow respondió %d: %s", e.code, e.reason)
    except Exception as e:
        log.warning("IndexNow falló (no crítico): %s", e)


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

    tags_yaml = "\n".join(f"  - {_yaml_escape(t)}" for t in article.tags) if article.tags else "  []"
    imagen_yaml = f"imagen: {_yaml_escape(item.imagen)}\n" if item.imagen else ""
    imagen_atribucion_yaml = f"imagen_atribucion: {_yaml_escape(item.imagen_atribucion)}\n" if item.imagen_atribucion else ""
    imagen_fuente_yaml = f"imagen_fuente: {_yaml_escape(item.imagen_fuente)}\n" if item.imagen_fuente else ""

    frontmatter = f"""---
titulo: {_yaml_escape(article.titulo)}
resumen: {_yaml_escape(article.resumen)}
porQueImporta: {_yaml_escape(article.por_que_importa)}
categoria: {_yaml_escape(article.categoria)}
{imagen_yaml}{imagen_atribucion_yaml}{imagen_fuente_yaml}fuente:
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
    ap.add_argument("--daily-plan", default=str(PLAN_FILE),
                    help="Ruta al daily-plan.json del orquestador (cuotas + keywords)")
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
    # Ritmo throttled (2026-07-18): bajado de 8 a 2 por run. Con la cadencia de
    # 3 runs/día que fijó el owner, son máx 6 noticias/día (antes 24). Menos
    # volumen + piso de 450 palabras = corpus más denso y menos superficie thin
    # que arrastre a las guías en el clasificador de contenido útil de Google.
    max_total = args.max or config.get("max_noticias_por_run", 2)
    max_por_fuente = config.get("max_por_fuente", 2)
    modelo = config.get("modelo", "claude-haiku-4-5")
    user_agent = config.get("user_agent", "AutomatizacionLatAm-Aggregator/0.1")

    log.info("Modelo: %s · max total: %d · max/fuente: %d", modelo, max_total, max_por_fuente)

    # Plan editorial del orquestador: keywords prioritarias (re-rank) + cuotas
    # por categoría (corrige la deriva de nicho). Best-effort: si no hay plan,
    # el agregador se comporta como siempre (orden por fecha, sin topes).
    plan = load_daily_plan(Path(args.daily_plan))
    keywords_prioritarias: list[str] = plan["keywords_prioritarias"]
    cuotas: dict[str, int] = plan["max_por_categoria"]

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

    # Re-rank: primero los que matchean keywords prioritarias (categorías
    # hambrientas / demanda de Search Console), desempatando por fecha desc.
    # Sin plan, _keyword_hits da 0 para todos → queda el orden por fecha de antes.
    candidatos.sort(key=lambda i: (_keyword_hits(i, keywords_prioritarias), i.fecha), reverse=True)
    if keywords_prioritarias:
        con_match = sum(1 for i in candidatos if _keyword_hits(i, keywords_prioritarias))
        log.info("Re-rank por plan: %d/%d candidatos matchean keywords prioritarias.",
                 con_match, len(candidatos))
    # No truncamos a max_total aún: las cuotas por categoría pueden saltar items,
    # y queremos candidatos de reserva para llenar el cupo del run.
    log.info("Procesando hasta %d noticias (de %d candidatos) con Claude…", max_total, len(candidatos))

    client: Anthropic | None = None if args.dry_run else Anthropic()
    escritas = 0
    nuevas_paths: list[Path] = []
    publicadas_por_categoria: dict[str, int] = {}
    llamadas = 0
    # Tope de llamadas a Claude: max_total + holgura para rellenar cupos cuando
    # las cuotas saltan algún artículo. Acota el costo aunque haya muchos
    # candidatos de una categoría topada.
    limite_llamadas = max_total + 5
    for item in candidatos:
        if escritas >= max_total:
            break
        log.info("→ %s (%s)", item.titulo_original[:80], item.fuente_nombre)
        if args.dry_run:
            hits = _keyword_hits(item, keywords_prioritarias)
            log.info("  [dry-run] saltando llamada a Claude (keyword hits: %d)", hits)
            escritas += 1
            continue
        if llamadas >= limite_llamadas:
            log.info("  Tope de llamadas a Claude (%d) alcanzado — cierro el run.", limite_llamadas)
            break
        assert client is not None
        # Si la fuente no proveyó imagen, buscar en APIs libres (Openverse, Wikimedia).
        # Falla silenciosamente si las APIs no responden — el artículo se publica igual.
        try:
            _find_image_for(item, user_agent, client=client, modelo=modelo)
        except Exception as e:
            log.warning("  Búsqueda de imagen falló (no crítico): %s", e)
        llamadas += 1
        article = rewrite_with_claude(client, item, modelo)
        if article is None:
            log.warning("  saltado")
            continue
        # Cuota por categoría (plan del orquestador): si esta categoría ya llenó
        # su cupo del run, saltamos el artículo para corregir la deriva de nicho.
        cap = cuotas.get(article.categoria, 99)
        if publicadas_por_categoria.get(article.categoria, 0) >= cap:
            log.info("  ⊘ cuota de categoría alcanzada (%s, máx %d) — saltado.",
                     article.categoria, cap)
            continue
        path = write_article(item, article, args.dry_run)
        nuevas_paths.append(path)
        publicadas_por_categoria[article.categoria] = publicadas_por_categoria.get(article.categoria, 0) + 1
        procesados[item.item_id] = {
            "url": item.url,
            "fuente": item.fuente_nombre,
            "fecha_proceso": dt.datetime.now(dt.timezone.utc).isoformat(),
        }
        escritas += 1

    state["procesados"] = procesados
    if not args.dry_run:
        save_state(state)

    # IndexNow: avisar a Bing/Yandex/Naver de las URLs nuevas (best-effort).
    if not args.dry_run and nuevas_paths:
        site_url = os.environ.get("SITE_URL", "").rstrip("/")
        indexnow_key = os.environ.get("INDEXNOW_KEY", "").strip()
        if site_url and indexnow_key:
            host = site_url.replace("https://", "").replace("http://", "").split("/")[0]
            urls = [
                f"{site_url}/noticia/{p.stem}/"
                for p in nuevas_paths
            ]
            notify_indexnow(urls, host, indexnow_key)
        else:
            log.info("IndexNow: SITE_URL o INDEXNOW_KEY no configurados, saltando.")

    log.info("Listo. %d noticias publicadas.", escritas)
    return 0


if __name__ == "__main__":
    sys.exit(main())

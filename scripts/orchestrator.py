"""
Orquestador editorial — el "cerebro" de la flota de agentes.

Cada corrida (antes del agregador) decide QUÉ debe publicarse hoy, en vez de
dejar que el RSS mande por pura fecha. Combina dos señales:

  1. Señal INTERNA (siempre disponible): el balance de categorías del corpus
     actual en src/content/noticias/. Detecta la deriva hacia "Inteligencia
     Artificial" y topa esa categoría para liberar espacio a las hambrientas
     (PLC, Robótica, Casos de Estudio, Energía).

  2. Señal de DEMANDA (si analytics.py la dejó): scripts/state/analytics-report.json
     con queries reales de Search Console (huecos de contenido) y categorías que
     traen tráfico en GA4. Si el reporte no existe o viene "degradado", el plan
     se construye solo con la señal interna — nunca falla por eso.

Salida:
  - scripts/state/daily-plan.json  → contrato que consume aggregator.py
  - scripts/state/daily-report.md  → resumen legible (va al Step Summary del CI)

Uso:
    py scripts/orchestrator.py            # genera el plan del día
    py scripts/orchestrator.py --verbose  # log detallado
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Rutas y constantes
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src" / "content" / "noticias"
STATE_DIR = Path(__file__).resolve().parent / "state"
ANALYTICS_FILE = STATE_DIR / "analytics-report.json"
PLAN_FILE = STATE_DIR / "daily-plan.json"
REPORT_FILE = STATE_DIR / "daily-report.md"

# Las 9 categorías válidas (debe coincidir con CATEGORIAS_VALIDAS en aggregator.py
# y con el enum Zod en src/content/config.ts).
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

# Reparto OBJETIVO del corpus. La suma es 1.0. Refleja la identidad del sitio:
# automatización industrial LatAm primero; IA presente pero sin dominar. Cuando
# una categoría supera su objetivo por margen, el orquestador la topa.
TARGET_SHARE = {
    "PLC y Control": 0.20,
    "Robótica": 0.12,
    "Industria 4.0": 0.14,
    "Inteligencia Artificial": 0.16,
    "Ciberseguridad OT": 0.12,
    "Energía y Sostenibilidad": 0.10,
    "Mercado y Negocios": 0.08,
    "Casos de Estudio": 0.06,
    "General": 0.02,
}

# Si la cuota-share real supera TARGET * este factor, la categoría se considera
# sobre-representada y se topa a CAP_SOBRE por run.
FACTOR_SOBRE = 1.3
CAP_SOBRE = 1        # máx. artículos por run de una categoría sobre-representada
CAP_LIBRE = 99       # sin tope efectivo para las que no están saturadas

# Keywords semilla por categoría (en inglés porque los titulares RSS llegan en
# inglés y el re-rank del agregador matchea contra el titular crudo). Se usan
# para priorizar candidatos de las categorías hambrientas.
KEYWORDS_POR_CATEGORIA = {
    "PLC y Control": [
        "plc", "scada", "hmi", "dcs", "ladder", "iec 61131", "vfd",
        "variable frequency drive", "motion control", "instrumentation",
        "opc ua", "field sensor", "controller", "automation controller",
    ],
    "Robótica": [
        "robot", "cobot", "collaborative robot", "agv", "amr", "robotic arm",
        "end effector", "machine vision", "robotics", "pick and place",
    ],
    "Industria 4.0": [
        "iiot", "industrial iot", "digital twin", "mes", "edge computing",
        "smart factory", "connected factory", "it/ot",
    ],
    "Ciberseguridad OT": [
        "ot security", "ics security", "vulnerability", "cve", "ransomware",
        "iec 62443", "critical infrastructure", "scada attack", "plc exploit",
    ],
    "Energía y Sostenibilidad": [
        "energy management", "microgrid", "renewable", "decarbonization",
        "energy efficiency", "solar", "battery storage", "data center cooling",
    ],
    "Mercado y Negocios": [
        "acquisition", "merger", "funding", "investment", "product launch",
        "partnership", "certification",
    ],
    "Casos de Estudio": [
        "case study", "deployment", "retrofit", "plant modernization",
        "factory implementation", "real-world results", "rollout",
    ],
    "Inteligencia Artificial": [
        "llm", "generative ai", "ai agent", "machine learning model",
    ],
    "General": [],
}

log = logging.getLogger("orquestador")


# ---------------------------------------------------------------------------
# Señal interna: distribución del corpus
# ---------------------------------------------------------------------------

_CAT_RE = re.compile(r'^categoria:\s*"?([^"\n]+)"?\s*$', re.MULTILINE)


def corpus_distribution() -> dict[str, int]:
    """Cuenta cuántos artículos hay por categoría leyendo el frontmatter."""
    conteo: dict[str, int] = {c: 0 for c in CATEGORIAS_VALIDAS}
    if not CONTENT_DIR.exists():
        return conteo
    for md in CONTENT_DIR.glob("*.md"):
        try:
            # Solo necesitamos el frontmatter (primeras ~25 líneas).
            head = md.read_text(encoding="utf-8")[:1500]
        except OSError:
            continue
        m = _CAT_RE.search(head)
        if m:
            cat = m.group(1).strip()
            if cat in conteo:
                conteo[cat] += 1
    return conteo


# ---------------------------------------------------------------------------
# Señal de demanda: reporte de analytics (best-effort)
# ---------------------------------------------------------------------------

def load_analytics() -> dict:
    """Carga analytics-report.json si existe; si no, devuelve un stub degradado."""
    if not ANALYTICS_FILE.exists():
        log.info("Sin analytics-report.json — plan con señal interna únicamente.")
        return {"fuente_datos": "ausente", "search_console": {}, "ga4": {}}
    try:
        data = json.loads(ANALYTICS_FILE.read_text(encoding="utf-8"))
        log.info("Analytics cargado (fuente: %s).", data.get("fuente_datos", "?"))
        return data
    except (OSError, json.JSONDecodeError) as e:
        log.warning("No pude leer analytics-report.json (%s) — sigo degradado.", e)
        return {"fuente_datos": "error", "search_console": {}, "ga4": {}}


# ---------------------------------------------------------------------------
# Construcción del plan
# ---------------------------------------------------------------------------

def build_plan(conteo: dict[str, int], analytics: dict) -> dict:
    total = sum(conteo.values()) or 1
    shares = {c: conteo[c] / total for c in CATEGORIAS_VALIDAS}

    # 1) Cuotas: topar las sobre-representadas, liberar las demás.
    max_por_categoria: dict[str, int] = {}
    sobre: list[str] = []
    hambrientas: list[str] = []
    for c in CATEGORIAS_VALIDAS:
        objetivo = TARGET_SHARE.get(c, 0.05)
        if shares[c] > objetivo * FACTOR_SOBRE:
            max_por_categoria[c] = CAP_SOBRE
            sobre.append(c)
        else:
            max_por_categoria[c] = CAP_LIBRE
            if shares[c] < objetivo:
                hambrientas.append(c)

    # 2) Keywords prioritarias: categorías hambrientas + huecos de Search Console.
    keywords: list[str] = []
    for c in hambrientas:
        keywords.extend(KEYWORDS_POR_CATEGORIA.get(c, []))

    sc = analytics.get("search_console", {}) or {}
    huecos = sc.get("huecos_contenido", []) or []
    for h in huecos:
        q = (h.get("query") or "").strip().lower()
        if q:
            keywords.append(q)

    # 3) Refuerzo de ganadores: categorías con más sesiones reciben sus keywords
    #    aunque no estén hambrientas (perseguir lo que ya trae tráfico), salvo
    #    que estén topadas por sobre-representación.
    ga4 = analytics.get("ga4", {}) or {}
    sesiones = ga4.get("sesiones_por_categoria", {}) or {}
    ganadoras = sorted(sesiones.items(), key=lambda kv: kv[1], reverse=True)[:3]
    for c, _ in ganadoras:
        if c in CATEGORIAS_VALIDAS and c not in sobre:
            keywords.extend(KEYWORDS_POR_CATEGORIA.get(c, []))

    # Dedup preservando orden.
    keywords = list(dict.fromkeys(k for k in keywords if k))

    razon = _razonamiento(shares, sobre, hambrientas, huecos, ganadoras, analytics)

    return {
        "generado": dt.datetime.now(dt.timezone.utc).isoformat(),
        "fuente_datos": analytics.get("fuente_datos", "ausente"),
        "distribucion_actual": conteo,
        "max_por_categoria": max_por_categoria,
        "keywords_prioritarias": keywords,
        "razonamiento": razon,
    }


def _razonamiento(shares, sobre, hambrientas, huecos, ganadoras, analytics) -> str:
    partes: list[str] = []
    if sobre:
        det = ", ".join(f"{c} ({shares[c]*100:.0f}%)" for c in sobre)
        partes.append(f"Topadas a {CAP_SOBRE}/run por sobre-representación: {det}.")
    if hambrientas:
        partes.append("Liberadas (hambrientas): " + ", ".join(hambrientas) + ".")
    if huecos:
        ej = huecos[0]
        partes.append(
            f"Search Console: '{ej.get('query')}' con {ej.get('impresiones')} "
            f"impresiones en posición {ej.get('posicion')} → hueco de contenido."
        )
    if ganadoras:
        partes.append(
            "GA4 tráfico líder: "
            + ", ".join(f"{c} ({s})" for c, s in ganadoras) + "."
        )
    if analytics.get("fuente_datos") not in ("google",):
        partes.append("(Analytics en modo degradado: plan basado solo en balance interno.)")
    return " ".join(partes) or "Corpus equilibrado; sin topes este run."


# ---------------------------------------------------------------------------
# Reporte legible
# ---------------------------------------------------------------------------

def write_report(plan: dict, analytics: dict) -> None:
    conteo = plan["distribucion_actual"]
    total = sum(conteo.values()) or 1
    lines: list[str] = []
    lines.append(f"_Generado: {plan['generado']} · fuente datos: {plan['fuente_datos']}_\n")
    lines.append("### Distribución actual del corpus\n")
    lines.append("| Categoría | Artículos | Share | Cuota hoy |")
    lines.append("|---|---:|---:|---:|")
    for c in sorted(CATEGORIAS_VALIDAS, key=lambda x: conteo[x], reverse=True):
        cap = plan["max_por_categoria"][c]
        cap_txt = "—" if cap >= CAP_LIBRE else str(cap)
        lines.append(f"| {c} | {conteo[c]} | {conteo[c]/total*100:.0f}% | {cap_txt} |")
    lines.append("")
    lines.append("### Razonamiento del plan\n")
    lines.append(plan["razonamiento"] + "\n")
    lines.append("### Keywords prioritarias (re-rank del agregador)\n")
    kws = plan["keywords_prioritarias"]
    lines.append(", ".join(f"`{k}`" for k in kws[:30]) + (" …" if len(kws) > 30 else ""))
    lines.append("")

    sc = analytics.get("search_console", {}) or {}
    top = sc.get("top_queries", []) or []
    if top:
        lines.append("### Top queries (Search Console, 28 días)\n")
        lines.append("| Query | Impresiones | Clics | CTR | Pos |")
        lines.append("|---|---:|---:|---:|---:|")
        for q in top[:10]:
            lines.append(
                f"| {q.get('query')} | {q.get('impresiones')} | {q.get('clics')} "
                f"| {q.get('ctr', 0)*100:.1f}% | {q.get('posicion', 0):.1f} |"
            )
        lines.append("")

    REPORT_FILE.write_text("\n".join(lines), encoding="utf-8")
    log.info("Reporte escrito en %s", REPORT_FILE)


def _plan_cambió(nuevo: dict) -> bool:
    """True si el contenido del plan cambió respecto al ya guardado (ignora el
    timestamp 'generado', que cambia en cada corrida)."""
    VOLATIL = {"generado"}
    try:
        viejo = json.loads(PLAN_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return True
    limpio = lambda d: {k: v for k, v in d.items() if k not in VOLATIL}
    return limpio(viejo) != limpio(nuevo)


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--verbose", action="store_true", help="Log detallado")
    args = ap.parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%H:%M:%S",
    )

    STATE_DIR.mkdir(parents=True, exist_ok=True)

    conteo = corpus_distribution()
    total = sum(conteo.values())
    log.info("Corpus: %d artículos en %d categorías.", total, sum(1 for v in conteo.values() if v))

    analytics = load_analytics()
    plan = build_plan(conteo, analytics)

    # Idempotencia: si el contenido del plan (ignorando el timestamp) es idéntico
    # al ya commiteado, no reescribimos nada. Así el cron del "cerebro" puede
    # correr cada hora sin generar commits ruidosos — solo actúa cuando hay un
    # cambio real (nuevas noticias del redactor o datos frescos de analytics).
    if PLAN_FILE.exists() and not _plan_cambió(plan):
        log.info("Plan sin cambios de contenido — no reescribo (evita commits ruidosos).")
        return 0

    PLAN_FILE.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")
    log.info("Plan escrito en %s", PLAN_FILE)
    write_report(plan, analytics)

    topadas = [c for c, v in plan["max_por_categoria"].items() if v < CAP_LIBRE]
    log.info("Categorías topadas hoy: %s", ", ".join(topadas) or "ninguna")
    log.info("Keywords prioritarias: %d", len(plan["keywords_prioritarias"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

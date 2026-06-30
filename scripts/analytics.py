"""
Agente de Analytics — lee Google Search Console + GA4 y deja un reporte que el
orquestador usa como señal de demanda real.

Diseño best-effort (igual que notify_indexnow en aggregator.py): si faltan las
credenciales, las librerías de Google no están instaladas, o la API falla, este
script NO lanza excepción — escribe un reporte "degradado" y retorna 0. El cron
de monetización nunca se cae por un problema de Google.

Credenciales: variable de entorno GOOGLE_SERVICE_ACCOUNT_JSON con el contenido
del JSON de una service account que tenga acceso de lectura a:
  - Search Console (propiedad GSC_SITE_URL)
  - GA4 (propiedad GA4_PROPERTY_ID)

Salida: scripts/state/analytics-report.json

Uso:
    py scripts/analytics.py --verbose
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src" / "content" / "noticias"
STATE_DIR = Path(__file__).resolve().parent / "state"
REPORT_FILE = STATE_DIR / "analytics-report.json"

SCOPES_GSC = ["https://www.googleapis.com/auth/webmasters.readonly"]
SCOPES_GA4 = ["https://www.googleapis.com/auth/analytics.readonly"]
VENTANA_DIAS = 28

# Umbrales para detectar "huecos de contenido": muchas impresiones pero posición
# pobre (estamos en la página 2+ de Google) y CTR bajo → vale la pena cubrir mejor.
HUECO_MIN_IMPRESIONES = 30
HUECO_MIN_POSICION = 10.0

log = logging.getLogger("analytics")


# ---------------------------------------------------------------------------
# Mapeo slug → categoría (para atribuir tráfico GA4 a categorías)
# ---------------------------------------------------------------------------

_CAT_RE = re.compile(r'^categoria:\s*"?([^"\n]+)"?\s*$', re.MULTILINE)
_PATH_RE = re.compile(r"/noticia/([^/]+)/?")


def _slug_to_categoria() -> dict[str, str]:
    idx: dict[str, str] = {}
    if not CONTENT_DIR.exists():
        return idx
    for md in CONTENT_DIR.glob("*.md"):
        try:
            head = md.read_text(encoding="utf-8")[:1500]
        except OSError:
            continue
        m = _CAT_RE.search(head)
        if m:
            idx[md.stem] = m.group(1).strip()
    return idx


# ---------------------------------------------------------------------------
# Credenciales (degrada con gracia)
# ---------------------------------------------------------------------------

def load_credentials(scopes: list[str]):
    """Construye Credentials desde GOOGLE_SERVICE_ACCOUNT_JSON. None si no se puede."""
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw:
        log.warning("GOOGLE_SERVICE_ACCOUNT_JSON ausente — modo degradado.")
        return None
    try:
        from google.oauth2 import service_account  # import perezoso
        info = json.loads(raw)
        return service_account.Credentials.from_service_account_info(info, scopes=scopes)
    except Exception as e:  # noqa: BLE001 — best-effort
        log.warning("No pude construir credenciales (%s) — modo degradado.", e)
        return None


# ---------------------------------------------------------------------------
# Search Console
# ---------------------------------------------------------------------------

def fetch_search_console(site_url: str) -> dict:
    creds = load_credentials(SCOPES_GSC)
    if creds is None or not site_url:
        return {}
    try:
        from googleapiclient.discovery import build
        service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
        hoy = dt.date.today()
        inicio = hoy - dt.timedelta(days=VENTANA_DIAS)
        body = {
            "startDate": inicio.isoformat(),
            "endDate": hoy.isoformat(),
            "dimensions": ["query"],
            "rowLimit": 100,
        }
        resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
        rows = resp.get("rows", [])
        top_queries = []
        huecos = []
        for r in rows:
            q = r.get("keys", ["?"])[0]
            impr = int(r.get("impressions", 0))
            clics = int(r.get("clicks", 0))
            ctr = float(r.get("ctr", 0.0))
            pos = float(r.get("position", 0.0))
            top_queries.append({
                "query": q, "impresiones": impr, "clics": clics,
                "ctr": round(ctr, 4), "posicion": round(pos, 1),
            })
            if impr >= HUECO_MIN_IMPRESIONES and pos >= HUECO_MIN_POSICION:
                huecos.append({"query": q, "impresiones": impr, "posicion": round(pos, 1)})
        top_queries.sort(key=lambda x: x["impresiones"], reverse=True)
        huecos.sort(key=lambda x: x["impresiones"], reverse=True)
        log.info("Search Console: %d queries, %d huecos.", len(top_queries), len(huecos))
        return {"top_queries": top_queries[:50], "huecos_contenido": huecos[:20]}
    except Exception as e:  # noqa: BLE001
        log.warning("Search Console falló (%s) — sin datos GSC.", e)
        return {}


# ---------------------------------------------------------------------------
# GA4
# ---------------------------------------------------------------------------

def fetch_ga4(property_id: str) -> dict:
    creds = load_credentials(SCOPES_GA4)
    if creds is None or not property_id:
        return {}
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
        from google.analytics.data_v1beta.types import (
            DateRange, Dimension, Metric, RunReportRequest,
        )
        client = BetaAnalyticsDataClient(credentials=creds)
        req = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=f"{VENTANA_DIAS}daysAgo", end_date="today")],
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="sessions")],
            limit=500,
        )
        resp = client.run_report(req)
        slug_cat = _slug_to_categoria()
        sesiones_cat: dict[str, int] = {}
        top_paths = []
        for row in resp.rows:
            path = row.dimension_values[0].value
            sesiones = int(row.metric_values[0].value)
            top_paths.append({"path": path, "sesiones": sesiones})
            m = _PATH_RE.search(path or "")
            if m:
                cat = slug_cat.get(m.group(1))
                if cat:
                    sesiones_cat[cat] = sesiones_cat.get(cat, 0) + sesiones
        top_paths.sort(key=lambda x: x["sesiones"], reverse=True)
        log.info("GA4: %d paths, tráfico atribuido a %d categorías.", len(top_paths), len(sesiones_cat))
        return {"sesiones_por_categoria": sesiones_cat, "top_paths": top_paths[:20]}
    except Exception as e:  # noqa: BLE001
        log.warning("GA4 falló (%s) — sin datos GA4.", e)
        return {}


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

    site_url = os.environ.get("GSC_SITE_URL", "https://automatizacionslatam.com").strip()
    property_id = os.environ.get("GA4_PROPERTY_ID", "").strip()

    sc = fetch_search_console(site_url)
    ga4 = fetch_ga4(property_id)

    fuente = "google" if (sc or ga4) else "degradado"
    reporte = {
        "generado": dt.datetime.now(dt.timezone.utc).isoformat(),
        "fuente_datos": fuente,
        "ventana_dias": VENTANA_DIAS,
        "search_console": sc,
        "ga4": ga4,
    }
    REPORT_FILE.write_text(json.dumps(reporte, indent=2, ensure_ascii=False), encoding="utf-8")
    log.info("Reporte de analytics escrito en %s (fuente: %s).", REPORT_FILE, fuente)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

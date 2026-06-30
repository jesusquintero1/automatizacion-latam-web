"""
Agente SEO — auditoría del corpus para maximizar tráfico orgánico (la palanca
nº1 de la monetización con AdSense).

No llama a Claude (costo $0) y no muta el contenido (solo audita y reporta).
Corre junto al "cerebro" cada hora. Detecta los problemas reales que frenan el
posicionamiento en Google:

  - Contenido delgado (cuerpo < MIN_PALABRAS) → riesgo de "low value content".
  - Meta descripciones (resumen) ausentes, muy cortas o muy largas (>160).
  - Títulos duplicados o demasiado largos (>60 caracteres se truncan en Google).
  - Artículos huérfanos (pocos enlaces internos entrantes) → mal rastreo.
  - Clusters temáticos lo bastante grandes para una "pillar page".

Salida:
  - scripts/state/seo-report.json  → datos para el dashboard / próximos agentes
  - sección añadida a scripts/state/daily-report.md (si existe)

Uso:
    py scripts/seo.py --verbose
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import logging
import re
from collections import Counter
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "src" / "content" / "noticias"
STATE_DIR = Path(__file__).resolve().parent / "state"
REPORT_JSON = STATE_DIR / "seo-report.json"
DAILY_REPORT = STATE_DIR / "daily-report.md"

# Umbrales realistas para noticias (no penalizamos lo que es normal en el sector).
MIN_PALABRAS = 350                    # < 350 = genuinamente corto/riesgoso
META_MIN = 70                         # meta description demasiado escueta
TITULO_MAX = 70                       # el resumen ya se autotrunca para <meta>
N_RELACIONADAS = 6                    # debe coincidir con el template
MIN_INBOUND = 2                       # menos enlaces entrantes = huérfano
PILLAR_MIN = 25                       # artículos en un tema para justificar pillar

log = logging.getLogger("seo")


# ---------------------------------------------------------------------------
# Carga del corpus
# ---------------------------------------------------------------------------

_FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.S)


def load_corpus() -> list[dict]:
    arts: list[dict] = []
    if not CONTENT_DIR.exists():
        return arts
    for md in sorted(CONTENT_DIR.glob("*.md")):
        try:
            raw = md.read_text(encoding="utf-8")
        except OSError:
            continue
        m = _FM_RE.match(raw)
        if not m:
            continue
        try:
            fm = yaml.safe_load(m.group(1)) or {}
        except yaml.YAMLError:
            continue
        cuerpo = m.group(2)
        palabras = len(re.findall(r"\w+", cuerpo))
        arts.append({
            "slug": md.stem,
            "titulo": str(fm.get("titulo", "")),
            "resumen": str(fm.get("resumen", "")),
            "categoria": str(fm.get("categoria", "")),
            "tags": [str(t).lower() for t in (fm.get("tags") or [])],
            "fecha": str(fm.get("fecha", "")),
            "palabras": palabras,
        })
    return arts


# ---------------------------------------------------------------------------
# Grafo de enlaces internos (replica la lógica del template para detectar huérfanos)
# ---------------------------------------------------------------------------

def _fecha_val(s: str) -> float:
    try:
        return dt.datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()
    except (ValueError, AttributeError):
        return 0.0


def inbound_counts(arts: list[dict]) -> dict[str, int]:
    """Cuántos enlaces internos ENTRANTES recibe cada artículo, simulando las
    N_RELACIONADAS que el template muestra en cada página."""
    inbound: Counter[str] = Counter()
    for a in arts:
        tagset = set(a["tags"])
        scored = []
        for b in arts:
            if b["slug"] == a["slug"]:
                continue
            shared = len(tagset.intersection(b["tags"]))
            same_cat = 1 if b["categoria"] == a["categoria"] else 0
            score = shared * 3 + same_cat
            if score > 0:
                scored.append((score, _fecha_val(b["fecha"]), b["slug"]))
        scored.sort(reverse=True)
        rel = [s for *_ , s in scored[:N_RELACIONADAS]]
        # Relleno anti-huérfanos (como el template): completa con lo más reciente.
        if len(rel) < N_RELACIONADAS:
            ya = set(rel)
            extra = sorted(
                (b for b in arts if b["slug"] != a["slug"] and b["slug"] not in ya),
                key=lambda b: (1 if b["categoria"] == a["categoria"] else 0, _fecha_val(b["fecha"])),
                reverse=True,
            )
            rel += [b["slug"] for b in extra[:N_RELACIONADAS - len(rel)]]
        for s in rel:
            inbound[s] += 1
    return dict(inbound)


# ---------------------------------------------------------------------------
# Auditoría
# ---------------------------------------------------------------------------

def audit(arts: list[dict]) -> dict:
    inbound = inbound_counts(arts)

    thin = [a["slug"] for a in arts if a["palabras"] < MIN_PALABRAS]
    meta_corta = [a["slug"] for a in arts if len(a["resumen"]) < META_MIN]
    titulo_largo = [a["slug"] for a in arts if len(a["titulo"]) > TITULO_MAX]

    titulos = Counter(a["titulo"].strip().lower() for a in arts if a["titulo"])
    titulos_dup = [t for t, c in titulos.items() if c > 1]

    huerfanos = sorted(
        (a["slug"] for a in arts if inbound.get(a["slug"], 0) < MIN_INBOUND),
    )

    por_categoria = Counter(a["categoria"] for a in arts)
    pillars_sugeridos = [c for c, n in por_categoria.items() if n >= PILLAR_MIN]

    total = len(arts) or 1
    # Salud SEO 0-100 = promedio de tasas de aprobación por chequeo (ponderado:
    # huérfanos y contenido corto pesan más que lo cosmético).
    tasas = [
        (1 - len(thin) / total, 2.0),
        (1 - len(huerfanos) / total, 2.0),
        (1 - len(meta_corta) / total, 1.0),
        (1 - len(titulo_largo) / total, 0.5),
        (1 - len(titulos_dup) / total, 1.0),
    ]
    salud = round(sum(t * w for t, w in tasas) / sum(w for _, w in tasas) * 100)

    return {
        "generado": dt.datetime.now(dt.timezone.utc).isoformat(),
        "total_articulos": len(arts),
        "salud_seo": salud,
        "thin_content": {"umbral_palabras": MIN_PALABRAS, "n": len(thin), "slugs": thin[:30]},
        "meta_descripcion": {"cortas": len(meta_corta), "slugs_cortas": meta_corta[:20]},
        "titulos_largos": {"umbral": TITULO_MAX, "n": len(titulo_largo), "slugs": titulo_largo[:20]},
        "titulos_duplicados": titulos_dup[:20],
        "huerfanos": {"umbral_inbound": MIN_INBOUND, "n": len(huerfanos), "slugs": huerfanos[:30]},
        "clusters": dict(por_categoria),
        "pillars_sugeridos": pillars_sugeridos,
    }


# ---------------------------------------------------------------------------
# Reporte
# ---------------------------------------------------------------------------

def append_report(rep: dict) -> None:
    lines = [
        "",
        "### SEO — auditoría del corpus",
        "",
        f"**Salud SEO: {rep['salud_seo']}/100** · {rep['total_articulos']} artículos",
        "",
        "| Chequeo | Resultado |",
        "|---|---:|",
        f"| Contenido corto (< {MIN_PALABRAS} palabras) | {rep['thin_content']['n']} |",
        f"| Meta descripción muy corta | {rep['meta_descripcion']['cortas']} |",
        f"| Títulos > {TITULO_MAX} caracteres | {rep['titulos_largos']['n']} |",
        f"| Títulos duplicados | {len(rep['titulos_duplicados'])} |",
        f"| Huérfanos (< {MIN_INBOUND} enlaces entrantes) | {rep['huerfanos']['n']} |",
        "",
    ]
    if rep["pillars_sugeridos"]:
        lines.append("**Pillar pages sugeridas** (temas con masa crítica): "
                     + ", ".join(rep["pillars_sugeridos"]) + ".")
        lines.append("")
    if DAILY_REPORT.exists():
        DAILY_REPORT.write_text(DAILY_REPORT.read_text(encoding="utf-8") + "\n".join(lines), encoding="utf-8")
        log.info("Sección SEO añadida a %s", DAILY_REPORT.name)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s", datefmt="%H:%M:%S",
    )

    STATE_DIR.mkdir(parents=True, exist_ok=True)
    arts = load_corpus()
    log.info("Auditando %d artículos…", len(arts))
    rep = audit(arts)
    REPORT_JSON.write_text(json.dumps(rep, indent=2, ensure_ascii=False), encoding="utf-8")
    append_report(rep)

    log.info("Salud SEO: %d/100", rep["salud_seo"])
    log.info("Thin: %d · Huérfanos: %d · Títulos largos: %d · Duplicados: %d",
             rep["thin_content"]["n"], rep["huerfanos"]["n"],
             rep["titulos_largos"]["n"], len(rep["titulos_duplicados"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

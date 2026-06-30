---
name: estado-flota
description: Reporta el estado real de la flota de agentes de AutomatizaciónLatAm (runs del cron, plan del día, distribución del corpus, salud del deploy). Úsalo cuando el usuario pida "estado", "cómo va la flota", "qué está publicando", "revisa los agentes" o similar en este proyecto.
---

# Estado de la flota — AutomatizaciónLatAm

Reporta el estado real y actual de la flota de agentes. Es de solo lectura: no
modifica nada. Sé conciso y pedagógico, en español.

## Pasos

1. **Plan del día (qué está decidiendo el cerebro).** Lee `scripts/state/daily-plan.json`:
   - `fuente_datos` (google / degradado / ausente)
   - `distribucion_actual` → calcula el % por categoría
   - `max_por_categoria` → cuáles están topadas (valor < 5)
   - primeras ~10 `keywords_prioritarias` y el `razonamiento`

2. **Corpus real.** Cuenta archivos: `ls src/content/noticias/*.md | wc -l` y, si aporta, la
   distribución por categoría con `grep -h "^categoria:" src/content/noticias/*.md | sort | uniq -c | sort -rn`.

3. **Runs del cron (salud de los agentes).** Con la API pública de GitHub (no requiere auth):
   `curl -s "https://api.github.com/repos/jesusquintero1/automatizacion-latam-web/actions/runs?per_page=6"`
   y resume conclusión + fecha de los últimos runs de "Agregador de noticias" y "Cerebro".
   (Si `gh` está autenticado puedes usar `gh run list` en su lugar.)

4. **Commits recientes del bot.** `git log --oneline -8` — destaca los `auto: publicar N noticia(s)`
   y los `cerebro: estado actualizado`.

5. **Sitio en vivo.** `curl -s -o /dev/null -w "%{http_code}" https://automatizacionslatam.com/` →
   confirma HTTP 200 (sitio sano).

## Formato de salida

Una tabla o lista breve con: **plan del día** (qué prioriza / qué frena), **corpus** (total +
top categorías), **último run** (éxito/fallo + hace cuánto), **próxima publicación** (cron cada 8 h:
00/08/16 UTC) y **sitio** (200/caído). Cierra con UNA recomendación accionable si detectas algo
(ej. un run fallido, deriva de nicho, o que falten las credenciales de Google → analytics degradado).

No inventes números: si una fuente no responde, dilo. No despliegues ni publiques nada — esto solo informa.

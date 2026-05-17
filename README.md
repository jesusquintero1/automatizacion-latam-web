# Automatización LatAm

Agregador automático de noticias de automatización industrial para Latinoamérica, diseñado para monetizar con Google AdSense.

```
┌──────────────────────────────────────────────────────────────┐
│  GitHub Actions (cron cada 2h)                               │
│  └─> scripts/aggregator.py                                   │
│       1. Lee feeds RSS de sources.yml                        │
│       2. Filtra duplicados (state/processed.json)            │
│       3. Claude Haiku 4.5 reescribe + categoriza             │
│       4. Genera .md en src/content/noticias/                 │
│       5. git commit + push                                   │
│                                                              │
│  Cloudflare Pages                                            │
│  └─> Build automático con Astro → sitio estático             │
│                                                              │
│  AdSense + Analytics + Search Console                        │
└──────────────────────────────────────────────────────────────┘
```

## Estructura

```
AutomatizacionLatAm-Web/
├── src/
│   ├── content/noticias/      <- .md generados por el agregador
│   ├── layouts/               <- Layouts Astro
│   ├── pages/                 <- index, /noticia/, /categoria/, /rss.xml
│   ├── components/            <- Header, Footer, ArticleCard, AdSlot
│   └── styles/global.css
├── scripts/
│   ├── aggregator.py          <- El corazón: RSS → Claude → .md
│   ├── sources.yml            <- Lista de fuentes RSS (editable)
│   ├── requirements.txt
│   └── state/processed.json   <- Dedupe (se commitea)
├── .github/workflows/aggregate.yml   <- Cron cada 2h
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── .env.example
```

## Setup local (primera vez)

### 1. Requisitos

- **Node.js 20+** — https://nodejs.org
- **Python 3.11+** — https://www.python.org/downloads
- **Git** — https://git-scm.com

### 2. Instalar dependencias

```bash
cd C:\Users\grupo\OneDrive\Desktop\AutomatizacionLatAm-Web
npm install
pip install -r scripts/requirements.txt
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y rellena:

- `ANTHROPIC_API_KEY` — obténla en https://console.anthropic.com/ → Settings → API Keys.
- `SITE_URL` — déjalo así por ahora, lo cambias al comprar dominio.
- `PUBLIC_ADSENSE_CLIENT` — vacío hasta que AdSense te apruebe (paso 7).

### 4. Probar el agregador en seco

```bash
python scripts/aggregator.py --dry-run --verbose
```

Te mostrará qué noticias detectó y qué escribiría — sin tocar archivos ni gastar tokens de Claude más allá del análisis.

### 5. Primera corrida real

```bash
python scripts/aggregator.py --verbose
```

Esto crea archivos `.md` en `src/content/noticias/`. Costo estimado: ~0.01 USD por 8 noticias con Haiku 4.5 (con prompt caching del system prompt activado).

### 6. Levantar el sitio en local

```bash
npm run dev
```

Abre http://localhost:4321 — verás las noticias generadas.

## Despliegue en Cloudflare Pages (gratis)

### 1. Crear repo en GitHub

```bash
cd C:\Users\grupo\OneDrive\Desktop\AutomatizacionLatAm-Web
git init
git add .
git commit -m "initial commit"
gh repo create automatizacion-latam-web --public --source=. --push
```

(Si no tienes `gh`, crea el repo en github.com manualmente y haz `git push`.)

### 2. Conectar Cloudflare Pages

1. Ve a https://dash.cloudflare.com/ → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Selecciona tu repo `automatizacion-latam-web`.
3. Configuración de build:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version** (env var): `NODE_VERSION = 20`
4. **Environment variables** (production):
   - `SITE_URL` → tu dominio final
   - `PUBLIC_ADSENSE_CLIENT` → vacío de momento
   - `PUBLIC_GA_ID` → tu ID de GA4
5. Deploy.

Cloudflare te dará una URL `xxxx.pages.dev`. Cuando compres dominio, lo apuntas aquí (Cloudflare Pages → Custom domains).

### 3. Configurar el secreto del bot en GitHub

Para que el cron de GitHub Actions pueda llamar a Claude:

1. Ve a tu repo en GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Nombre: `ANTHROPIC_API_KEY`, valor: tu key.
3. Habilita workflows en **Settings** → **Actions** → **General** → **Workflow permissions** → **Read and write**.

Listo. Cada 2 horas el bot publicará automáticamente.

## AdSense — proceso de aprobación

**Antes de aplicar a AdSense necesitas:**

1. ✅ Dominio propio (no `.pages.dev`). Compra en Namecheap (~12 USD/año) o Cloudflare Registrar (más barato).
2. ✅ Al menos 20–30 artículos publicados (deja el agregador correr 3–5 días).
3. ✅ Páginas obligatorias: `/sobre`, `/privacidad`, `/contacto`. Créalas en `src/pages/`.
4. ✅ Política de privacidad mencionando cookies de AdSense y GA.
5. ✅ Sitio indexado en Google Search Console (verificar dominio).

### Aplicar

1. https://www.google.com/adsense/ → **Empezar**.
2. Añade tu dominio. Google te da un código `ca-pub-XXXXXXXXXX`.
3. Ponlo en `.env` como `PUBLIC_ADSENSE_CLIENT` (local) **y** en Cloudflare Pages Env Vars (producción).
4. Espera 1–4 semanas a la revisión. Mientras esperas, sigue publicando.
5. Una vez aprobado, Google empieza a inyectar anuncios en los slots definidos en `AdSlot.astro`.

### Slots de anuncios ya colocados en el código

| Slot ID en código | Ubicación | Tipo recomendado en AdSense |
|---|---|---|
| `1111111111` | Homepage, entre featured y resto | Display responsive |
| `2222222222` | Artículo, después del resumen | In-article |
| `3333333333` | Artículo, antes de relacionadas | Display responsive |
| `4444444444` | Categoría, entre primeros 6 y resto | Display responsive |

Cuando AdSense te dé los IDs reales, reemplázalos en el código (busca `slot="111`, etc.).

## Editar fuentes RSS

Edita `scripts/sources.yml`. Cada fuente tiene:

```yaml
- nombre: "Nombre legible"
  url: "https://ejemplo.com/feed/"
  peso: 3        # 1-5, mayor = más noticias por run
  activa: true   # false para pausar sin borrar
```

Cómo encontrar la URL de un feed:
1. Abre el sitio que te interesa.
2. View source y busca `<link rel="alternate" type="application/rss+xml"`.
3. O prueba sufijos comunes: `/feed/`, `/rss.xml`, `/rss/`, `/atom.xml`.

## Costos esperados

| Servicio | Costo mensual |
|---|---|
| Cloudflare Pages (hosting) | **Gratis** (hasta 500 builds/mes — cron de 2h = ~360/mes) |
| GitHub Actions (cron) | **Gratis** (2000 min/mes en repos públicos, suficiente) |
| Dominio `.com` | ~1 USD/mes (12 USD/año) |
| Claude Haiku 4.5 — 96 corridas/mes × 8 noticias × ~2K tokens = ~1.5M tokens/mes | ~2–4 USD/mes |
| Google AdSense | Gratis (te paga a ti) |
| **Total** | **~3–5 USD/mes** |

Ingresos esperados (referencia, varía mucho):
- Primeros 1–3 meses: 0–5 USD (mientras Google indexa).
- 3–6 meses: 10–50 USD/mes con tráfico orgánico inicial.
- 6–12 meses: 50–300 USD/mes si llegas a 10–30K visitas/mes.

## Operación del día a día

**Tú no haces nada.** El cron corre cada 2 horas y publica.

Tareas manuales puntuales:

- **Cada semana**: revisar Analytics (qué páginas funcionan).
- **Cada mes**: añadir 1–2 fuentes nuevas en `sources.yml`.
- **Cada trimestre**: revisar y desactivar fuentes que ya no aportan.

## Cumplimiento legal — lo importante

Este sitio **no copia texto** de las fuentes. El agregador:

1. Lee solo el titular y el resumen del RSS (que las fuentes publican explícitamente para que los agregadores los lean).
2. Reescribe TODO con Claude — el resumen, el cuerpo, el análisis "Por qué importa".
3. Cita la fuente original con enlace `rel="nofollow noopener"` (Google premia esto).

Esto es uso legítimo bajo doctrina de transformación + fair use + las propias TOS de los feeds RSS. Es el modelo que usan Techmeme, Memeorandum, Hacker News Digest, y similares.

## Troubleshooting

**El cron no corre en GitHub Actions:**
- Verifica que `ANTHROPIC_API_KEY` esté como secret.
- Settings → Actions → Workflow permissions = Read and write.
- Si el repo está inactivo >60 días, GitHub pausa los cron — haz un push manual.

**Cloudflare Pages build falla:**
- Asegúrate de que `NODE_VERSION=20` esté como env var.
- Borra `node_modules` local y haz `npm install` de nuevo, luego push.

**Claude devuelve JSON inválido:**
- El script ya tiene parser robusto + reintentos. Si pasa muy seguido, sube `max_tokens` en `aggregator.py` (línea ~140).

**Quiero un modelo más potente para mejor calidad:**
- Edita `sources.yml`, cambia `modelo: "claude-haiku-4-5"` por `"claude-sonnet-4-6"`. Costo ~5x.

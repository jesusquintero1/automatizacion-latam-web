# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An autonomous Spanish-language news aggregator for the Latin American industrial automation niche, monetized via Google AdSense. Two systems collaborate:

- **Python aggregator** (`scripts/aggregator.py`) — runs on a 2-hour cron in GitHub Actions, reads RSS feeds, calls Claude Haiku 4.5 to rewrite each article in Spanish (title + summary + categorization + "por qué importa" + body), auto-finds a free Creative Commons image when the feed doesn't provide one, and writes `.md` files to `src/content/noticias/`. Dedupe state lives in `scripts/state/processed.json` (committed). After publishing it pings IndexNow so Bing/Yandex pick up new URLs in seconds.
- **Astro 5 static site** — consumes the `noticias` content collection and produces `dist/`. Deployed as a **Cloudflare Workers Static Assets** Worker (not Pages — the new CF UI funnels everything through Workers now). Custom domain: `automatizacionslatam.com`.

The entire cycle (fetch → image search → rewrite → commit → build → deploy → IndexNow) is one job in `.github/workflows/aggregate.yml`. Manual intervention is not part of the normal operation.

## Companion docs in the repo

- `README.md` — public-facing overview (in Spanish).
- `MARKETING.md` — operating manual for the human owner: LinkedIn templates, list of communities, universities to contact for backlinks, plan for diversifying revenue beyond AdSense (Amazon Associates, newsletter, Ezoic). **Read this before suggesting promotional work.**

## Commands

### Astro frontend (Node 20+)
- `npm install` — install deps
- `npm run dev` — local dev at http://localhost:4321
- `npm run build` — emits `dist/`. Reads `SITE_URL`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_GA_ID`, `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_VERIFICATION`, `PUBLIC_YANDEX_VERIFICATION` env vars at build time
- `npm run preview` — serve the built `dist/`

### Aggregator (Python 3.11+)
On Windows the Microsoft Store hijacks `python`. **Use `py` instead** (the official launcher).
- `py -m pip install -r scripts/requirements.txt`
- `py scripts/aggregator.py --dry-run --verbose` — reads RSS feeds without calling Claude or writing files. Use this to validate `sources.yml` after editing it. Does **not** require `ANTHROPIC_API_KEY`.
- `py scripts/aggregator.py --verbose` — real run. Reads `ANTHROPIC_API_KEY`, `SITE_URL`, `INDEXNOW_KEY` from `.env` (via `python-dotenv`) when running locally.
- `py scripts/aggregator.py --max 3 --verbose` — cap articles for cheap test runs.

### Deploy (Cloudflare)
- `npx wrangler whoami` — check OAuth status. Wrangler is authenticated via OAuth locally (`npx wrangler login`); CI uses `CLOUDFLARE_API_TOKEN`.
- `npx wrangler deploy` — bundles `dist/` and the routes in `wrangler.jsonc`. **Always run `npm run build` first** with the desired env vars in scope, since `wrangler deploy` does not build.

### GitHub Actions (gh CLI is at `/c/Program Files/GitHub CLI/gh.exe` on this machine)
- Manual run: `gh workflow run "Agregador de noticias" --repo jesusquintero1/automatizacion-latam-web`
- Tail: `gh run watch <run-id>` / `gh run view <run-id> --log-failed`
- List secrets: `gh secret list --repo jesusquintero1/automatizacion-latam-web`

## Architecture notes that aren't obvious from the file tree

### Static-only Workers deploy
`wrangler.jsonc` defines `assets.directory: "./dist"` with no `main` worker entry-point. This is the "Workers Static Assets" mode — pure static hosting, no SSR. **Do not add `@astrojs/cloudflare` adapter or `output: 'server'`**: Astro is configured with `output: 'static'` on purpose, and adding the adapter requires SSR mode which then breaks the deploy because `dist/_worker.js` is never emitted.

### Wrangler version pinning in CI
`cloudflare/wrangler-action@v3` defaults to **wrangler 3**, which rejects the static-only config with `Missing entry-point`. The workflow forces `wranglerVersion: "4"`. Don't remove that flag.

### Pages catch-all + pagination
The home is `src/pages/[...page].astro` (renamed from the old `index.astro`) — it uses Astro `paginate({ pageSize: 12 })` and produces `/`, `/2/`, `/3/`, … Page 1 keeps the enriched layout (featured + secondaries + "explora por tema"); pages N>1 are a simple grid. Other top-level static pages (`sobre`, `privacidad`, `contacto`, `afiliados`) live alongside it; Astro resolves specific files before the catch-all.

### Categories — there are 9, not 8
`src/content/config.ts` enforces a Zod enum with exactly these 9 categorías:
`PLC y Control`, `Robótica`, `Industria 4.0`, `Inteligencia Artificial`, `Ciberseguridad OT`, `Energía y Sostenibilidad`, `Mercado y Negocios`, `Casos de Estudio`, `General`. The aggregator validates Claude's JSON against the same list and falls back to `General` on anything else. **If you add a new category you must update three places: the Zod schema, `CATEGORIAS_VALIDAS` in `aggregator.py`, the prompt definitions, and the `cats` array inside `src/pages/categoria/[cat].astro` `getStaticPaths`.**

### Slug helper — must use the right regex
The slugifier in `[cat].astro` (and the inline one in `[...slug].astro`) MUST use `.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')`. A simple `\s+` regex breaks any category with a number-and-dot (e.g. `Industria 4.0` → `industria-4.0` doesn't match the hardcoded link `industria-4-0` in Header/Footer). This was a real 404 bug.

### Tag pages multiply the indexable surface
`src/pages/tag/[tag].astro` has a `getStaticPaths` that iterates over every unique tag in every article and produces one indexable page per tag (currently ~113 pages on top of the ~46 core ones → ~160 URLs total). Tags from the aggregator are already lowercased + de-accented; the slug regex in this file mirrors the same normalization.

### Prompt caching design
`SYSTEM_PROMPT` in `aggregator.py` is ~1.2 KB and stays byte-for-byte stable across calls so Anthropic's prompt cache hits from the 2nd article onward. **Never inject anything dynamic (timestamps, per-item context, etc.) into the system prompt.** Volatile content goes in the user message. The image-query refinement helper (`_IMAGE_QUERY_SYSTEM`) follows the same rule.

### Image cascade (auto-illustration)
When a feed doesn't supply `media:content` / `enclosure` / inline `<img>`, the aggregator searches free images in this order:
1. **Claude** (Haiku) is asked for 2-3 visual keywords from the title (prompt-cached).
2. **Openverse API** (no API key, aggregates Flickr + Wikimedia + others). Filtered to `license_type=commercial`. Cascading queries: full → first two words → first word.
3. **Wikimedia Commons API** (no API key) as the last resort.
4. If everything fails, `imagen` is left empty and the `<img>` slot is `display:none`'d by `onerror`.

Each populated image carries `imagen_atribucion` (CC-BY requires attribution) which is shown in 11px italic below the photo on `[...slug].astro`. Schema in `config.ts` has these as `optional` so old articles without attribution still validate. **Never set a hard `.url()` validator on `imagen`** — Wikimedia thumb URLs include query strings.

### IndexNow notification
`notify_indexnow()` in `aggregator.py` POSTs the URLs of newly written articles to `api.indexnow.org` (Bing/Yandex/Naver/Seznam). The verification file is `public/{INDEXNOW_KEY}.txt` (currently `4190305bd1a842e3b45f83c6d1bc22e7.txt`). The key is also a GitHub secret `INDEXNOW_KEY`. If the env var is missing, the aggregator logs `IndexNow: SITE_URL or INDEXNOW_KEY not configured, skipping` and continues normally.

### CMP (cookie consent) before AdSense
`src/components/CookieBanner.astro` plus an inline init script in `src/layouts/Base.astro` sets `window.adsbygoogle.pauseAdRequests = 1` on first load. The banner stores the choice in `localStorage` (`cookie-consent: 'accepted' | 'rejected'`). On accept, ads load normally; on reject, `requestNonPersonalizedAds: 1` is pushed before un-pausing. **AdSense compliance + GDPR**: don't remove this gate or load `adsbygoogle.js` unconditionally — the EU traffic will fail consent checks.

### JSON-LD schema
- `Base.astro` injects `Organization` + `WebSite` + `SearchAction` (`SearchAction.target` builds `?q={search_term_string}` even though there is no /search page yet — keep it, Google indexes the capability).
- `[...slug].astro` injects `NewsArticle` + `BreadcrumbList` per article.
- These rely on `cleanSiteUrl` (trailing slash stripped) — keep that helper if you refactor.

### Where ad slots live
`<AdSlot>` instances are in `[...page].astro` (two: in-feed + bottom), `noticia/[...slug].astro` (top + bottom), `categoria/[cat].astro` (one), `tag/[tag].astro` (one). The slot IDs (`1111111111`, `2222222222`, …) are placeholders — when AdSense issues real slot IDs they need to be substituted. The component renders a dashed placeholder until `PUBLIC_ADSENSE_CLIENT` is set; once set it injects `adsbygoogle` `<ins>` tags.

### Affiliate disclosure (FTC + Amazon Operating Agreement)
`<AmazonAffiliate>` in `src/components/AmazonAffiliate.astro` always renders a visible disclosure line ("Como Asociado de Amazon, ganamos por compras que califiquen") and uses `rel="sponsored nofollow noopener"`. `/afiliados` has the full FTC-compliant policy. Don't drop either: removing the disclosure is a policy violation.

### Env var flow
`PUBLIC_*` vars get baked into the HTML at build time (this is intentional — these IDs are meant to be public). Anything **not** prefixed `PUBLIC_` (e.g. `ANTHROPIC_API_KEY`, `INDEXNOW_KEY`) is server-side only. Local dev reads from `.env`; CI passes via `env:` blocks in the workflow step from GitHub secrets of the same name.

### Anti-bot blocking on RSS feeds
The aggregator sets a Chrome-like `user_agent` in `sources.yml`. Several feeds (Automation.com, Control Engineering, ISA Interchange, The Robot Report, Manufacturing.net) still return HTML/captcha and are marked `activa: false`. Don't waste tokens re-enabling them without verifying first with `--dry-run`.

### Public files served verbatim
`public/_headers` (security headers + cache rules, Cloudflare Workers reads it natively), `public/ads.txt`, `public/robots.txt`, `public/og-default.png`, and `public/<indexnow-key>.txt` are all served as-is from the root domain. **Don't move them out of `public/`.**

## Secrets required in CI (GitHub repo)

| Secret | Purpose | Required? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Aggregator → Claude Haiku | Yes |
| `CLOUDFLARE_API_TOKEN` | `wrangler deploy` | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | `wrangler deploy` | Yes |
| `PUBLIC_ADSENSE_CLIENT` | Baked into HTML | Yes for monetization |
| `INDEXNOW_KEY` | Aggregator → Bing/Yandex push | Optional but recommended |
| `PUBLIC_GA_ID` | Google Analytics 4 (gtag) | Optional |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta-tag verification | Optional (DNS verification works too) |
| `PUBLIC_BING_VERIFICATION` | Bing Webmaster meta verification | Optional |
| `PUBLIC_YANDEX_VERIFICATION` | Yandex Webmaster meta | Optional |

`GITHUB_TOKEN` is provided automatically and is used to push the auto-generated noticia commits.

## Conventions

- **Spanish, pedagogical tone** in user-facing copy and commit messages. The downstream user is a Spanish-speaking docente; explanations should be framed for that audience.
- **Locale-aware paths**: this repo lives at `C:\Users\grupo\OneDrive\Desktop\AutomatizacionLatAm-Web\` (redirected OneDrive desktop), not the standard Windows desktop. Always use the full OneDrive path.
- **Domain spelling**: the canonical domain is `automatizacionslatam.com` (plural, with the `s`). The singular `automatizacionlatam.com` is not registered and is **not** the production host.
- **Commits by the bot**: the cron commits as `automatizacion-latam-bot <bot@automatizacionslatam.com>`. Human commits should use the developer's real identity.
- **No backwards-compatibility cruft**: when removing a field from the schema or a component, delete it cleanly. The bot regenerates the corpus daily.

## Common pitfalls

- **PowerShell multiline paste**: pasting multi-line commands into PowerShell can fragment them. Either join with `;` separators or save as a `.bat` and double-click.
- **Cloudflare CDN cache**: after a fresh `wrangler deploy`, the custom domain may serve a stale version for 1-2 minutes. Bust with a `?v=...` query string when validating, or use `curl -A "Mediapartners-Google"` to simulate the AdSense crawler (different cache key).
- **Astro `getStaticPaths` is isolated**: helpers defined in the frontmatter above `getStaticPaths` are NOT visible inside it. Define helpers inside the function or import them.
- **`SITE_URL` precedence**: a local `.env` with `SITE_URL=https://wrongdomain.com` will override the workflow's hard-coded value during local builds, then `wrangler deploy` from local uploads the wrong canonical/sitemap. Confirm with `curl https://automatizacionslatam.com/ | grep canonical` after every local deploy.
- **`output: 'text'` from `Resolve-DnsName`**: in PowerShell `Resolve-DnsName` returns objects, not text — index `.NameHost` for NS records.
- **Custom domain provisioning**: a fresh Cloudflare Registrar purchase takes a few minutes to surface as a zone. `wrangler deploy` with `custom_domain: true` before the zone is live fails with `Can't infer zone from route`. Check NS with `Resolve-DnsName <domain> -Type NS`.
- **Wikimedia thumb URLs carry `?utm_*` query strings**: don't validate them with `.endswith('.jpg')` — strip the querystring first or use the existing helper in `_search_image_wikimedia`.

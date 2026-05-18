# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An autonomous Spanish-language news aggregator for the Latin American industrial automation niche, designed to monetize via Google AdSense. Two systems collaborate:

- **Python aggregator** (`scripts/aggregator.py`) — runs on a 2-hour cron in GitHub Actions, reads RSS feeds, calls Claude Haiku 4.5 to rewrite each article in Spanish (title + summary + categorization + "por qué importa" analysis + body), and writes `.md` files to `src/content/noticias/`. Dedupe state lives in `scripts/state/processed.json` (committed).
- **Astro 5 static site** — consumes the `noticias` content collection and produces `dist/`. Deployed as a **Cloudflare Workers Static Assets** Worker (not Pages — the new CF UI funnels everything through Workers now). Custom domain: `automatizacionslatam.com`.

The entire cycle (fetch → rewrite → commit → build → deploy) is one job in `.github/workflows/aggregate.yml`. Manual intervention is not part of the normal operation.

## Commands

### Astro frontend (Node 20+)
- `npm install` — install deps
- `npm run dev` — local dev at http://localhost:4321 (uses bienvenida + any .md in `src/content/noticias/`)
- `npm run build` — emits `dist/`. Reads `SITE_URL`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_GA_ID` env vars at build time
- `npm run preview` — serve the built `dist/`

### Aggregator (Python 3.11+)
On Windows the Microsoft Store hijacks `python`. **Use `py` instead** (the official launcher).
- `py -m pip install -r scripts/requirements.txt`
- `py scripts/aggregator.py --dry-run --verbose` — reads RSS feeds without calling Claude or writing files. Use this to validate `sources.yml` after editing it. Does **not** require `ANTHROPIC_API_KEY`.
- `py scripts/aggregator.py --verbose` — real run. Reads `ANTHROPIC_API_KEY` from `.env` (via `python-dotenv`) when running locally.
- `py scripts/aggregator.py --max 3 --verbose` — cap articles for cheap test runs.

### Deploy (Cloudflare)
- `npx wrangler whoami` — check OAuth status. Wrangler is authenticated via OAuth locally (`npx wrangler login`); CI uses a token in `CLOUDFLARE_API_TOKEN` instead.
- `npx wrangler deploy` — bundles `dist/` and the routes in `wrangler.jsonc`, uploads, and (re)applies custom domains. **Always run `npm run build` first** with the desired env vars in scope, since `wrangler deploy` does not build.

### GitHub Actions
- Trigger a manual run: `gh workflow run "Agregador de noticias" --repo jesusquintero1/automatizacion-latam-web`
- Tail a run: `gh run watch <run-id>` or `gh run view <run-id> --log-failed`

## Architecture notes that aren't obvious from the file tree

### Static-only Workers deploy
`wrangler.jsonc` defines `assets.directory: "./dist"` with no `main` worker entry-point. This is the "Workers Static Assets" mode — pure static hosting, no SSR. **Do not add `@astrojs/cloudflare` adapter or `output: 'server'`**: Astro is configured with `output: 'static'` on purpose, and adding the adapter requires SSR mode which then breaks the deploy because `dist/_worker.js` is never emitted. Cloudflare's "autoconfig" branch tries to push the SSR path; ignore it.

### Wrangler version pinning in CI
`cloudflare/wrangler-action@v3` defaults to **wrangler 3**, which rejects the static-only config with `Missing entry-point`. The workflow forces `wranglerVersion: "4"`. Don't remove that flag.

### Custom domain provisioning timing
When a fresh domain is bought through Cloudflare Registrar it takes a few minutes to appear as a *zone* in the account. Running `wrangler deploy` with `routes: [..., custom_domain: true]` before the zone is active fails with `Can't infer zone from route`. Check with `Resolve-DnsName <domain> -Type NS` — if it shows `*.ns.cloudflare.com`, the zone is live.

### Content schema is strict
`src/content/config.ts` enforces a Zod schema on every `.md` in `src/content/noticias/`. The `categoria` field must be one of exactly 8 strings (see the schema). The aggregator validates Claude's JSON against the same 8 categories and falls back to `"General"` when Claude returns anything else.

### Prompt caching design
`SYSTEM_PROMPT` in `aggregator.py` is large (~600 tokens) and stays byte-for-byte stable across calls so Anthropic's prompt cache hits from the 2nd article onward. **Never inject anything dynamic (timestamps, per-item context, etc.) into the system prompt** — that breaks the cache. Volatile content goes in the user message.

### Anti-bot blocking on RSS feeds
The aggregator sets a Chrome-like `user_agent` in `sources.yml`. Several feeds (Automation.com, Control Engineering, ISA Interchange, The Robot Report, Manufacturing.net) still return HTML/captcha and are marked `activa: false` in `sources.yml` until somebody finds the actual feed URL. Don't waste tokens re-enabling them without verifying first with `--dry-run`.

### Where ad slots live
Four `<AdSlot slot="...">` are placed in `src/pages/index.astro`, `src/pages/noticia/[...slug].astro`, and `src/pages/categoria/[cat].astro`. The slot IDs (`1111111111`, `2222222222`, …) are placeholders — when AdSense issues real slot IDs they need to be substituted. The `<AdSlot>` component renders a dashed placeholder until `PUBLIC_ADSENSE_CLIENT` is set; once set it injects `adsbygoogle` `<ins>` tags.

### Env var flow for AdSense client
`PUBLIC_ADSENSE_CLIENT` is a build-time public var. Local dev reads it from `.env`; CI passes it via `env:` in the workflow step from the GitHub secret of the same name. Anything `PUBLIC_*` ends up baked into the HTML — fine here since the AdSense client ID is meant to be public.

### Secrets in CI
GitHub repo secrets required by the workflow:
- `ANTHROPIC_API_KEY` — for the aggregator
- `CLOUDFLARE_API_TOKEN` — for `wrangler deploy`
- `CLOUDFLARE_ACCOUNT_ID` — for `wrangler deploy`
- `PUBLIC_ADSENSE_CLIENT` — passed through to the build env

The `GITHUB_TOKEN` is provided automatically and used to push the auto-generated noticia commits.

## Conventions

- **Spanish, pedagogical tone** in any user-facing copy or commit messages. The downstream user is a Spanish-speaking docente; explanations should be framed for that audience.
- **Locale-aware paths**: this repo lives under the user's redirected OneDrive desktop at `C:\Users\grupo\OneDrive\Desktop\AutomatizacionLatAm-Web\`, not the standard Windows desktop. Always use the full path or the OneDrive-prefixed one when scripting.
- **Domain spelling**: the canonical domain is `automatizacionslatam.com` (plural, with the `s`). The singular `automatizacionlatam.com` is not registered and is **not** the production host.
- **Commits by the bot**: the cron commits with author `automatizacion-latam-bot <bot@automatizacionslatam.com>`. Human commits should use the developer's real identity.

## Common pitfalls

- **PowerShell multiline paste**: pasting multi-line commands into PowerShell can fragment them. Either join with `;` separators or save as a `.bat` and double-click.
- **`git stash` swallows working-copy edits silently** when used alongside in-flight commits; prefer `git add` + targeted commit over `stash` here.
- **Cloudflare CDN cache**: after a fresh `wrangler deploy`, the custom domain may serve a stale version for a minute. Bust with a `?v=...` query string when validating.
- **`output: 'text'` from `Resolve-DnsName`** in PowerShell does not work the same as `dig`. The output is an object; index `.NameHost` for NS records.

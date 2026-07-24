// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// El sitemap se genera a mano en src/pages/sitemap-index.xml.ts para anunciar a
// Google SOLO el contenido indexable (original + noticias que superan la poda).
// @astrojs/sitemap listaba todo sin filtrar por noindex — ver ese archivo.

// Dominio canonico de produccion. NUNCA debe ser el dominio de preview de
// Cloudflare (pages.dev / workers.dev): si un canonical apunta ahi, Google
// consolida todo el ranking al dominio-sombra y el dominio real queda invisible.
// Esto paso de verdad (canonical => automatizacion-latam-web.pages.dev en toda
// la web) porque una integracion Git de CF Pages reconstruye con SITE_URL
// fallback a pages.dev. Blindamos el valor: rechazamos cualquier host de
// preview de Cloudflare y caemos SIEMPRE al dominio canonico. Asi el bug es
// imposible de reintroducir aunque el deploy fantasma vuelva a dispararse.
const CANONICAL_SITE = 'https://automatizacionslatam.com';
const _envSite = process.env.SITE_URL;
const SITE_URL =
  _envSite && !/\.pages\.dev|\.workers\.dev/.test(_envSite)
    ? _envSite
    : CANONICAL_SITE;

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});

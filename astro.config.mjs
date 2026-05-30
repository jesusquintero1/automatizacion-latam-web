// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.SITE_URL ?? 'https://automatizacionslatam.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      i18n: undefined,
      filter: (page) => {
        // Excluimos paginas que no deben ser indexadas (404, contacto que no
        // suele aportar SEO, paginas de paginacion muy profundas que duplican
        // contenido).
        if (page.includes('/404')) return false;
        return true;
      },
      // Frecuencia y prioridad por tipo de URL: ayuda a Google a priorizar crawling.
      serialize(item) {
        const url = item.url;
        const path = url.replace(SITE_URL, '');
        if (path === '/' || path === '') {
          // Home — maxima prioridad, cambia cada 2h por el agregador.
          return { ...item, changefreq: 'hourly', priority: 1.0 };
        }
        // Paginas paginadas del home: /2/, /3/... — cambian con cada cron
        // porque la cola del feed se va recorriendo.
        if (/^\/\d+\/?$/.test(path)) {
          return { ...item, changefreq: 'daily', priority: 0.5 };
        }
        if (path.includes('/categoria/')) {
          return { ...item, changefreq: 'daily', priority: 0.8 };
        }
        if (path.includes('/tag/')) {
          return { ...item, changefreq: 'weekly', priority: 0.6 };
        }
        if (path.includes('/noticia/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        // Paginas legales/estaticas: cambian rara vez pero son load-bearing
        // para confianza de AdSense.
        if (['/sobre/', '/contacto/', '/privacidad/', '/terminos/', '/afiliados/'].includes(path)) {
          return { ...item, changefreq: 'monthly', priority: 0.5 };
        }
        return { ...item, changefreq: 'monthly', priority: 0.4 };
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});

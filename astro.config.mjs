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
      // Frecuencia y prioridad por tipo de URL: ayuda a Google a priorizar crawling.
      serialize(item) {
        const url = item.url;
        if (url.endsWith('/') && url.replace(SITE_URL, '').length <= 1) {
          // Home
          return { ...item, changefreq: 'hourly', priority: 1.0 };
        }
        if (url.includes('/categoria/')) {
          return { ...item, changefreq: 'daily', priority: 0.8 };
        }
        if (url.includes('/tag/')) {
          return { ...item, changefreq: 'weekly', priority: 0.6 };
        }
        if (url.includes('/noticia/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        // Páginas estáticas (sobre, privacidad, etc)
        return { ...item, changefreq: 'monthly', priority: 0.4 };
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});

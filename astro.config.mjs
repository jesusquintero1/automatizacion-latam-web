// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// IMPORTANTE: cambiar SITE_URL al dominio real cuando se compre.
const SITE_URL = process.env.SITE_URL ?? 'https://automatizacionlatam.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [tailwind(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { GLOSARIO } from '../data/glosario';
import { noticiaIndexable } from '../lib/indexable';

// SITEMAP PROPIO (reemplaza @astrojs/sitemap). Motivo: el sitemap automático
// listaba las ~499 noticias SIN mirar su estado de indexación, así que empujaba
// a Google exactamente el contenido thin que emitía noindex — señal
// contradictoria que refuerza el veredicto "contenido de poco valor" de AdSense.
// Aquí anunciamos SOLO lo que queremos indexar: contenido original + las noticias
// que superan la poda (misma regla que el meta robots, vía src/lib/indexable.ts).
// NO se listan: home paginado /2/…, páginas de tag, ni noticias podadas.
//
// El nombre del archivo (sitemap-index.xml) coincide con el que apunta
// public/robots.txt y el ya enviado a Search Console — no cambiar sin actualizar
// ambos.

const CANONICAL = 'https://automatizacionslatam.com';

// Mismo slugify que categoria/[cat].astro (NFD + quita combinantes).
const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const CATEGORIAS = [
  'PLC y Control', 'Robótica', 'Industria 4.0', 'Inteligencia Artificial',
  'Ciberseguridad OT', 'Energía y Sostenibilidad', 'Mercado y Negocios',
  'Casos de Estudio', 'General',
];

// Pillars que existen como página en /tema/ (solo estas 5).
const PILLARS = [
  'plc-y-control', 'ciberseguridad-ot', 'industria-4-0',
  'inteligencia-artificial', 'robotica',
];

// Guías evergreen en src/pages/guias/ (mantener en sync al añadir guías nuevas).
const GUIAS = [
  '', 'que-es-un-plc/', 'que-es-un-hmi/', 'que-es-scada/', 'que-es-un-cobot/',
  'que-es-la-industria-4-0/', 'aprender-automatizacion-industrial/',
  'temporizador-ton-tof-ladder/', 'semaforo-zeliosoft-ladder/',
  'control-nivel-tanque-ladder/', 'entradas-analogicas-zelio-sr3-b261bd/',
  'grafcet-ladder-set-reset/',
];

const HERRAMIENTAS = ['', 'escalado-analogico/'];
const LEGALES = ['sobre/', 'contacto/', 'privacidad/', 'terminos/', 'afiliados/'];

interface Entry { loc: string; changefreq: string; priority: number; lastmod?: string; }

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString().replace(/\/$/, '')) || CANONICAL;
  const entries: Entry[] = [];
  const add = (path: string, changefreq: string, priority: number, lastmod?: string) =>
    entries.push({ loc: `${base}${path}`, changefreq, priority, lastmod });

  // Home
  add('/', 'daily', 1.0);

  // Contenido original evergreen (máxima prioridad — es lo que rankea y monetiza)
  for (const g of GUIAS) add(`/guias/${g}`, 'monthly', 0.9);
  add('/glosario/', 'monthly', 0.8);
  for (const t of GLOSARIO) add(`/glosario/${t.slug}/`, 'monthly', 0.7);
  for (const h of HERRAMIENTAS) add(`/herramientas/${h}`, 'monthly', 0.8);
  for (const p of PILLARS) add(`/tema/${p}/`, 'weekly', 0.8);

  // Hubs de categoría (tienen intro editorial propio)
  for (const c of CATEGORIAS) add(`/categoria/${slugify(c)}/`, 'daily', 0.6);

  // Páginas legales (load-bearing para la confianza de AdSense)
  for (const l of LEGALES) add(`/${l}`, 'monthly', 0.4);

  // Noticias: SOLO las que superan la poda (misma regla que el meta robots)
  const noticias = await getCollection('noticias');
  for (const n of noticias) {
    if (!noticiaIndexable(n)) continue;
    const lastmod = new Date(n.data.fecha).toISOString();
    add(`/noticia/${n.slug}/`, 'monthly', 0.5, lastmod);
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => {
        const lm = e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : '';
        return (
          '  <url>\n' +
          `    <loc>${e.loc}</loc>\n` +
          lm +
          `    <changefreq>${e.changefreq}</changefreq>\n` +
          `    <priority>${e.priority.toFixed(1)}</priority>\n` +
          '  </url>'
        );
      })
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

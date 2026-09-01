import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Un feed RSS es una ventana de novedades, no el archivo completo. Sin este
// tope el feed listaba las 644 noticias y pesaba ~590 KB: los lectores lo
// truncan o lo descartan por timeout, y se descarga entero en cada consulta.
const MAX_ITEMS = 30;

export async function GET(context) {
  const noticias = (await getCollection('noticias'))
    .sort((a, b) => new Date(b.data.fecha).valueOf() - new Date(a.data.fecha).valueOf())
    .slice(0, MAX_ITEMS);

  return rss({
    title: 'Automatización LatAm',
    description: 'Noticias diarias de automatización industrial, PLC, robótica e Industria 4.0 para Latinoamérica.',
    site: context.site,
    items: noticias.map((n) => ({
      title: n.data.titulo,
      pubDate: new Date(n.data.fecha),
      description: n.data.resumen,
      link: `/noticia/${n.slug}/`,
      categories: [n.data.categoria, ...n.data.tags],
    })),
    customData: `<language>es</language>`,
  });
}

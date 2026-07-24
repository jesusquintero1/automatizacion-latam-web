import type { CollectionEntry } from 'astro:content';

// FUENTE ÚNICA DE VERDAD para decidir qué noticia entra al índice de Google.
// La usan: src/pages/noticia/[...slug].astro (meta robots) y
// src/pages/sitemap-index.xml.ts (qué URLs se anuncian). Antes esta lógica
// estaba duplicada en el template y desacoplada del sitemap, lo que hacía que
// el sitemap empujara a Google las ~499 noticias aunque casi todas emitieran
// noindex. Un único lugar evita esa contradicción.
//
// Estrategia AdSense / "contenido de poco valor": las noticias son reescrituras
// por IA de feeds ajenos = activo TRANSITORIO. Deben caducar del índice para que
// la superficie indexable quede dominada por el contenido original (guías,
// glosario, herramientas). El contenido perenne se marca `evergreen: true` en el
// frontmatter y queda exento de la caducidad.

// Piso de longitud del cuerpo. 700 = alineado con el nuevo estándar del
// agregador (análisis original de 750+ palabras). Por debajo de esto una noticia
// es reescritura superficial de feed → "contenido de poco valor". Debe coincidir
// con MIN_PALABRAS_CUERPO en scripts/aggregator.py.
export const PODA_MIN_PALABRAS = 700;
export const PODA_MAX_DIAS = 90;      // una noticia sin tracción a los 90 días = ruido

// Cuenta palabras del cuerpo markdown (mismo criterio en todo el sitio).
export function contarPalabras(body: string): number {
  return (body || '')
    .replace(/[#*_`>\[\]()\-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1).length;
}

// ¿Esta noticia debe indexarse (index,follow) o podarse (noindex,follow)?
export function noticiaIndexable(n: CollectionEntry<'noticias'>): boolean {
  // El contenido perenne curado a mano (tutoriales LOGO/ZelioSoft, etc.) nunca
  // caduca y siempre se indexa.
  if (n.data.evergreen === true) return true;
  const wc = contarPalabras(n.body || '');
  const ageDays = (Date.now() - new Date(n.data.fecha).valueOf()) / 86_400_000;
  return wc >= PODA_MIN_PALABRAS && ageDays <= PODA_MAX_DIAS && !!n.data.porQueImporta;
}

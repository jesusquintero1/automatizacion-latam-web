// Catálogo curado de productos afiliados de Amazon, agrupado por categoría del sitio.
//
// CÓMO ACTIVAR (2 requisitos, ambos tuyos):
//   1. Registrarte en Amazon Associates y añadir el secret PUBLIC_AMAZON_TAG_US
//      (y/o _MX, _ES, _BR) en GitHub → así el componente <AmazonAffiliate> deja de
//      estar oculto. Ver guía en MARKETING.md §5.A.
//   2. Rellenar el campo `asin` de cada producto con el ASIN REAL de Amazon
//      (los 10 caracteres del bloque /dp/XXXXXXXXXX/ en la URL del producto).
//
// SEGURIDAD DE PUBLICACIÓN: un producto con `asin: ''` NO se renderiza. Esto evita
// publicar enlaces rotos o inventados antes de que verifiques cada ASIN — algo que
// además protege la reputación del sitio de cara a la revisión de AdSense.
//
// El `marketplace` por defecto es 'us' (catálogo global en USD, envía a LatAm).
// Cambia a 'mx'/'es' si consigues el mismo producto en esos catálogos y tienes el
// tag correspondiente; el precio en la ficha es orientativo (Amazon no permite
// mostrar precios cacheados desactualizados, así que mantenlo genérico o vacío).

export interface ProductoAfiliado {
  asin: string;          // ← RELLENAR con el ASIN real. Vacío = no se muestra.
  titulo: string;
  descripcion: string;
  marketplace?: 'us' | 'mx' | 'es' | 'br';
  imagen?: string;       // opcional; si Amazon lo bloquea, el <img> se oculta solo
}

// Las claves DEBEN coincidir con las 9 categorías del sitio (config.ts).
// Cada lista es una "estantería" temática: pon 2-4 productos genuinamente útiles
// para el lector de esa categoría. Calidad > cantidad (Amazon penaliza el spam).
export const PRODUCTOS_POR_CATEGORIA: Record<string, ProductoAfiliado[]> = {
  'PLC y Control': [
    { asin: '', titulo: 'Multímetro digital de campo (TRMS)', descripcion: 'Instrumento base para diagnóstico eléctrico en tableros y sensores industriales.' },
    { asin: '', titulo: 'Libro: Programación de PLC — de la lógica de escalera a la práctica', descripcion: 'Referencia introductoria para técnicos que arrancan con IEC 61131-3.' },
    { asin: '', titulo: 'Kit de entrenamiento PLC / HMI para prácticas', descripcion: 'Para estudiantes y docentes que montan un banco de pruebas de automatización.' },
  ],
  'Robótica': [
    { asin: '', titulo: 'Kit de robótica educativa con brazo servo', descripcion: 'Ideal para introducir pick-and-place y cinemática en aula o taller.' },
    { asin: '', titulo: 'Libro: Fundamentos de robótica industrial', descripcion: 'Cobots, efectores finales y planificación de trayectorias explicados desde cero.' },
  ],
  'Industria 4.0': [
    { asin: '', titulo: 'Gateway / kit de desarrollo IIoT', descripcion: 'Para prototipar conectividad OPC UA y edge computing en planta.' },
    { asin: '', titulo: 'Libro: Transformación digital en la manufactura', descripcion: 'Casos de digital twin, MES y smart factory con enfoque práctico.' },
  ],
  'Inteligencia Artificial': [
    { asin: '', titulo: 'Libro: IA aplicada a la industria', descripcion: 'Visión por computador, mantenimiento predictivo y control con aprendizaje automático.' },
    { asin: '', titulo: 'Placa de desarrollo con acelerador de IA (edge)', descripcion: 'Para inferencia local en visión de máquina y control inteligente.' },
  ],
  'Ciberseguridad OT': [
    { asin: '', titulo: 'Libro: Ciberseguridad de sistemas industriales (ICS/OT)', descripcion: 'Defensa de SCADA/PLC, segmentación IT/OT y normativa IEC 62443.' },
    { asin: '', titulo: 'Switch industrial gestionable con VLAN', descripcion: 'Base para segmentar redes OT y aislar el tráfico de control.' },
  ],
  'Energía y Sostenibilidad': [
    { asin: '', titulo: 'Analizador de calidad de energía / pinza amperimétrica', descripcion: 'Mide consumo y armónicos para proyectos de eficiencia energética.' },
    { asin: '', titulo: 'Libro: Gestión energética industrial e ISO 50001', descripcion: 'Microrredes, almacenamiento y descarbonización de procesos.' },
  ],
  'Mercado y Negocios': [
    { asin: '', titulo: 'Libro: Estrategia de operaciones y manufactura esbelta', descripcion: 'Para responsables de planta que evalúan inversión en automatización.' },
  ],
  'Casos de Estudio': [
    { asin: '', titulo: 'Libro: Casos de implementación de automatización industrial', descripcion: 'Retrofits y modernizaciones de planta con resultados medidos.' },
  ],
  'General': [
    { asin: '', titulo: 'Libro: Introducción a la automatización industrial', descripcion: 'Panorama general de PLC, sensores, actuadores y control de procesos.' },
  ],
};

// Devuelve los productos listos-para-mostrar (con ASIN) de una categoría.
export function productosDe(categoria: string): ProductoAfiliado[] {
  return (PRODUCTOS_POR_CATEGORIA[categoria] ?? []).filter((p) => p.asin.trim() !== '');
}

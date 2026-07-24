import { defineCollection, z } from 'astro:content';

const noticias = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    porQueImporta: z.string().optional(),
    categoria: z.enum([
      'PLC y Control',
      'Robótica',
      'Industria 4.0',
      'Inteligencia Artificial',
      'Ciberseguridad OT',
      'Energía y Sostenibilidad',
      'Mercado y Negocios',
      'Casos de Estudio',
      'General',
    ]),
    fuente: z.object({
      nombre: z.string(),
      url: z.string().url(),
    }),
    fecha: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    imagen: z.string().optional(),
    imagen_atribucion: z.string().optional(),
    imagen_fuente: z.string().optional(),
    // Contenido perenne curado a mano (tutoriales LOGO/ZelioSoft, etc.): se
    // indexa siempre, exento de la caducidad de 90 días que aplica a las
    // noticias reescritas de feeds. Ver src/lib/indexable.ts.
    evergreen: z.boolean().optional().default(false),
  }),
});

export const collections = { noticias };

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
  }),
});

export const collections = { noticias };

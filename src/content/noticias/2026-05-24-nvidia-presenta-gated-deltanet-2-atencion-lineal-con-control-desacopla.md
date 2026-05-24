---
titulo: "NVIDIA presenta Gated DeltaNet-2: atención lineal con control desacoplado de memoria"
resumen: "NVIDIA lanzó Gated DeltaNet-2, una arquitectura de atención lineal que mejora la gestión de memoria en modelos de lenguaje al separar el control de borrado y escritura de datos. Con 1.3B parámetros, supera a Mamba-2 y Mamba-3 en tareas de razonamiento y recuperación de contexto extendido."
porQueImporta: "Esta innovación en arquitecturas de atención lineal es crítica para desplegar modelos de IA más eficientes con menor consumo de memoria, lo que facilita la adopción de LLMs avanzados en infraestructuras locales y edge computing en América Latina."
categoria: "Inteligencia Artificial"
imagen: "https://www.marktechpost.com/wp-content/uploads/2026/05/Screenshot-2026-05-24-at-12.26.27-AM-1.png"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/05/24/nvidia-ai-releases-gated-deltanet-2-a-linear-attention-layer-that-decouples-erase-and-write-in-the-delta-rule/"
fecha: 2026-05-24T07:42:09Z
tags:
  - transformers
  - atencion-lineal
  - llm
  - nvidia
  - arquitectura-ia
---

## Problema de la atención lineal tradicional

Los modelos de lenguaje basados en transformadores enfrentan un cuello de botella fundamental: el cache de pares clave-valor (KV) crece sin límite con la longitud de la secuencia, consumiendo memoria exponencialmente. La atención lineal intenta resolver esto comprimiendo ese cache en un estado recurrente de tamaño fijo. Sin embargo, actualizar esta memoria sin destruir las asociaciones ya aprendidas ha sido históricamente difícil de lograr de forma efectiva.

## La innovación de Gated DeltaNet-2

ENVIDIA presentó Gated DeltaNet-2, que introduce una mejora conceptual crucial sobre generaciones anteriores. Mientras que modelos previos como Gated DeltaNet y KDA utilizaban un único gate escalar para controlar tanto el borrado de contenido antiguo como la escritura de información nueva, la nueva arquitectura desacopla ambas operaciones: implementa una puerta de borrado sensible a canal (b_t) en el eje de las claves y una puerta de escritura sensible a canal (w_t) en el eje de los valores. Este cambio aparentemente sutil tiene implicaciones profundas para la calidad del modelo.

## Resultados experimentales

En pruebas de validación, Gated DeltaNet-2 con 1.3 mil millones de parámetros entrenado en 100 mil millones de tokens de FineWeb-Edu demostró ventajas consistentes sobre competidores establecidos: superó a Mamba-2, Mamba-3 y modelos anteriores de la familia DeltaNet en tareas de modelado de lenguaje, razonamiento de sentido común y recuperación de contexto extendido. Las ganancias más notables aparecieron en pruebas especializadas como RULER S-NIAH (evaluación de aguja en pajar) y recuperación multi-clave de aguja en pajar, dominios donde la retención precisa de información contextual es crítica.

## Implicaciones técnicas y prácticas

La arquitectura de atención lineal es particularmente valiosa para escenarios donde el contexto es muy extenso: procesamiento de documentos largos, análisis de conversaciones históricas complejas o inferencia en dispositivos con restricciones de memoria. El desacoplamiento de operaciones de memoria permite que cada eje se especialize: las claves manejan qué información se olvida, mientras que los valores controlan qué se retiene activamente. Esto refleja una comprensión más sofisticada de cómo los modelos deberían gestionar la información a lo largo del tiempo.

## Relevancia para la región

En contextos de América Latina donde la infraestructura computacional es frecuentemente limitada, la eficiencia de memoria es un factor crítico de adopción. Modelos de atención lineal como DeltaNet-2 permiten ejecutar sistemas de IA avanzados en servidores menos poderosos o incluso en edge devices, reduciendo dependencia de llamadas a APIs en nube y mejorando latencia en aplicaciones críticas.

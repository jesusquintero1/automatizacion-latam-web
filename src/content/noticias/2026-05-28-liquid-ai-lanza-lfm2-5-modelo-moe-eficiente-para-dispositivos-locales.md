---
titulo: "Liquid AI lanza LFM2.5: modelo MoE eficiente para dispositivos locales"
resumen: "Liquid AI presenta un modelo de lenguaje optimizado con arquitectura Mixture of Experts que activa solo 1.5B de 8.3B parámetros totales, permitiendo ejecución en hardware de consumo con ventana de contexto de 128K tokens y capacidades de razonamiento."
porQueImporta: "Este tipo de modelos eficientes son críticos para LatAm, donde el acceso a infraestructura cloud puede ser limitado o costoso. Habilita a desarrolladores e industriales a desplegar IA generativa localmente, reduciendo latencia, costos operativos y dependencia de conexión remota."
categoria: "Inteligencia Artificial"
imagen: "https://www.marktechpost.com/wp-content/uploads/2026/05/Screenshot-2026-05-28-at-4.29.30-PM-1.png"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/05/28/liquid-ai-releases-lfm2-5-8b-a1b-an-on-device-moe-model-with-8-3b-total-and-1-5b-active-parameters/"
fecha: 2026-05-28T23:29:49Z
tags:
  - modelo-moe
  - llm-eficiente
  - edge-computing
  - ia-generativa
  - inference-local
---

## Contexto: La necesidad de eficiencia en modelos grandes

A medida que los modelos de lenguaje generativos se vuelven herramientas industriales, surge un desafío crítico: ejecutarlos en hardware convencional sin comprometer capacidad. Liquid AI, empresa especializada en optimización de redes neuronales, ha abordado este problema con una arquitectura de expertos dinámicos.

## El modelo LFM2.5-8B-A1B

Liquid AI lanzó su modelo LFM2.5-8B-A1B con una característica distintiva: aunque contiene 8.3 mil millones de parámetros totales, solo activa 1.5 mil millones durante la inferencia. Esta activación selectiva utiliza una estrategia Mixture of Experts (MoE), donde el modelo enruta cada entrada a solo los módulos especializados necesarios, no a toda la red.

El resultado es un modelo que demanda significativamente menos memoria y potencia computacional que alternativas de tamaño comparable, haciéndolo viable en laptops, servidores edge y dispositivos locales de mediano rendimiento.

## Especificaciones técnicas y capacidades

El modelo mantiene una ventana de contexto de 128,000 tokens, comparable a soluciones empresariales. Soporta razonamiento paso a paso, esencial para tareas analíticas en plantas y oficinas, así como tool calling—capacidad de invocar funciones externas, APIs y sistemas de terceros directamente desde las respuestas del modelo.

Esta configuración lo hace particularmente útil para automatización de procesos: puede analizar datos de sensores industriales, generar recomendaciones, e invocar acciones en sistemas de control sin intermediarios.

## Implicaciones para LatAm y manufactura

En contextos industriales latinoamericanos, donde la conectividad puede ser intermitente y los costos de infraestructura cloud importan, un modelo MoE eficiente abre nuevas posibilidades. Plantas con recursos limitados pueden integrar capacidades de IA en aplicaciones de optimización de procesos, detección de anomalías y generación de reportes sin depender de APIs remotas.

Además, la arquitectura MoE de Liquid AI es relevante para desarrolladores que necesitan personalizar modelos. Al activar subconjuntos dinámicos de parámetros, el modelo es más adecuado para fine-tuning en dominios específicos—nomenclatura de equipos industriales, procedimientos de seguridad, normativas locales—que alternativas monolíticas.

## Disponibilidad y adopción

El lanzamiento de LFM2.5-8B-A1B refuerza la tendencia de democratización de IA generativa. Modelos eficientes como este, ejecutables en hardware local, compiten con soluciones propietarias basadas en API y reducen la barrera de entrada para pequeñas y medianas empresas industriales en la región.

Liquid AI ha posicionado el modelo para uso comunitario, lo que facilita iteración rápida y adaptación a casos de uso específicos del sector manufacturero y de servicios en América Latina.

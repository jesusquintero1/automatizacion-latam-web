---
titulo: "DaisyRose-27B: modelo de código con IA agentiva sin supervisión"
resumen: "RadixArk presentó DaisyRose-27B, un modelo de 27 mil millones de parámetros entrenado únicamente con aprendizaje por refuerzo para automatizar tareas de codificación. Duplica el rendimiento en pruebas de benchmark y se ejecuta en una sola GPU."
porQueImporta: "Los modelos agentivos de código potencian la automatización de desarrollo de sistemas de control industrial, permiten a equipos pequeños en LatAm generar firmware y lógica de PLC con menos expertos, y reducen el costo computacional al correr en hardware accesible (una sola GPU)."
categoria: "Inteligencia Artificial"
imagen: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Cursor_AI_Coding_Agent.png"
imagen_atribucion: "Foto: LrgFranzones · Openverse · CC BY-SA 4.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/11/20/radixark-daisyrose-27b-agentic-model/"
fecha: 2026-11-20T17:42:29Z
tags:
  - "modelo-codigo"
  - "aprendizaje-refuerzo"
  - "automatizacion"
  - "edge-computing"
  - "ia-agentica"
---

## Contexto: la automatización del desarrollo de código industrial

En manufactura e industria 4.0, la escasez de programadores especializados en automatización industrial es crítica en Latinoamérica. Los ingenieros de control gastan semanas escribiendo lógica de PLC, integrando APIs OPC UA, o depurando firmware embebido. Los modelos de lenguaje de propósito general (como GPT-4 o Claude) ofrecen asistencia, pero requieren hardware costoso y entrenamientos supervisados que las pequeñas y medianas empresas no pueden financiar. Un modelo ligero, especializado en código y ejecutable en una GPU estándar representa un punto de quiebre en accesibilidad.

## DaisyRose-27B: arquitectura y entrenamiento

RadixArk lanzó DaisyRose-27B como derivado del modelo base Qwen3.8-27B, sometido a post-entrenamiento exclusivamente mediante aprendizaje por refuerzo (RL). Esta estrategia difiere del enfoque tradicional de ajuste supervisado, donde un modelo se entrena con ejemplos etiquetados por humanos. En su lugar, el RL permite que el modelo aprenda iterativamente: genera código, recibe retroalimentación basada en si ese código compila, pasa pruebas unitarias o resuelve problemas de benchmark, y ajusta sus pesos internos para maximizar esa señal de recompensa.

El nombre "agentic" subraya que el modelo no solo genera texto, sino que actúa como agente: propone soluciones, evalúa su propio trabajo, y refina la respuesta en ciclos. En Terminal Bench 4.1 (un conjunto de pruebas para modelos de codificación), DaisyRose-27B logró una métrica pass@1 de 12.0, más del doble del desempeño inicial del modelo base. La métrica pass@1 mide el porcentaje de problemas resueltos correctamente en el primer intento.

## Detalles técnicos y limitaciones

El modelo corre en una sola GPU, una característica crítica porque implica que un data center modesto, incluso con tarjetas NVIDIA L40 o H100, puede servirlo en producción sin invertir en infraestructura distribuida. El tamaño de 27 mil millones de parámetros es un punto de equilibrio: más pequeño que GPT-4 (1.76 trillones), pero lo suficientemente grande para capturar patrones sintácticos y semánticos complejos.

Sin embargo, el enfoque RL-only tiene aristas. No hay supervisión explícita de humanos en el bucle, lo que acelera el entrenamiento pero también puede dejar ciertos errores sutiles sin corregir. Los modelos puros de RL tienden a optimizar para pasar pruebas específicas (overfitting a benchmarks) en lugar de generalizar a contextos nuevos. Para aplicaciones críticas en automatización industrial, donde un error en la lógica de un PLC puede causar paros de planta, esto requiere validación exhaustiva.

## Lectura para la industria latinoamericana

En países como México, Brasil, Argentina y Colombia, las empresas de automatización y sistemas de control enfrentan dos obstáculos principales: falta de ingenieros de software especializados y costos prohibitivos de herramientas propietarias. Un distribuidor local de Siemens o Schneider actualmente vende licencias de TIA Portal o Ecostruxure a un pequeño integrador con márgenes ajustados; ese integrador, a su vez, contrata a un ingeniero de control que gana entre 1.500 y 2.500 USD mensuales (según país y experiencia). Si ese ingeniero puede usar DaisyRose-27B en un servidor GPU modesto para generar la estructura inicial de un programa SCL para Siemens S7-1200, o validar lógica ladder antes de desplegar, el tiempo de proyecto se reduce 20-30%.

En rubros como minería (Perú, Chile), alimentos (Brasil, Argentina), y petróleo & gas (Colombia, México), donde las plantas necesitan modernizar PLC obsoletos o implementar lógica de edge computing en RTU remotas, una herramienta de generación de código accesible amplía el alcance de integración. El desafío es integración: DaisyRose-27B debe conectarse con IDEs industriales (TIA Portal, Automation Studio de B&R, CODESYS), y requiere validación offline en simuladores antes de cualquier descarga a hardware real. Distribuidores como Rockwell Automation Latinoamérica, Siemens Gamesa (automatización industrial), o integradores independientes podría entrenar equipos internos en este tipo de herramientas.

Un riesgo adicional: modelos RL-only sin supervisión pueden generar código que "parece correcto" (pasa pruebas unitarias simples) pero introduce vulnerabilidades de ciberseguridad OT. Por ejemplo, código que no validase credenciales OPC UA, o que permitiese inyección de comandos en un HMI. Organismos como ISA (Sociedad de Automatización) y comités de normalización locales deben establecer directrices para auditoría de código generado por IA en sistemas críticos.

## Qué vigilar a futuro

El lanzamiento de DaisyRose-27B abre competencia en modelos de código especializados. Esperar competidores de Anthropic (Claude Code), Meta (Llama Code variants), y startups chinas (Deepseek ha anunciado modelos de código). La verdadera prueba es si RadixArk publica benchmarks independientes (no solo Terminal Bench) y si terceros verifican la calidad del código generado en escenarios industriales reales. Además, el modelo es Apache 2.0 (open source), lo que permite a integradoras locales fine-tunearlo con ejemplos de lógica de su dominio (p.ej., recetas de producción de alimentos o secuencias de bombeo en minería), mejorando aún más la precisión. La próxima frontera será integración nativa con IDEs industriales y certificación IEC 61131-3 de código generado.

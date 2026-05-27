---
titulo: "ITBench-AA: modelos de frontera obtienen menos del 50% en benchmark de tareas IT empresariales"
resumen: "IBM y Artificial Analysis presentan ITBench-AA, el primer benchmark especializado para evaluar agentes de IA en tareas de infraestructura IT empresarial. Los modelos más avanzados actualmente disponibles alcanzan desempeños inferiores al 50%, revelando brechas significativas en capacidades de automa"
porQueImporta: "En Latinoamérica, donde la adopción de agentes IA para automatización IT crece exponencialmente, este benchmark proporciona una métrica confiable para evaluar qué modelos son realmente aptos para gobernar infraestructuras críticas. Permite a equipos técnicos tomar decisiones informadas antes de desplegar soluciones basadas en IA en producción."
categoria: "Inteligencia Artificial"
imagen: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Scores_benchmarks_intelligences_artificielles_2024.png"
imagen_atribucion: "Foto: Y. Bengio, S. Mindermann, D. Privitera, T. Besiroglu, R. Bommasani, S. Casper, Y. Choi, P. Fox, B. Garfinkel, D. Goldfarb, H. Heidari, A. Ho, S. Kapoor, L. Khalatbari, S. Longpre, S. Manning, V. Mavroudis, M. Mazeika, J. Michael, J. Newman, K. Y. Ng, C. T. Okolo, D. Raji, G. Sastry, E. Seger, T. Skeadas, T. South, E. Strubell, F. Tramèr, L. Velasco, N. Wheeler, D. Acemoglu, O. Adekanmbi, D. Dalrymple, T. G. Dietterich, P. Fung, P.-O. Gourinchas, F. Heintz, G. Hinton, N. Jennings, A. Krause, S. Leavy, P. Liang, T. Ludermir, V. Marda, H. Margetts, J. McDermid, J. Munga, A. Narayanan, A. Nelson, C. Neppel, A. Oh, G. Ramchurn, S. Russell, M. Schaake, B. Schölkopf, D. Song, A. Soto, L. Tiedrich, G. Varoquaux, E. W. Felten, A. Yao, Y.-Q. Zhang, O. Ajala, F. Albalawi, M. Alserkal, G. Avrin, C. Busch, A. C. P. de L. F. de Carvalho, B. Fox, A. S. Gill, A. H. Hatip, J. Heikkilä, C. Johnson, G. Jolly, Z. Katzir, S. M. Khan, H. Kitano, A. Krüger, K. M. Lee, D. V. Ligot, J. R. López Portillo, D., O. Molchanovskyi, A. Monti, N. Mwamanzi, M. Nemer, N. Oliver, R. Pezoa Rivera, B. Ravindran, H. Riza, C. Rugege, C. Seoighe, H. Sheikh, J. Sheehan, D. Wong, Y. Zeng, in “International AI Safety Report” (DSIT 2025/001, 2025); https://www.gov.uk/government/publications/international-ai-safety-report-2025 · Openverse · CC BY 4.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Hugging Face Blog"
  url: "https://huggingface.co/blog/ibm-research/itbench-aa"
fecha: 2026-05-27T17:20:29Z
tags:
  - benchmark-ia
  - agentes-inteligentes
  - automatizacion-it
  - evaluacion-modelos
  - infraestructura-empresarial
---

## Contexto: la brecha de capacidad en agentes de IA

Los agentes de inteligencia artificial generativa prometen automatizar tareas complejas de infraestructura IT, desde gestión de sistemas hasta resolución de incidentes. Sin embargo, hasta ahora carecía un estándar riguroso para medir su desempeño real en escenarios empresariales. IBM Research y Artificial Analysis han cerrado este vacío presentando ITBench-AA, un benchmark diseñado específicamente para evaluar cómo los modelos de frontera manejan tareas auténticas del mundo IT.

## El descubrimiento clave: desempeño insuficiente

El hallazgo más relevante es contundente: los modelos más sofisticados del mercado (incluyendo versiones recientes de GPT, Claude y Gemini) alcanzan tasas de éxito inferiores al 50% en las pruebas de ITBench-AA. Esto significa que en uno de cada dos intentos, un agente IA podría fallar o tomar decisiones inadecuadas al automatizar tareas críticas como configuración de redes, gestión de identidades o remedición de vulnerabilidades. Para contexto, en operaciones IT empresariales, una tasa de confiabilidad menor al 95% es generalmente inaceptable.

## Cómo funciona ITBench-AA

El benchmark simula entornos IT realistas donde agentes deben ejecutar acciones complejas y secuenciales. Las pruebas incluyen escenarios como diagnóstico de problemas de conectividad, provisioning de recursos en infraestructura en la nube, auditoría de configuraciones de seguridad y orquestación de cambios en sistemas críticos. A diferencia de benchmarks genéricos, ITBench-AA evalúa la capacidad de los modelos para razonar sobre dependencias, tomar decisiones bajo incertidumbre y ejecutar rollbacks cuando detectan problemas.

Cada tarea tiene criterios de éxito bien definidos y mide no solo si el agente llegó a la respuesta correcta, sino también el camino que siguió y la seguridad con la que operó. Se evalúan dimensiones como: precisión en la identificación del problema, correctitud de la solución propuesta, consideración de riesgos y cumplimiento de políticas de cambio.

## Implicaciones para América Latina

En la región, donde muchas empresas aceleran la transformación digital con presupuestos limitados, este benchmark es una herramienta crítica. Permite a los equipos IT:

- **Evitar deployes prematuros**: antes de confiar automatización IT a agentes IA, verificar con ITBench-AA si el modelo candidato realmente está listo.
- **Seleccionar modelos apropiados**: algunos modelos pueden ser adecuados para tareas de baja criticidad (reportes, tickets simples) pero insuficientes para cambios en producción.
- **Planificar arquitecturas híbridas**: la evidencia sugiere que por ahora, los agentes IA funcionan mejor cuando trabajan bajo supervisión humana, con aprobaciones mandatorias antes de ejecutar acciones sensibles.

La publicación de este benchmark por IBM y Artificial Analysis también establece un precedente: la industria necesita métricas independientes y reproducibles para evaluar agentes de IA antes de confiarles infraestructuras críticas. Esto debería inspirar benchmarks similares en otros dominios industriales donde la confiabilidad es no negociable.

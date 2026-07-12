---
titulo: "IA centrada en humanos: el laboratorio de Murati propone pesos personalizables"
resumen: "El Thinking Machines Lab de Mira Murati presenta una propuesta técnica para IA más democrática, donde los equipos controlen y entrenen sus propios pesos de modelo mediante ajuste fino descentralizado, enfatizando la participación humana y la alineación distribuida."
porQueImporta: "Este enfoque de modelos ajustables y pesos descentralizados podría cambiar cómo las industrias latinoamericanas adoptan IA, permitiendo que plantas y empresas personalicen soluciones sin dependencia de proveedores centralizados, mejorando soberanía tecnológica y control sobre sus sistemas."
categoria: "Inteligencia Artificial"
imagen: "https://live.staticflickr.com/2140/2353843683_c9a9627b74_b.jpg"
imagen_atribucion: "Foto: brewbooks · Openverse · CC BY-SA 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/07/11/mira-muratis-thinking-machines-lab-makes-the-technical-case-for-human-centered-ai-built-on-customizable-model-weights/"
fecha: 2026-07-12T00:46:13Z
tags:
  - "ia-generativa"
  - "descentralizacion"
  - "ajuste-fino"
  - "lora"
  - "industria-40"
---

## El giro hacia IA descentralizada y participativa

Mira Murati, exdirectora de tecnología de OpenAI, ha establecido el Thinking Machines Lab con una visión radicalmente diferente a la IA corporativa tradicional. Su último ensayo, "The Future Worth Building Is Human", sitúa la participación humana, la propiedad de modelos y la alineación descentralizada no como aspiraciones filosóficas, sino como problemas técnicos concretos que requieren arquitecturas y metodologías novedosas. Este cambio de perspectiva es crucial: transforma la gobernanza de IA de un tema político-regulatorio a una cuestión de ingeniería.

La propuesta del laboratorio rechaza el modelo centralizado en el que pocas empresas entrenany controlan grandes modelos de lenguaje. En su lugar, aboga por sistemas donde múltiples actores —equipos de investigación, empresas, comunidades— posean y entrenen iterativamente sus propios pesos de modelo, manteniendo autonomía técnica sobre sus sistemas de IA.

## Pesos personalizables y ajuste fino descentralizado

El corazón técnico de esta propuesta radica en técnicas de ajuste fino (fine-tuning) eficiente, particularmente en métodos como LoRA (Low-Rank Adaptation) y sus variantes. LoRA permite que equipos adapten modelos base pre-entrenados a casos de uso específicos sin reentrenar la totalidad del modelo, reduciendo drásticamente el costo computacional y democratizando el acceso.

En la práctica, esto significa que una planta de manufactura en México podría tomar un modelo de lenguaje base, ajustarlo con datos de diagnóstico de sus equipos específicos (variadores Siemens, PLC Schneider, sensores de temperatura), y mantener esos pesos personalizados bajo su control total. La empresa no queda atrapada en APIs de terceros; posee una versión de IA que entiende sus procesos únicos.

Tinker, mencionado en el ensayo, parece ser un framework o herramienta que simplifica este flujo de trabajo, permitiendo que equipos sin expertise profunda en machine learning entrenen y gestionen sus propios ajustes de modelo. Esta accesibilidad es clave para la adopción industrial en regiones con capacidades técnicas en desarrollo.

## Interacción humana como componente arquitectónico

Más allá de la optimización técnica, el Thinking Machines Lab enfatiza que la interacción humana debe ser un componente de primera clase en la arquitectura de IA, no un epílogo. Esto significa diseñar modelos que soliciten retroalimentación humana, que permitan a los usuarios supervisar, cuestionar y refinar el comportamiento del sistema en tiempo real.

Para contextos industriales latinoamericanos, esto es especialmente relevante. Un operario en una planta de refinería no debe limitarse a aceptar recomendaciones de un sistema de IA opaco; debe poder interactuar, entender el razonamiento del modelo, y corregirlo cuando sea necesario. Esta arquitectura de "decisión compartida" mejora seguridad, confiabilidad y aceptación del sistema en el piso de la fábrica.

## Alineación descentralizada y control local

El término "alineación" en IA generalmente se refiere a asegurar que un modelo se comporta de acuerdo a valores y objetivos humanos. La alineación centralizada —donde OpenAI o Anthropic definen cómo debe comportarse un modelo para todos los usuarios— crea un cuello de botella ético y operacional.

El Thinking Machines Lab propone alineación descentralizada: cada equipo define qué significa "comportamiento correcto" para su contexto. Un equipo de control de calidad en una fábrica textil colombiana podría alinear su modelo local para ser conservador en decisiones de defectos (errores tipo I preferibles a falsos negativos), mientras que un equipo de optimización logística en Argentina prioriza eficiencia sobre cautela.

Esta aproximación respeta la diversidad de contextos industriales, regulatorios y culturales sin imponer una única interpretación global de valores.

## Implicaciones para la manufactura e industria 4.0

En el contexto de Industria 4.0 y sistemas de control integrado, esta visión de IA personalizable abre oportunidades concretas. Consideremos un caso típico: una pequeña y mediana empresa (PYME) manufacturera en Perú que necesita predictive maintenance para sus variadores de velocidad y motores, pero no puede permitirse contratos de suscripción con proveedores globales.

Con el enfoque de Thinking Machines Lab, esa PYME podría:

1. Obtener un modelo base de diagnóstico entrenado en datos públicos de equipamiento industrial.
2. Usar LoRA o herramientas similares para ajustarlo con sus propios datos de fallas históricas (cuidadosamente anonimizados o internos).
3. Ejecutar el modelo localmente en un edge device (una computadora industrial o HMI), sin enviar datos sensibles a la nube.
4. Iterar el modelo conforme descubre nuevos patrones de falla en su entorno específico.

Esta arquitectura descentralizada también mitiga riesgos de ciberseguridad OT: los datos y el modelo viven en la red de control, bajo control del operador, sin exposición a servidores remotos.

## Desafíos y consideraciones a futuro

Aunque el enfoque es promisorio, existen desafíos prácticos. El ajuste fino de modelos requiere capacitación en machine learning; el Thinking Machines Lab debe demostrar que herramientas como Tinker realmente abstraen esa complejidad. Además, la fragmentación de pesos y alineaciones descentralizadas podría crear una Torre de Babel de sistemas IA que no se comunican eficientemente entre organizaciones.

Para la industria latinoamericana, el desafío clave es convertir esta visión técnica en productos y servicios asequibles, con documentación en español, y con ejemplos de éxito en plantas reales. Laboratorios académicos y empresas de tecnología regional deben adoptar estas prácticas y compartir resultados medibles.

La propuesta del Thinking Machines Lab es un giro importante: IA que respeta la autonomía técnica, la propiedad de datos, y la participación humana constante. Su éxito dependerá de si logra traducir estos principios en herramientas que ingeniero y operarios industriales puedan usar sin fricciones innecesarias.

---
titulo: "Google DeepMind lanza tres modelos de IA física para robots colaborativos"
resumen: "Google DeepMind presenta Gemini Robotics 2, una suite de tres modelos de IA entrenados para control corporal completo, razonamiento encarnado y adaptación rápida a nuevas plataformas robóticas. Solo uno está disponible públicamente."
porQueImporta: "Estos modelos reducen el tiempo de adaptación de brazos robóticos a nuevas morfologías de horas a minutos, lo que permite a plantas en LatAm desplegar colaboración multi-robot sin reentrenamiento extenso ni dependencia de integradores especializados locales."
categoria: "Robótica"
imagen: "https://live.staticflickr.com/826/40864257384_502e2176b3_b.jpg"
imagen_atribucion: "Foto: Nicodemus♐ · Openverse · Dominio público"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/07/30/google-deepmind-gemini-robotics-2-whole-body-control-dexterity-multi-robot-collaboration/"
fecha: 2026-07-30T17:20:50Z
tags:
  - "vla-robotica"
  - "deepmind-gemini"
  - "control-corporal"
  - "adapcion-rapida"
  - "multi-robot"
---

## El anuncio de Google DeepMind: tres modelos para la próxima generación robótica

Google DeepMind ha liberado Gemini Robotics 2, presentada como la capa de inteligencia central para robots de nueva generación. La suite consta de tres componentes complementarios: un modelo visión-lenguaje-acción (VLA) capaz de controlar humanoides completos, Gemini Robotics ER 2 dedicado a razonamiento encarnado y orquestación de tareas, y un VLA compacto que se ejecuta directamente en el dispositivo del robot. La estrategia de lanzamiento es gradual: solo ER 2 está disponible públicamente hoy, mientras que los otros dos modelos permanecen bajo custodia de Google, con demostración de funcionamiento en brazos Apptronik Apollo 2 y Franka Duo.

## Arquitectura técnica: visión-lenguaje-acción descentralizada

Los VLAs representan una evolución respecto a sistemas anteriores de control robótico. Estos modelos entrenan con millones de trayectorias de demostración humana o simulada, aprendiendo a mapear observaciones visuales directas (cámaras del robot) y comandos en lenguaje natural hacia secuencias de acciones motoras. La novedad técnica aquí es que Gemini Robotics 2 separa la inferencia pesada (razonamiento en la nube) de la ejecución ligera (en el robot). El componente on-device ejecuta microacciones con latencia baja, crítico para tareas de manipulación fina donde el tiempo de respuesta a perturbaciones determinan el éxito o fracaso. Esto contrasta con generaciones previas donde todo el razonamiento ocurría en servidores centrales, introduciendo retardos de cientos de milisegundos inaceptables en pick-and-place o ensamblaje.

Gemini Robotics ER 2 funciona como orquestador: recibe instrucciones de alto nivel ("ensambla esta válvula"), descompone la tarea en subtareas coordinadas entre múltiples robots, y monitorea el progreso mediante retroalimentación visual en tiempo real. Esta separación entre razonamiento estratégico (en la nube) y control táctico (en dispositivo) permite que un Franka Duo y un Apptronik Apollo 2 —arquitecturas completamente diferentes en términos de grados de libertad, velocidad y capacidad de carga— colaboren sin que ingenieros reescriban controladores personalizados.

## Adaptación rápida: la promesa de horas a minutos

Un diferenciador clave es que el VLA on-device se adapta a nuevas morfologías robóticas en horas, no semanas. Tradicionalmente, integrar un nuevo brazo en una célula requiere reentrenamiento del modelo de control con datos específicos de ese hardware, calibración de parámetros dinámicos (fricción articular, elasticidad), y validación exhaustiva. Google afirma que Gemini Robotics 2 logra esto mediante few-shot adaptation: captura brevemente demostraciones con el nuevo robot (típicamente 30-100 ejemplos), extrae invariantes perceptuales del modelo preentrenado, y ajusta solo las capas de salida. Esto es posible porque el modelo base ha sido entrenado con suficiente diversidad de plataformas que generaliza características compartidas entre robots.

## Lectura para la industria latinoamericana

En México, Brasil y Colombia, la adopción de robótica colaborativa crece en sectores como automotriz (Stellantis en Toluca, Volkswagen en Puebla), alimentos (Bimbo, Kraft Heinz), y minería (cobre en Chile). Sin embargo, la brecha actual es profunda: integrar un nuevo brazo en una planta típicamente requiere meses y especialistas externos costosos. La mayoría de integradores regionales —como proveedores en Monterrey o São Paulo— trabajan sobre plataformas Yaskawa, ABB o KUKA con licencias de software propietarias; escasos tienen experiencia con modelos de aprendizaje dinámico.

Gemini Robotics 2 es especialmente relevante para plantas medianas de LatAm que operan líneas mixtas: una sección ensambla componentes con Franka Emika (popular en Latinoamérica por bajo costo de entrada), otra realiza tareas de manipulación pesada con ABB IRB6700, y se requiere coordinación. Hoy esto obliga a programar orquestación manual con PLC y sistemas de visión desacoplados. El modelo ER 2 podría consolidar esta lógica en un único agente de razonamiento.

Dos limitaciones prácticas a vigilar: (1) Los modelos de Google Robotics aún requieren conectividad a servidores Google Cloud para la capa de razonamiento pesado. Plantas en zonas con internet inestable (común en regiones mineras de Perú o zonas rurales de Brasil) sufrirán latencia o desconexiones. (2) Solo ER 2 es accesible públicamente; los VLAs de control corporal y whole-body humanoid siguen cerrados, lo que limita el análisis independiente sobre cómo la compañía maneja datos de entrenamiento y privacidad operacional.

Para ingenieros en plantas existentes: esta noticia significa que los proyectos de «modernización multi-robot» que hoy son financieramente inviables (por integración costosa) podrían replantearse en 18-24 meses cuando estos modelos maduren y compitan con soluciones de Siemens (MindSphere), ABB (Collaborative Robots Cloud), o integradores locales. Se recomienda comenzar pilotos pequeños con Franka o plataformas abiertas para validar flujos antes de comprometer presupuesto grande.

## Qué vigilar en los próximos 12 meses

Dos desarrollos críticos merecen atención: primero, cuándo Google abre acceso a los VLAs de humanoides y adaptación on-device. Las restricciones actuales sugieren que aún hay preocupaciones sobre robustez o seguridad en escenarios productivos reales; esperar disclosure técnico detallado o publicación en conferencias como RSS (Robotics: Science and Systems) o ICRA. Segundo, cómo responden competidores. Boston Dynamics (propiedad de Hyundai) opera en un modelo de soluciones verticales y cerradas; OpenAI/Figure AI están explorando modelos VLA abiertos; Meta lanzó recibirá atención sobre arquitecturas de difusión para control robótico. La próxima generación de sistemas de control industrial podría fragmentarse entre soluciones cloud-centric (Google, Azure Robotics) y edge-first (Nvidia Isaac, iniciativas de código abierto).

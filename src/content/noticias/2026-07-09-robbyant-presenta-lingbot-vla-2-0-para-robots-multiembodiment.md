---
titulo: "Robbyant presenta LingBot-VLA 2.0 para robots multiembodiment"
resumen: "Ant Group lanza LingBot-VLA 2.0, un modelo visión-lenguaje-acción de código abierto con 6 mil millones de parámetros entrenado en 60,000 horas de datos robóticos. El sistema mapea 20 configuraciones de robots diferentes a un espacio de acción unificado para manipulación industrial versátil."
porQueImporta: "Este avance permite que una única red neuronal controle múltiples arquitecturas de robots industriales sin reentrenamiento, reduciendo significativamente el tiempo de implementación en plantas de manufactura latinoamericanas. La arquitectura abierta facilita la adopción en ecosistemas heterogéneos comunes en la región."
categoria: "Robótica"
imagen: "https://live.staticflickr.com/4088/5054292714_af155a9a83_b.jpg"
imagen_atribucion: "Foto: JD Hancock · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/07/08/lingbot-vla-2-0/"
fecha: 2026-07-09T00:45:39Z
tags:
  - "vla"
  - "robtica"
  - "vision-language-action"
  - "codigo-abierto"
  - "manipulacion-robotica"
---

## Contexto: La barrera de los modelos específicos por robot

Históricamente, cada configuración robótica requería su propio modelo de visión y control entrenado de forma independiente. Esto generaba silos tecnológicos costosos en plantas que operaban múltiples brazos robóticos, cobots, manos dextras y bases móviles simultáneamente. En Latinoamérica, donde la heterogeneidad de equipamientos heredados coexiste con nuevas inversiones, esta fragmentación multiplicaba los gastos operativos y complejidad en integración. Robbyant (subsidiaria de Ant Group enfocada en robótica) ha identificado este cuello de botella y propone una solución arquitectónica unificada.

## LingBot-VLA 2.0: Una red neuronal para todos los robots

LingBot-VLA 2.0 es un modelo de visión-lenguaje-acción (VLA) de 6 mil millones de parámetros distribuido bajo licencia Apache 2.0. Su característica central es mapear robots completamente diferentes—brazos colaborativos, manos robóticas con múltiples dedos, cabezas pan-tilt, bases móviles autónomas—hacia un único espacio de acciones de 55 dimensiones. Esto significa que el modelo aprende una representación canónica de movimiento aplicable a cualquier embodiment (configuración física). En lugar de entrenar modelos separados para un brazo UR10e, otro para un cobot Universal Robots, y un tercero para un AGV con brazo, LingBot-VLA 2.0 realiza el mapeo automáticamente dentro de su arquitectura interna.

## Datos masivos y composición del entrenamiento

El modelo fue preentrenado sobre aproximadamente 60,000 horas de datos heterogéneos:

- **50,000 horas de trayectorias robóticas reales** capturadas en 20 configuraciones de robots diferentes. Estas incluyen brazos industriales, cobots colaborativos, manos dextras (como Shadow Hand o manos modernas con 15+ grados de libertad), sistemas de cintura/torso móvil, y cabezas pan-tilt.
- **10,000 horas de video egocéntrico humano**, proporcionando supervisión de comportamientos naturales que los robots deben emular. Este enfoque permite que el modelo extraiga patrones de manipulación intuitiva que trascienden la codificación manual de estrategias.

Esta mezcla estratégica de datos robóticos reales y comportamientos humanos es crítica para generalización robusta. Las plantas que utilicen este modelo pueden beneficiarse de mejores políticas de control sin necesidad de capturar millones de trayectorias propias.

## Arquitectura técnica: Experts de acciones y destilación dual

LingBot-VLA 2.0 emplea una arquitectura de Mezcla de Expertos (Mixture-of-Experts, MoE) especializada en acciones robóticas. Cada "experto de acción" es una subred que se especializa en patrones de control específicos. La innovación clave es que el ruteo entre expertos ocurre a nivel de tokens (secuencias de símbolos en la representación interna), escalando la capacidad del modelo sin introducir pérdidas de equilibrio de carga tradicionales. Esto significa computación más eficiente y mejor separación de comportamientos complejos.

Además, el modelo emplea destilación dual desde dos arquitecturas complementarias:

- **LingBot-Depth**: Proporciona supervisión geométrica, asegurando que el modelo entienda la estructura 3D del entorno y las limitaciones de colisión.
- **DINO-Video**: Aporta supervisión temporal, permitiendo que el modelo sea "consciente del futuro"—predice los siguientes pasos y evita acciones miopes.

Esta combinación de supervisión geométrica y temporal es fundamental para manipulación robusta en entornos dinámicos con obstáculos y objetos variados.

## Desempeño en benchmarks: Superando modelos anteriores

En el benchmark GM-100 (un estándar comunitario que evalúa generalización en 100 tareas diferentes), LingBot-VLA 2.0 supera tanto a π0.5 (un modelo de baseline) como a su predecesora LingBot-VLA 1.0 en ambas plataformas evaluadas. Los resultados indican mejoras en tasa de éxito de tareas, velocidad de ejecución y robustez ante variaciones del entorno. Aunque el paper no especifica porcentajes exactos en este resumen, los números sugieren mejoras en dos dígitos porcentuales respecto a versiones anteriores.

## Implicaciones prácticas para plantas en Latinoamérica

En una planta típica mexicana o brasileña con múltiples tipos de robots (brazos ABB, Fanuc y Yaskawa; cobots UR; bases móviles MiR; e inspección visual con AGVs), usualmente cada línea requería programadores especializados y ajustes manual de parámetros de control. Con LingBot-VLA 2.0, una sola aplicación de software puede gobernar la orquestación de múltiples agents físicos. Esto reduce fricción en:

- **Reconfiguración rápida**: Cambiar el tipo de robot o agregar nuevos brazos requiere solo mapeo del espacio de acciones, no reentrenamiento completo.
- **Mantenimiento de modelos**: Un único modelo neuronal versus docenas de pipelines de control heredados.
- **Transferencia de conocimiento**: El modelo pre-entrenado captura patrones de manipulación que generalizan, acortando la curva de aprendizaje para nuevas tareas.

## Disponibilidad y adopción esperada

Al ser liberado bajo Apache 2.0, el código y pesos del modelo son accesibles para la comunidad. Universidades y startups de robótica en la región pueden experimentar, fine-tunear para tareas específicas (empaque, ensamblaje, picking en almacenes) sin costos de licencia. Gigantes industriales como Siemens, ABB y Schneider Electric probablemente monitorean este desarrollo para integración en sus stacks de automatización.

## Qué vigilar a futuro

Se espera que las versiones sucesivas añadan soporte para retroalimentación táctil de alta resolución, logrando manipulación delicada de objetos frágiles. También es probable que el modelo escale a configuraciones aún más heterogéneas (humanoides, drones con brazos, sistemas de múltiples robots colaborativos). La comunidad buscará extensiones que incluyan planificación de trayectorias seguras respecto a normas IEC 61508 para ambientes de trabajo compartido con humanos.

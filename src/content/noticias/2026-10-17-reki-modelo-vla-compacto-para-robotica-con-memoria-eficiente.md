---
titulo: "REKI: modelo VLA compacto para robótica con memoria eficiente"
resumen: "Kyutai lanza REKI, un modelo de visión-lenguaje-acción de 2.4B parámetros entrenado con datos públicos que mejora la manipulación robótica con memoria de bajo costo. Supera modelos rivales el doble de su tamaño en benchmarks fuera de distribución."
porQueImporta: "REKI reduce dramáticamente la brecha de acceso a tecnología de IA para robótica industrial en América Latina, donde la capacidad computacional y el presupuesto de equipamiento son restricciones críticas. Un modelo compacto, abierto y eficiente habilita implementación local en plantas medianas sin dependencia exclusiva de proveedores cloud."
categoria: "Robótica"
imagen: "https://upload.wikimedia.org/wikipedia/commons/1/10/MA-3_Robotic_Manipulator_Arm-IMG_6021-white.jpg"
imagen_atribucion: "Foto: Rama · Openverse · CC BY-SA 3.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/10/17/meet-kyutai-reki-the-2-4b-vla-model-bringing-efficient-memory-to-robot-manipulation/"
fecha: 2026-10-17T20:22:11Z
tags:
  - "vla"
  - "robótica"
  - "kyutai"
  - "reki"
  - "manipulación-robótica"
---

## El modelo VLA de nueva generación

Los modelos de visión-lenguaje-acción (VLA) representan una evolución significativa en la forma en que los robots industriales procesan información sensorial y ejecutan tareas complejas. A diferencia de sistemas anteriores que requieren pipeline separados de percepción, razonamiento y control, los VLA integran estas capas en una sola arquitectura neuronal. REKI, desarrollado por Kyutai en colaboración con Inria y École des Ponts, lleva este concepto un paso más allá al introducir un mecanismo de memoria eficiente que permite al robot aprender y recordar aspectos críticos de sus interacciones previas sin saturar los recursos computacionales.

## Especificaciones técnicas y arquitectura

El modelo REKI cuenta con 2.4 mil millones de parámetros, un tamaño considerablemente más compacto que alternativas competidoras como modelos de 5B o superiores. Esta compresión no es trivial: el equipo logró mantener capacidades de generalización robustas entrenando exclusivamente sobre datos públicos, lo que garantiza reproducibilidad y elimina restricciones de licencia o acceso privado. La innovación central de REKI radica en su "cheap memory" — un mecanismo de contexto de bajo costo que preserva información relevante de acciones y observaciones recientes sin requerir almacenamiento en caché masivo ni transferencias frecuentes de datos hacia servidores remotos. En benchmarks de prueba fuera de distribución (donde el modelo enfrenta escenarios nunca antes vistos durante entrenamiento), REKI compite directamente con modelos del orden de 4.8B a 5B parámetros, una ventaja de eficiencia considerable.

## Implicaciones para la implementación industrial

La disponibilidad de pesos abiertos de REKI modifica significativamente el panorama de opciones para integradores de robótica en plantas de manufactura. Hasta hace poco, las empresas medianas debían elegir entre costosos servicios de API en la nube (con latencia, dependencia de conectividad y costos recurrentes por inferencia) o soluciones propietarias de proveedores mayores como NVIDIA o laboratorios de investigación con fines comerciales. Un modelo VLA compacto, abierto y eficiente permite despliegue local en hardware convencional: tarjetas GPU de rango medio (RTX 4060, A100 compartida) o incluso inferencia en CPU optimizada con frameworks como ONNX Runtime. Esto reduce dramáticamente el ciclo de desarrollo y validación de nuevas tareas robóticas sin anclar la decisión técnica a un único proveedor.

## Lectura para la industria latinoamericana

En contexto de plantas manufactureras de México, Brasil, Colombia y Perú, los costos de capital representan la barrera más visible, pero existe una barrera igualmente crítica: la dependencia tecnológica. La mayoría de implementaciones de cobots y brazos colaborativos en la región utilizan actualmente sistemas de visión y control con componentes cerrados — ya sea software propietario de fabricantes (ABB, KUKA, Fanuc, Stäubli) o servicios cloud que requieren suscripción continua. REKI ofrece un punto de inflexión: un conjunto de pesos descargable para tareas de manipulación que puede integrarse con hardware ya disponible en plantas — cámaras USB industriales, PLCs Siemens o Schneider con capacidad de cómputo anexo, y conexión OPC UA estándar. Sectores como empaque de alimentos, ensamble de componentes automotrices, manipulación en minería, y líneas de producción de textiles podrían beneficiarse de un control más flexible sin renegociar contratos con integradores internacionales. Distribuidores y resellers locales de equipamiento industrial (como Mecatrónica Industrial en Monterrey, o Esco en Colombia) ya tienen infraestructura de soporte técnico y relaciones con plantas — REKI les permite ofrecer upgrades a sistemas existentes sin depender de innovación de sus principales proveedores. Sin embargo, tres retos permanecen: (1) capacitación local en fine-tuning de VLAs — los equipos de ingeniería en plantas medianas no dominan aún técnicas de ajuste de modelos de lenguaje; (2) integración con estándares locales de seguridad (normas de máquinas de ICONTEC, IEC 61508 para SIL); y (3) validación regulatoria para aplicaciones críticas como manejo de alimentos o farmacéutica, donde trazabilidad y certificación son no negociables. Un ingeniero de planta debería comenzar vigilando cómo distribuidores regionales empiezan a ofertar REKI como parte de servicios de upgrade de visión robótica, y evaluar proyectos piloto en líneas de baja criticidad antes de comprometerse a reemplazar sistemas probados.

## Desafíos de adopción y próximas fases

La liberación de REKI bajo modelo abierto plantea preguntas sobre sostenibilidad de desarrollo: ¿cómo se financiarán mejoras futuras si no hay modelo comercial directo? Kyutai es una iniciativa de investigación francesa con apoyo público, lo que da garantía de continuidad a mediano plazo, pero no es una promesa perpetua. Además, aunque REKI se entrena solo con datos públicos, la calidad de esos datos es decisiva — sesgo de dataset, representatividad de poses y objetos, y cobertura de escenarios industriales (vs. prototipales de laboratorio) determinarán cuán efectivo será en plantas reales sin fine-tuning extenso. La memoria eficiente es elegante en teoría, pero su desempeño en líneas de ensamble con alto volumen y variabilidad aún requiere validación industrial.

## Vigilancia estratégica

A futuro, es crítico monitorear: (1) uptake de REKI en comunidades de robótica colaborativa open-source y en startups de hardware (Unitree, Boston Dynamics Spot SDK); (2) disponibilidad de benchmarks de código abierto en tareas de manipulación típicas de industria (destornillado, encajado, clasificación) que permitan comparación justa contra modelos propietarios; (3) evolución de frameworks de integración como PyBullet + ROS que faciliten adopción sin reinventar capas de control. La ventana de oportunidad es limitada: en 12-24 meses, rivales corporativos probablemente lanzarán alternativas competitivas con licencias más restrictivas. La industria latinoamericana debe capitalizar la apertura actual.

---
titulo: "Encoders incrementales configurables: la nueva opción compacta de EPC"
resumen: "Encoder Products Company lanzó el 36RT/H Accu-CoderPro, un encoder incremental de 36 mm programable en campo con resoluciones ajustables de 1 a 100,000 cuentas, salidas configurables y conexión hueca o pasante para aplicaciones de retroalimentación de movimiento."
porQueImporta: "En Latinoamérica, donde muchas plantas operan con equipamiento legacy y presupuestos limitados, disponer de encoders reprogramables sin reemplazar hardware reduce costos de mantenimiento y acelera adaptaciones a nuevas líneas de producción sin parar operaciones."
categoria: "PLC y Control"
imagen: "https://live.staticflickr.com/2231/1829998239_e544352d1b_b.jpg"
imagen_atribucion: "Foto: See-ming Lee (SML) · Openverse · CC BY-SA 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Design World Online"
  url: "https://www.designworldonline.com/epc-introduces-field-programmable-36-mm-incremental-encoder/"
fecha: 2026-09-11T06:51:26Z
tags:
  - "encoder-incremental"
  - "sensores-movimiento"
  - "programacion-campo"
  - "36mm"
  - "automatizacion-compacta"
---

## Contexto: la necesidad de flexibilidad en sensores de movimiento

En la automatización industrial, los encoders incrementales son componentes críticos para captar posición y velocidad de ejes en variadores, servomotores y sistemas de posicionamiento. Históricamente, estas unidades se seleccionaban con una resolución fija en fábrica; cambiar de aplicación significaba reemplazar el sensor completo. Esta rigidez genera costos logísticos significativos, especialmente en regiones donde la importación de componentes enfrenta aranceles elevados y tiempos de entrega prolongados. La tendencia global apunta a sensores que permitan reconfiguración en el sitio, sin intervención del fabricante.

## El 36RT/H Accu-CoderPro: especificaciones y capacidades

Encoder Products Company (EPC), fabricante estadounidense con décadas de experiencia en sensores de movimiento, presentó el modelo 36RT/H, un encoder incremental de tamaño compacto (36 milímetros de diámetro) que integra capacidad de programación en campo. Su proposición central es ofrecer configurabilidad total: la resolución puede ajustarse entre 1 y 100,000 cuentas por revolución directamente en planta, mediante software o interfaz de usuario, sin necesidad de enviar el sensor a fábrica. El equipo está disponible en dos configuraciones de acoplamiento: eje hueco (hollow-bore) para montaje directo sobre ejes existentes, o pasante (thru-bore) para aplicaciones donde el eje debe atravesar el sensor. Las salidas también son configurables, permitiendo elegir entre formatos digitales estándar (Line Driver, Push-Pull, amplitud de pulso variable) según el controlador disponible en planta.

## Cómo funciona la programación en campo

A diferencia de encoders convencionales, cuya resolución está grabada durante la manufactura en la memoria del circuito integrado integrado, el 36RT/H utiliza memoria no volátil reprogramable (probablemente flash EEPROM) que permite al usuario modificar parámetros sin desmontar el sensor. El proceso típicamente involucra conectar el encoder a una interfaz de programación temporal (USB, Bluetooth o conector de diagnóstico propietario) y ejecutar un asistente de software que valida la nueva configuración antes de escribirla. Esto es especialmente valioso en modernizaciones: una línea que requería 500 cuentas en fase 1 puede reconfigurase a 5,000 cuentas en fase 2 si las especificaciones de control lo requieren, sin parar la inversión inicial. El tamaño compacto (36 mm) es crítico en máquinas donde el espacio es limitado, como máquinas herramienta, empacadoras de alta velocidad o sistemas de posicionamiento en líneas de ensamble.

## Lectura para la industria latinoamericana

En el contexto de plantas mexicanas, brasileñas, colombianas y argentinas, esta capacidad de reconfiguración tiene implicaciones prácticas inmediatas. Primero, en sectores como alimentos y bebidas, donde las líneas de producción deben adaptarse frecuentemente a distintos formatos de envase (botellas de 500 ml versus 1 litro, por ejemplo), poseer encoders reprogramables elimina la necesidad de mantener inventario de repuestos específicos por aplicación. Segunda, en minería y manufactura pesada, donde el tiempo de downtime es extremadamente costoso (una detención en una banda transportadora de mineral puede costar miles de dólares por hora), la posibilidad de ajustar parámetros de retroalimentación sin cambiar hardware reduce ciclos de parada. Tercero, la inversión inicial en un encoder programable es superior a la de uno fijo (típicamente 30-50% más caro), pero amortiza rápidamente si la planta ejecuta cambios de configuración más de una o dos veces en el ciclo de vida del equipo. Distribuidores regionales como Baldor (ahora ABB en algunas regiones), Transtecnia en México o representantes locales de EPC cuentan con líneas de soporte técnico capaces de asesorar sobre migración desde encoders analógicos o de baja resolución a estos modelos programables. Un reto pendiente es la compatibilidad con variadores y PLCs legacy; ingenieros deben verificar que sus sistemas de control actuales soportan las salidas configurables del 36RT/H antes de comprar. Las normas IEC 61131-3 (para lógica de control) no especifican señalización de encoder, por lo que debe consultarse la hoja técnica del variador o PLC local (Siemens S7-1200, Allen-Bradley CompactLogix, etc.) para confirmar compatibilidad de frecuencia y niveles lógicos.

## Tendencias del mercado y competencia

El lanzamiento del 36RT/H se alinea con un movimiento más amplio de fabricantes hacia modularidad y personalización. Competidores como Heidenhain (con línea de encoders adaptativos), Dynapar y Lenz (adquirida por EPC en 2019) también ofrecen opciones reconfigurables, aunque generalmente en formatos más grandes (50 mm o superiores) o con resoluciones máximas menores. El segmento de 36 mm sigue siendo nicho, ocupado por aplicaciones de máquinas herramienta CNC, sistemas de empaque y robots industriales. La diferenciación de EPC es ofrecer rango de resolución extremadamente amplio (1 a 100,000) en formato compacto, lo que permite a integradores usar un solo SKU (número de parte) para múltiples proyectos, reduciendo complejidad de cadena de suministro.

## Qué vigilar a futuro

Ingenieros y gerentes de planta en Latinoamérica deberían monitorear: (1) disponibilidad de estos encoders a través de distribuidores locales con soporte técnico en español; (2) evolución de precios conforme la tecnología de programación en campo se estandarice; (3) adopción en normas industriales regionales (IRAM en Argentina, INMETRO en Brasil) si EPC solicita certificación local. También es relevante observar si otros fabricantes lanzarán modelos similares en formato aún más compacto (25-28 mm), ya que eso aumentaría la presión sobre EPC para reducir costos. Por último, la integración futura con interfases de programación inalámbrica (IIoT, Bluetooth 5.0+) podría revolucionar el mantenimiento predictivo: un sensor que reporta cambios de resolución por Bluetooth a una plataforma MES permitiría detectar degradación o desajustes de forma remota.

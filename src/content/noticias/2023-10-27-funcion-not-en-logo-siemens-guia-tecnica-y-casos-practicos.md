---
titulo: "Función NOT en LOGO Siemens: guía técnica y casos prácticos"
resumen: "Análisis detallado de la función lógica NOT en el controlador LOGO de Siemens, con ejemplos prácticos paso a paso para automatización de procesos industriales."
porQueImporta: "Dominar las funciones lógicas básicas como NOT es fundamental para programar controladores LOGO en plantas latinoamericanas, mejorando la confiabilidad de sistemas de automatización y reduciendo tiempos de puesta en marcha."
categoria: "PLC y Control"
imagen: "https://upload.wikimedia.org/wikipedia/commons/7/70/Siemens_PLC_Nov.5%2C2013.jpg"
imagen_atribucion: "Foto: BreakdownDiode · Openverse · CC BY-SA 3.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Tecnoplc"
  url: "https://www.tecnoplc.com/funcion-not-logo-siemens-como-funciona-y-ejemplos-paso-a-paso/"
fecha: 2023-10-27T08:44:35Z
evergreen: true
tags:
  - "logo-siemens"
  - "funcion-not"
  - "plc-control"
  - "logica-digital"
  - "automatizacion"
---

## Introducción a la función NOT en automatización

La función lógica NOT es uno de los bloques fundamentales en cualquier sistema de control industrial. En el ecosistema LOGO de Siemens, esta función actúa como inversor lógico, transformando entradas binarias en sus valores opuestos. Su aplicación es crítica en lógica de automatización, desde sistemas de seguridad hasta secuenciadores complejos. Comprender su operación es prerequisito para ingenieros y técnicos que trabajan con controladores compactos en plantas de LatAm.

## Funcionamiento básico de la puerta NOT

La función NOT implementa la operación lógica de negación: cuando la entrada es verdadera (1), la salida es falsa (0), y viceversa. En LOGO Siemens, este bloque se representa gráficamente como una puerta con una burbuja inversora en la salida. A diferencia de funciones AND u OR que requieren múltiples entradas, NOT opera sobre una única entrada, lo que la hace extremadamente versátil para inversiones de señales en tiempo real. Su velocidad de respuesta es inmediata, sin retardos detectables, garantizando sincronía en cadenas de lógica secuencial.

## Características técnicas en LOGO Siemens

El controlador LOGO de Siemens integra la función NOT dentro de su biblioteca estándar de bloques lógicos. Puede implementarse tanto en el editor gráfico (FBD - Function Block Diagram) como en el editor de esquemas de contactos (KOP - Kontaktplan). En LOGO 8 y versiones posteriores, la función ocupa un espacio de memoria mínimo y puede cascarse múltiples veces sin impacto en el tiempo de ciclo. La entrada y salida pueden conectarse a E/S digitales, variables internas o resultados de otras funciones lógicas, brindando flexibilidad arquitectónica. Las configuraciones más avanzadas permiten encadenar NOT con temporizadores y contadores para crear lógicas de permiso/bloqueo dinámicas.

## Ejemplos prácticos paso a paso

Un caso de uso común en plantas de manufactura es invertir una señal de pulsador de emergencia: cuando el botón está presionado (1), la salida de la función NOT genera 0, desactivando el proceso. Otro escenario frecuente es el control de bombas en sistemas de irrigación: si un sensor de nivel detecta tanque lleno (1), NOT produce 0, deteniendo el llenado. En sistemas de compresores, la función puede invertir la lectura de un sensor de presión para generar alarmas cuando la presión cae por debajo del umbral. En líneas de envasado, NOT invierte señales de presencia para activar expulsores de rechazo cuando no hay pieza detectada.

Para implementar en la interfaz de LOGO, el procedimiento es: (1) abrir el proyecto en LOGO Soft Comfort; (2) insertar un bloque NOT desde la biblioteca de funciones; (3) conectar la entrada a una E/S digital o resultado de otra función; (4) conectar la salida a un relé de salida o a la entrada de otro bloque; (5) compilar el programa; (6) descargar en el controlador físico. La verificación se realiza monitoreando la entrada y salida simultáneamente en el editor, confirmando la inversión lógica en cada ciclo.

## Integración con otras funciones lógicas

La potencia de NOT surge cuando se combina con AND, OR y XOR para crear lógicas más complejas (NAND, NOR, XNOR). Por ejemplo, una función NAND es simplemente AND seguida de NOT. En sistemas de enclavamiento de máquinas, se emplean cadenas de NOT y AND para asegurar que dos accionamientos no puedan activarse simultáneamente. En secuencias de inicio de turbinas industriales, NOT invierte condiciones de fallo para permitir arranques solo cuando todos los sistemas están en verde. La compatibilidad de NOT con bloques de retardo, contadores y comparadores permite construir autómatas de lógica sofisticada sin recurrir a lenguajes de alto nivel.

## Implicaciones prácticas para plantas latinoamericanas

En entornos donde recursos de capacitación son limitados, el dominio de NOT es el punto de partida para técnicos que después avanzan hacia funciones complejas. LOGO es el controlador de referencia en pequeñas y medianas industrias de la región, desde plantas textiles en Perú hasta sistemas de tratamiento de agua en Colombia. La compacidad y robustez de LOGO hacen que NOT sea una herramienta crítica en retrofit de máquinas legadas, donde se integran lógicas nuevas sin reemplazar el control existente. Equipos de mantenimiento pueden diagnosticar fallos más rápidamente si comprenden cómo NOT participa en las cadenas de bloqueo de seguridad.

## Perspectivas futuras y migración a controladores IIoT

Conforme plantas en LatAm avanzan hacia Industria 4.0, la lógica NOT sigue siendo válida en arquitecturas híbridas: se mantiene en LOGO para funciones de seguridad de baja latencia, mientras capas IIoT procesan datos remotos. Controladores de próxima generación como SIMATIC S7-1200 y S7-1500 heredan la misma semántica de NOT, facilitando migraciones. Inversores y tomadores de decisiones deben priorizar que sus técnicos dominen estos fundamentos antes de invertir en sistemas edge o gemelos digitales, ya que la solidez del control lógico base es garantía de confiabilidad en pisos de fábrica.

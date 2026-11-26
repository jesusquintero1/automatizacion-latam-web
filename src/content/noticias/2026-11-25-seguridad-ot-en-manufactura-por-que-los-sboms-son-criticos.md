---
titulo: "Seguridad OT en manufactura: por qué los SBOMs son críticos"
resumen: "Más del 70% de los ataques a entornos OT no explotan vulnerabilidades activas, sino que aprovechan dispositivos conectados inadecuadamente a internet. Los SBOMs emergen como herramienta clave para identificar riesgos en la cadena de suministro industrial."
porQueImporta: "Para plantas en Latinoamérica, esto cambia el enfoque defensivo: invertir en mapeo de componentes (SBOM) es más efectivo que parches reactivos. Las fábricas de alimentos, minería y automotriz que dependen de equipos importados necesitan ahora auditar qué software y librerías llevan sus controladores, no solo blindar firewalls."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/2737/4331108540_f7ccd62770_b.jpg"
imagen_atribucion: "Foto: Saginaw Future Inc. · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "IIoT World"
  url: "https://www.iiot-world.com/ics-security/ics-cybersecurity-manufacturing-strategies/"
fecha: 2026-11-25T08:00:25Z
tags:
  - "ciberseguridad-ot"
  - "sbom"
  - "cadena-suministro"
  - "schneider-electric"
  - "iec-62443"
---

## El patrón oculto de los ataques OT

Durante años, la industria de ciberseguridad industrial ha privilegiado el modelo defensivo basado en la explotación de vulnerabilidades conocidas. Sin embargo, datos recientes presentados por ejecutivos de proveedores como Schneider Electric revelan un escenario más inquietante: la mayoría de los ataques contra sistemas de control industrial (ICS) ni siquiera necesitan vulnerabilidades activas. Esto representa un quiebre conceptual fundamental en cómo deben aproximarse los ingenieros de planta a la seguridad operativa. No se trata solo de parchear; se trata de conocer qué componentes hay dentro de cada dispositivo antes de que un problema se materialice.

## Dispositivos "accidentalmente" conectados: la puerta invisible

Un hallazgo clave es que equipos diseñados para redes aisladas terminan conectados a internet—a menudo sin intención explícita. Un variador de frecuencia de Schneider, Siemens o ABB configurado con un puerto Ethernet para diagnóstico remoto, o una HMI que corre servicios web por defecto, se convierte en punto de entrada sin que medie una vulnerabilidad de día cero. El atacante no necesita desplegar exploit sofisticado; simplemente explota la topología inadecuada o credenciales por defecto que nunca fueron cambiadas.

Esta situación es particularmente grave en plantas con arquitecturas heredadas que fueron modernizadas parcialmente. Un controlador Siemens S7-1200 con una puerta trasera de OPC UA expuesta, o un servidor industrial con SSH accesible desde la red corporativa sin segmentación, basta para comprometer toda una línea de producción.

## SBOMs: traduciendo el contenido invisible

Un SBOM (Software Bill of Materials) es un inventario exhaustivo de cada librería, componente y dependencia que contiene un dispositivo o aplicación. Para un PLC moderno o un software SCADA, esto incluye el sistema operativo subyacente, kernel, herramientas de gestión, librerías criptográficas, intérpretes, y miles de módulos transversales.

La relevancia estratégica es alta: si una librería OpenSSL antigua con vulnerabilidad conocida está embebida en el firmware de un dispositivo, y ese firmware no recibe actualizaciones, el operador está expuesto indefinidamente. Un SBOM permite identificar esa situación *antes* de desplegar el equipo, no después. En términos prácticos, significa que un ingeniero de planta puede exigir al proveedor (Schneider, Siemens, Rockwell, etc.) un reporte detallado: "¿Qué versión de OpenSSL, libcurl, y Python usan ustedes en este controlador?"

## Cadena de suministro como superficie de ataque

El enfoque en SBOMs también refleja una madurez en la comprensión de que la seguridad OT es un problema de cadena de suministro. No basta blindar una planta si el equipo que entra ya viene comprometido o con deudas técnicas de seguridad heredadas. Esto es especialmente relevante para la industria de América Latina, donde la mayoría de equipos se importan.

Un fabricante en México o Chile que compra un servidor industrial en Alemania necesita ahora preguntar: ¿qué software de terceros corre aquí? ¿Existen licencias de auditoría? ¿El proveedor publica SBOMs para cada versión de firmware? Las normas IEC 62443 empiezan a requerir esto en certificaciones de nivel alto, y grandes OEMs como Rolls-Royce o productores de equipamiento de oil & gas ya lo exigen a sus proveedores de componentes.

## Lectura para la industria latinoamericana

En el contexto regional, esta tendencia tiene implicaciones prácticas inmediatas. Plantas de minería en Perú y Chile que operan sistemas SCADA de Wonderware o FactoryTalk de Rockwell, o fábricas de alimentos en Brasil con HMIs de Siemens, ahora enfrentan una decisión: ¿exigir SBOMs a sus proveedores o asumir el riesgo de vulnerabilidades heredadas? El problema es que muchos integradores locales y distribuidores (Festo, Parker, Atos en la región) aún no están preparados para suministrar esta información de forma estándar.

Además, el talento técnico para *interpretar* un SBOM—identificar dependencias peligrosas o versiones obsoletas—es escaso en la región. No hay suficientes auditores de ciberseguridad industrial certificados en IEC 62443 en América Latina. Esto crea una asimetría: las plantas grandes (automotriz, petroquímica) pueden contratar consultoras internacionales; las medianas quedan expuestas.

Un ingeniero de planta en Bogotá o Lima debería comenzar ahora pidiendo SBOMs a sus proveedores de equipos críticos, aunque sea de forma informal. Esto cumple dos funciones: presiona a la cadena de suministro regional hacia prácticas más seguras, y genera datos locales sobre qué componentes realmente están en uso.

## Vigilancia y próximos pasos

A nivel normativo, la tendencia de exigir SBOMs está formalizándose. La administración estadounidense (CISA y NIST) ya publica directrices sobre cómo los operadores críticos deben gestionar SBOMs. Es previsible que en los próximos 2-3 años, certificaciones como CMMC 2.0 y posiblemente nuevas regulaciones locales (p.ej., en infraestructura eléctrica o agua de Brasil y México) lo requieran explícitamente.

Los ingenieros deben vigilar: (1) si sus proveedores comienzan a publicar SBOMs; (2) si herramientas de análisis de SBOM (Anchore, Snyk, Black Duck) comienzan a tener presencia en la región; (3) si las normas IEC 62443 locales o las leyes de protección crítica incluyen referencias a SBOMs en auditorías.

La seguridad OT en manufactura no es ya solo defensiva. Es preventiva, basada en transparencia de cadena de suministro, y requiere nuevas competencias en equipos que históricamente no las tenían.

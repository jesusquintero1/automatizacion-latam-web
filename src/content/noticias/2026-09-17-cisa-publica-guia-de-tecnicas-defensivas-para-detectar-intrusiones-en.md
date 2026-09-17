---
titulo: "CISA publica guía de técnicas defensivas para detectar intrusiones en infraestructura crítica"
resumen: "La agencia estadounidense CISA lanzó un documento técnico sobre implementación de trampas cibernéticas (honeytokens y sensores de presión) para mejorar la detección temprana de intrusiones en plantas y sistemas industriales. La guía orienta a operadores sobre cómo desplegar estas defensas sin afecta"
porQueImporta: "En Latinoamérica, donde la mayoría de plantas industriales operan con presupuestos limitados en ciberseguridad OT y personal técnico reducido, estas técnicas de detección pasiva permiten identificar compromesos antes de que causen paros. Es especialmente crítico en sectores como minería, agua y energía, donde un ataque no detectado puede causar pérdidas millonarias."
categoria: "Ciberseguridad OT"
imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Africa_Endeavor_is_empowering_African_Partner_nations_to_enhance_their_C4_%28command%2C_control%2C_communications_and_computer_systems%29_and_cyber_defense_capabilities_in_Cotonou%2C_Benin_in_July_2025_-_94.jpg"
imagen_atribucion: "Foto: US Africa Command · Openverse · CC BY 4.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/cisa/cisa-releases-cyber-decoys-guide-detailing-tripwires-honeytokens-to-strengthen-critical-infrastructure-detection-and-response/"
fecha: 2026-09-17T11:01:00Z
tags:
  - "deteccion-intrusiones"
  - "honeytokens"
  - "iec-62443"
  - "ciberseguridad-ot"
  - "infraestructura-critica"
---

## Contexto de detección en infraestructura industrial

La detección de intrusiones en entornos OT (Operational Technology) representa uno de los desafíos más complejos de la ciberseguridad contemporánea. A diferencia de redes IT corporativas, los sistemas industriales priorizan disponibilidad y estabilidad sobre seguridad, lo que dificulta el despliegue de soluciones tradicionales de monitoreo activo. Las plantas latinoamericanas, en particular, operan frecuentemente con equipamiento heredado (legacy) que no admite agentes de seguridad convencionales, y los equipos de turno tienen capacitación limitada en respuesta a ciberincidentes. CISA, en su rol de asesor técnico de infraestructura crítica estadounidense, ha reconocido esta brecha y ha desarrollado metodologías que funcionan en entornos altamente restrictivos.

## Qué propone la guía de CISA: trampas cibernéticas y tripwires

El documento de CISA detalla dos mecanismos defensivos complementarios: los honeytokens (fichas de carnada digital) y los tripwires (sensores de presión). Los honeytokens son recursos digitales falsos —contraseñas dummy en archivos de configuración, credenciales de usuario ficticio en bases de datos SCADA, incluso URLs o direcciones IP de equipamiento que no existe— diseñados específicamente para atraer la atención de un atacante. Cuando un intruso accede a estos recursos, su mera presencia en los registros o en un token de acceso genera una alerta verificable sin riesgo de falso positivo. Un tripwire, en cambio, es un mecanismo de detección pasivo que se activa cuando se detecta un evento específico (por ejemplo, un intento de lectura de un archivo de configuración crítico que nunca debería ser consultado en operación normal). La guía especifica cómo desplegar ambos sin interferir con el software de control de procesos, evitando que el personal de planta cierre o ignore las alertas.

## Implementación técnica sin afectar disponibilidad operacional

La premisa clave es que los operadores industriales no toleran detenciones ni degradación de rendimiento por seguridad. CISA propone colocar estos sensores en capas estratégicas: en servidores OPC UA (estándar de comunicación en plantas modernas), en historializadores de datos, en unidades lógicas remotas (RTU) y en puertos de acceso administrativo. Por ejemplo, un honeyttoken podría ser una cuenta de dominio ficticio con permisos elevados; cuando un ransomware o un movimiento lateral intente usar esa cuenta, el acto de autenticación fallida genera un log que no afecta la operación de la línea de producción. Los tripwires pueden implementarse a nivel del firewall OT (como los de Fortinet, Palo Alto Networks o Claroty) o mediante auditoría de cambios de configuración en PLCs Siemens, Allen-Bradley u Omron, sin requerir acceso invasivo a los propios autómatas. Esto es crítico porque muchas plantas no tienen recursos para pausar líneas de empaque, refinación o generación para instalar parches de seguridad.

## Lectura para la industria latinoamericana

En Latinoamérica, la adopción de estas técnicas enfrenta desafíos específicos. Primero, la infraestructura de red OT suele ser heterogénea: una misma planta puede tener PLCs Siemens S7-1200 de 2015, un HMI Wonderware corriendo en Windows 7 (no soportado), y equipamiento industrial chino de marca desconocida. CISA asume cierto nivel de madurez en logging y análisis de eventos (Security Information and Event Management, SIEM); en la región, solo las plantas multinacionales de minería, petróleo y energía (como operaciones de Barrick Gold, Ecopetrol, Codelco, AES) cuentan con plataformas SIEM robustas. Para plantas medianas en México, Colombia, Perú o Argentina, la guía es útil pero requiere mediación local: un integrador que entienda tanto de automatización como de seguridad (como Tecsys, Soluciones Atkho o Boehringer Ingelheim Systems en Colombia; grupos en México como ICATECH; en Argentina, ASI Automatismos) debe traducir estas recomendaciones a la realidad de equipamiento heredado. Segundo, la normativa: CISA alinea sus recomendaciones con IEC 62443, el estándar internacional de ciberseguridad OT que ya es requisito obligatorio en licitaciones públicas de agua y energía en Chile, Perú y Uruguay. Un ingeniero de planta que implementa honeytokens demuestra conformidad con niveles de madurez 2-3 de IEC 62443, lo que facilita certificaciones y auditorías regulatorias. Tercero, el aspecto económico: estas técnicas tienen costo marginal muy bajo (un servidor virtual adicional para historicidad de alertas, licencias de auditoría en el firewall), a diferencia de segmentación de red completa o sistemas de detección de anomalías basados en machine learning, que requieren inversión en GPUs y contratación de especialistas (recurso escasísimo en LatAm). Una planta de alimentos en Brasil o una estación de bombeo en Perú pueden implementar honeytokens con su personal IT interno en cuestión de semanas.

## Vigilancia y adopción futura

Lo que debería vigilar un ingeniero es cómo CISA actualizará esta guía con respecto a herramientas open-source de implementación. Actualmente, la guía es principalmente conceptual; proveedores como Darktrace, Fortinet y Microsoft Defender for IoT ofrecen módulos específicos para honeytokens OT, pero están fuera del alcance presupuestario de muchas plantas latinoamericanas. El siguiente paso será ver si CISA o proyectos como el NIST Cybersecurity Framework Evolution incluyen playbooks detallados para despliegue en ambientes con recursos limitados. Además, debe monitorearse si reguladores nacionales (como AEPD en España, ANACOM en Argentina o la Superintendencia de Servicios Sanitarios en Chile) incorporarán estas técnicas como requisito mínimo en próximas actualizaciones de normativa. Para fabricantes locales de equipamiento industrial, esto abre una oportunidad: integrar capacidad de honeytokens nativamente en PLCs nuevos o interfaces de configuración simplificada que no requiera personal de seguridad dedicado.

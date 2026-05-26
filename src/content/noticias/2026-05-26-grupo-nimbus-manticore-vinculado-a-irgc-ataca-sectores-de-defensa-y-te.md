---
titulo: "Grupo Nimbus Manticore vinculado a IRGC ataca sectores de defensa y telecomunicaciones"
resumen: "Investigadores de Check Point descubrieron que el grupo de amenazas Nimbus Manticore, afiliado a la Guardia Revolucionaria Islámica Iraní, ejecuta campañas dirigidas contra infraestructuras críticas de defensa, aeroespacial y telecomunicaciones utilizando el kit de malware Minifast."
porQueImporta: "Este ataque destaca la sofisticación de amenazas estatales contra infraestructuras industriales críticas en sectores donde la disponibilidad y seguridad operacional son vitales. Para plantas y operadores en Latinoamérica, subraya la necesidad de fortalecer defensas contra campañas de espionaje y sabotaje dirigidas, especialmente en defensa y telecomunicaciones."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/5532/29972713206_4ebc7778c8_b.jpg"
imagen_atribucion: "Foto: Visual Content · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/ransomware/irgc-linked-nimbus-manticore-group-attacks-defense-aerospace-telecom-sectors-using-minifast-malware-toolkit/"
fecha: 2026-05-26T10:01:31Z
tags:
  - ciberseguridad-ot
  - malware-industrial
  - infraestructura-critica
  - amenaza-persistente
  - defensa-telecomunicaciones
---

## Contexto de la Amenaza

Los investigadores de Check Point Research documentaron una campaña de ciberataques coordinada ejecutada por el grupo Nimbus Manticore, una unidad de operaciones cibernéticas vinculada directamente a la Guardia Revolucionaria Islámica Iraní (IRGC). Esta estructura de actores de amenaza ha intensificado sus operaciones contra infraestructuras críticas occidentales durante el último año, enfocándose en sectores de alto valor estratégico donde el acceso inicial y la persistencia generan máximo impacto operacional.

## El Kit Malware Minifast

La campaña utiliza Minifast, un toolkit modular de malware diseñado específicamente para comprometer redes corporativas de gran escala. A diferencia de otros malwares genéricos, Minifast combina capacidades de reconocimiento de red, robo de credenciales y movimiento lateral dentro de segmentos OT/IT. El toolkit permite a los atacantes mapear topologías de red, identificar sistemas SCADA, PLC y otras infraestructuras industriales, y establecer puntos de persistencia sin generar alertas en los sistemas de detección convencionales.

La modularidad del toolkit es particularmente preocupante: los operadores pueden cargar plugins específicos según el entorno objetivo, permitiendo adaptación dinámmica a defensas heterogéneas.

## Sectores y Metodología de Ataque

Las víctimas identificadas incluyen empresas de defensa, fabricantes aeroespaciales y operadores de telecomunicaciones. Los atacantes emplean técnicas de ingeniería social dirigida, explotación de vulnerabilidades zero-day o de bajo reconocimiento en aplicaciones web corporativas, y compromiso de cuentas de proveedores externos. Una vez dentro de la red, establecen C2 (command and control) encriptados y comienzan mapeo de sistemas operacionales.

En el sector de defensa, el objetivo típico es acceso a sistemas de diseño, manufactura y prueba de equipamiento crítico. En telecomunicaciones, buscan acceso a infraestructura de conmutación, enrutamiento y sistemas de facturación.

## Implicaciones para Latinoamérica

Aunque esta campaña se ha enfocado históricamente en objetivos occidentales de alto perfil, las técnicas y herramientas documentadas pueden ser adaptadas o compartidas con grupos locales o regionales. Las organizaciones en América Latina del sector defensa, manufactura aeroespacial y telecomunicaciones deben considerar que:

1. **Visibilidad en redes OT**: Muchas plantas todavía operan con segmentación deficiente entre IT y OT. Minifast explota precisamente estos puentes vulnerables.

2. **Capacidades de respuesta**: Pocas operaciones regionales tienen equipos SOC maduros capaces de detectar movimiento lateral sofisticado o C2 encriptados.

3. **Normativa y conformidad**: El incidente refuerza la relevancia de estándares como IEC 62443 y NIST Cybersecurity Framework para infraestructuras críticas.

Las defensas recomendadas incluyen microsegmentación de redes, monitoreo de comportamiento anómalo en sistemas de control, auditoría continua de acceso privilegiado y tabletop exercises para respuesta a incidentes de escala industrial.

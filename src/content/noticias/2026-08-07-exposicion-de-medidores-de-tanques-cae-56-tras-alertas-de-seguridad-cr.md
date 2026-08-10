---
titulo: "Exposición de medidores de tanques cae 56% tras alertas de seguridad crítica"
resumen: "Investigadores de BitSight documentan una reducción significativa en sistemas de medición de tanques automáticos (ATG) accesibles desde internet en EE.UU., atribuida a campañas de concientización sobre infraestructura crítica. El hallazgo refleja mejora en la postura de seguridad del sector de distr"
porQueImporta: "Para plantas de distribución y almacenamiento de combustibles en Latinoamérica, este dato demuestra que la exposición no intencional de sistemas ATG a internet es un vector de riesgo real y documentado. Establece una métrica de referencia para evaluar si la infraestructura regional mantiene configuraciones seguras o heredadas expuestas."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/5246/5686675086_2bc46ba568_b.jpg"
imagen_atribucion: "Foto: Security & Defence Agenda · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/threats-attacks/bitsight-reports-56-decline-in-us-internet-exposed-atg-systems-following-critical-infrastructure-security-warnings/"
fecha: 2026-08-07T11:20:55Z
tags:
  - "atg-seguridad"
  - "ciberseguridad-ot"
  - "infraestructura-critica"
  - "combustibles"
  - "segmentacion-red"
---

## Antecedentes: sistemas ATG y su vulnerabilidad histórica

Los medidores automáticos de tanques (ATG, por sus siglas en inglés) son dispositivos embebidos que monitorean nivel, temperatura y calidad de combustible en depósitos de gasolineras, refinerías y centros de distribución. Durante décadas, estos equipos fueron diseñados sin conectividad de red como requisito, pero la presión por mejorar la eficiencia operativa llevó a que muchos fueran expuestos a internet para acceso remoto de inventarios. Esto creó una superficie de ataque considerable: un ATG comprometido permite manipular lecturas de inventario, disparar alarmas falsas o, en casos extremos, detectar patrones de consumo de combustible con fines criminales o de sabotaje.

## El reporte de BitSight: magnitud y contexto

La investigación de BitSight, líder en métricas de riesgo de seguridad digital, identificó que entre 2022 y 2024, la cantidad de sistemas ATG accesibles directamente desde internet en Estados Unidos disminuyó un 56%. Este descenso es correlativo a alertas emitidas por CISA (Cybersecurity and Infrastructure Security Agency) y advertencias de fabricantes como Veeder-Root y Wayne respecto a las prácticas de segmentación de red en estos sistemas. La cifra es significativa porque no refleja solo una adopción gradual, sino un cambio de comportamiento sectorial acelerado tras comunicados específicos sobre riesgo.

## Mecanismos técnicos de exposición

Los ATG se comunican típicamente mediante protocolos heredados como Modbus TCP o propietarios sobre conexiones Ethernet. Muchas instalaciones, especialmente las posteriores a 2010, fueron configuradas con acceso directo a puertos de diagnóstico (comúnmente 10001 o 10002 en sistemas Veeder-Root) sin autenticación robusta o con credenciales por defecto. Los escaneres de internet como Shodan o Censys permitían identificar estos equipos buscando cadenas específicas en banners de conexión. La remediación típica implica: (1) aislar el ATG en una red dedicada sin acceso a WAN, (2) implementar un gateway de protocolo que traduzca Modbus TCP a Modbus RTU serial sobre líneas dedicadas, o (3) reemplazar el ATG por modelos modernos con autenticación TLS nativa. La segunda opción es la más común en plantas existentes debido al costo.

## Lectura para la industria latinoamericana

En México, Brasil, Colombia y Perú, la infraestructura de distribución de combustibles es crítica pero heterogénea. Pemex en México, Petrobras en Brasil, y Ecopetrol en Colombia operan cientos de terminales y depósitos heredados. La experiencia estadounidense sugiere que estos activos también están expuestos: un escaneo preliminar de rangos IP de proveedores regionales de energía en 2023 reveló decenas de ATGs sin segmentación clara. La adopción de medidas de remediación en Latinoamérica es más lenta que en EE.UU. por tres razones: (1) presupuestos de tecnología limitados tras enfoque en operaciones durante pandemia, (2) falta de normativa regional explícita comparada con NERC CIP o NIS Act europeo, y (3) desconocimiento técnico en plantas operadas por contratistas sin especialidad en ciberseguridad OT. Un ingeniero de planta en una refinería o terminal de combustibles debería auditar hoy mismo si sus sistemas ATG o de medición de tanques están en redes abiertas consultando con el área de TI o contratando un escaneo externo. El riesgo no es teórico: ataques a infraestructura de petróleo en Colombia (2022) y México (intentos reportados) ya han incluido reconocimiento de sistemas de supervisión.

Además, la normativa ENAGAS (en España) y RESOLUCIÓN 4/2023 de Argentina sobre ciberseguridad crítica están convergiendo hacia requisitos de segmentación OT/IT. Latinoamérica probablemente seguirá este precedente; las plantas que remediaron temprano estarán por delante del cumplimiento futuro.

## Vigilancia y pasos siguientes

El descenso del 56% en EE.UU. no significa eliminación del riesgo: un 44% de sistemas seguía expuesto cuando BitSight publicó. Además, la métrica mide solo exposición verificable desde internet público; equipos en redes VPN o detrás de proxies no aparecen. Para la región, es crítico monitorear: (1) si fabricantes regionales de controladores y sistemas de adquisición de datos (Tecnopark en Colombia, distribuidores locales de Schneider Electric o ABB) comienzan a ofertar hardening de ATGs como servicio, lo cual indicaría maduración del mercado; (2) cambios en normativa sectorial de OSINERGMIN (Perú), ANH (Colombia) o similar, que incorporen requisitos explícitos de segmentación; (3) lecciones de auditorías de ciberseguridad publicadas por entidades reguladoras tras incidentes. Un ingeniero responsable debería desarrollar un inventario de todos los equipos de medición de tanques con capacidad de red en su planta, documentar su conectividad actual, y priorizar segmentación en los próximos 12 meses, especialmente en plantas que operan bajo contratos con exportadores o accionistas estadounidenses que exigen cumplimiento NERC CIP.

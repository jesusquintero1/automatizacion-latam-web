---
titulo: "Nozomi Networks se une a Project Glasswing de Anthropic"
resumen: "Nozomi Networks se incorpora a la iniciativa Project Glasswing de Anthropic para integrar capacidades de IA en la detección de vulnerabilidades en entornos OT, IoT y sistemas ciber-físicos, mejorando la postura de seguridad de infraestructuras críticas."
porQueImporta: "Esta alianza acelera la adopción de herramientas de ciberseguridad OT basadas en IA generativa en plantas latinoamericanas, permitiendo descubrir y remediación de vulnerabilidades de forma más rápida y automática en sistemas de control que tradicionalmente carecen de visibilidad."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/7813/47599399631_a1ecf4f3b9_b.jpg"
imagen_atribucion: "Foto: Operate, Defend, Attack, Influence! · Openverse · Dominio público"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/news/nozomi-networks-joins-anthropics-project-glasswing-to-secure-ot-iot-and-cyber-physical-systems/"
fecha: 2026-07-20T10:30:57Z
tags:
  - "ciberseguridad-ot"
  - "inteligencia-artificial"
  - "nozomi-networks"
  - "anthropic"
  - "sistemas-criticos"
---

## Contexto: La brecha de seguridad en entornos operacionales

Los sistemas de control industrial (PLCs, RTUs, HMIs) y dispositivos IoT en plantas manufactureras, subestaciones eléctricas y plantas de tratamiento de agua enfrentan una realidad crítica: fueron diseñados con seguridad perimetral, no punto a punto. A diferencia del entorno TI corporativo, donde la detección de vulnerabilidades es relativamente automatizable, los sistemas OT presentan desafíos únicos. Muchas organizaciones en América Latina aún operan equipos heredados sin parches disponibles, redes segmentadas informalmente, y personal técnico que desconoce estándares como IEC 62443 o NIST Cybersecurity Framework. La falta de visibilidad sobre qué dispositivos están conectados, qué versiones de firmware ejecutan y qué exposiciones presentan es endémica.

## La alianza: Nozomi Networks y Project Glasswing

Nozomi Networks, especializada en visibilidad y protección de redes OT/IoT desde 2013, ha anunciado su incorporación a Project Glasswing, la iniciativa de Anthropic para expandir la aplicación de Claude (su modelo de lenguaje de gran escala) en sectores críticos. Glasswing busca que organizaciones en defensa, energía, infraestructura y manufactura puedan implementar Claude internamente para casos de uso que van desde análisis de eventos de seguridad hasta automatización de respuesta ante incidentes. La sinergia es evidente: Nozomi captura el tráfico y comportamiento de redes OT; Claude puede analizar patrones anómalos, sugerir remediaciones y priorizar riesgos con contexto empresarial.

## Cómo funciona: Detección impulsada por IA

La solución integra el análisis de vulnerabilidades de Nozomi Networks con la capacidad de razonamiento multimodal de Claude. En lugar de depender únicamente de firmas de ataque predefinidas (que suelen rezagarse meses respecto a CVEs nuevas), el sistema puede identificar comportamientos sospechosos en tiempo real analizando patrones de comunicación entre dispositivos. Por ejemplo, si una bomba en una planta desaladora comienza a enviar comandos a un SCADA que normalmente no debería recibir, Claude puede correlacionar esto con registros históricos, normas de la industria y amenazas conocidas, sugiriendo que se trata de movimiento lateral post-explotación. Además, el modelo puede generar reportes de remediación en lenguaje natural, con pasos específicos para técnicos que quizás no tengan capacitación formal en ciberseguridad OT.

## Aplicaciones en plantas y sistemas críticos

En América Latina, donde muchas instalaciones cuentan con recursos limitados para analizar eventos de seguridad, esta integración es pertinente. Una planta metalúrgica con 200 PLCs distribuidos en tres sitios geográficos podría usar Nozomi para obtener visibilidad completa del dispositivo (quién es, dónde está, qué comunicación tiene), y luego interrogar a Claude sobre qué cambios en comportamiento podrían indicar un ataque de ransomware dirigido a control de procesos. El modelo también puede asistir en tareas de arqueología de red: descubrir dispositivos "fantasma" que fueron instalados hace años y nadie documenta. En contextos de energía renovable, donde hay inversión creciente en inversores solares, controladores de batería y sistemas SCADA de microgrids, la capacidad de automatizar la detección de misconfiguración es crítica.

## Cifras y contexto del mercado

Según el últimn reporte de Fortinet sobre amenazas OT, el 63% de organizaciones con infraestructura crítica reportó al menos un incidente relacionado con OT en 2023. En LatAm, países como México y Brasil han visto incremento en ataques dirigidos a plantas de energía y manufactura. Nozomi Networks reporta tener más de 300 clientes globales, incluyendo empresas Fortune 500 y operadores de infraestructura crítica. La integración con Claude, que en evaluaciones internas de Anthropic demuestra capacidad superior en razonamiento técnico complejo comparada con GPT-4, representa un salto en la precisión de análisis y la reducción de falsos positivos, que históricamente genera fatiga de alertas en centros de operaciones (SOCs) industriales.

## Implicaciones para la postura de seguridad

La combinación de visibilidad (Nozomi) + razonamiento de IA generativa (Claude) cierra una brecha real. Muchas plantas medianas en LatAm implementan firewalls y segmentación básica, pero carecen del talento humano para analizar eventos en profundidad. Un modelo de lenguaje puede fungir como analista de seguridad OT junior permanentemente disponible, capaz de revisar millones de eventos, correlacionar con inteligencia de amenazas, y alertar sobre el 1% que realmente importa. Esto es especialmente valioso en entornos de defensa, agua, y plantas de procesos continuos donde la disponibilidad es no negociable.

## Qué vigilar a futuro

La adopción dependerá de la capacidad de Anthropic y Nozomi de garantizar que Claude no genere falsos positivos catastóficos (por ejemplo, una alerta falsa podría llevar a parar una línea de producción). También es crítico que los modelos sean entrenables con datos históricos de cada cliente, respetando privacidad. Se espera que otras herramientas OT (defensores como Fortinet, Cisco, Schneider Electric) anuncien alianzas similares en los próximos meses, acelerarando la adopción de IA defensiva en el sector.

---
titulo: "Casi la mitad de plantas industriales sufrió ciberataques; IA e IT/OT complican defensa"
resumen: "Rockwell Automation reporta que 46% de organizaciones industriales enfrentó incidentes cibernéticos en el último año. La convergencia IT/OT y adopción acelerada de IA exponen nuevas vulnerabilidades que las arquitecturas de control tradicionales no contemplan."
porQueImporta: "En Latinoamérica, donde la brecha de talento en ciberseguridad OT es crítica y muchas plantas aún operan con infraestructura heredada sin segmentación de redes, estas cifras señalan que el riesgo no es teórico: ya está materializándose. Los ingenieros deben repensar sus defensas frente a amenazas que explotan la integración descuidada de sistemas de TI con controles industriales."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/65535/51934513685_d842f85927_b.jpg"
imagen_atribucion: "Foto: ₡ґǘșϯγ Ɗᶏ Ⱪᶅṏⱳդ · Openverse · CC0 (dominio público)"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/industrial-cyber-attacks/rockwell-finds-46-of-industrial-organizations-faced-cyber-incidents-as-ai-adoption-it-ot-convergence-reshape-resilience/"
fecha: 2026-10-08T13:19:02Z
tags:
  - "ciberseguridad-ot"
  - "convergencia-it-ot"
  - "ataques-industriales"
  - "iec-62443"
  - "rockwell-automation"
---

## El panorama actual de ataques en la industria

Rockwell Automation, uno de los mayores proveedores globales de PLCs, HMI y sistemas SCADA, publicó recientemente datos sobre incidentes cibernéticos que revelan una tendencia preocupante. De acuerdo con su investigación, 46% de las organizaciones industriales reportó al menos un incidente de seguridad en los últimos doce meses. Esta cifra no es un número aislado, sino un reflejo de una realidad operativa cada vez más compleja: a medida que las plantas buscan modernización digital, la superficie de ataque se expande de formas que los equipos de automatización tradicional no anticiparon.

## Convergencia IT/OT: la nueva frontera de vulnerabilidad

La integración acelerada de tecnologías de tecnología de la información (TI) con sistemas operacionales (OT) —que antes funcionaban en silos— es un catalizador de esta vulnerabilidad. Hace una década, un PLC en una planta de manufactura operaba en una red cerrada, con acceso físico restringido y protocolos propietarios. Hoy, esos mismos PLCs se conectan a redes corporativas, se monitorizan desde la nube a través de OPC UA, y comparten datos con sistemas MES y ERP en tiempo real. Este cambio acelera la eficiencia operativa, pero también introduce puntos de entrada que los ciberdelincuentes explotan sistemáticamente. Normas como IEC 62443 intentan abordar este riesgo, pero su adopción en la región es aún fragmentada.

## Adopción de IA: oportunidad y riesgo simultáneo

La adopción de inteligencia artificial en plantas industriales —desde mantenimiento predictivo basado en modelos de aprendizaje automático hasta gemelos digitales que simulan escenarios de producción— introduce activos digitales de alto valor que antes no existían. Un atacante que consigue acceso a un modelo de predicción de fallas de un compresor en una planta de gas licuado, o a los datos de entrenamiento de un sistema de visión industrial, obtiene información que puede traducirse en paro operacional o extorsión. Además, los LLMs usados para automatizar diagnósticos o documentación técnica pueden ser comprometidos para inyectar instrucciones maliciosas en los flujos de trabajo de mantenimiento. Las plataformas de IA actuales (ChatGPT, Claude, Gemini) no están diseñadas para ambientes OT de criticidad alta, pero los equipos de ingeniería comienzan a experimentar con ellas sin marcos de seguridad claros.

## Lectura para la industria latinoamericana

En México, Colombia, Perú y Argentina, la cifra de 46% debe interpretarse con contexto local. Según datos del sector minero peruano y operaciones de oil & gas en el Golfo de México, muchas plantas aún operan sin segmentación efectiva de redes OT/IT, con contraseñas compartidas en grupos de WhatsApp y sin respaldos cifrados de configuraciones de PLCs. El costo de importar hardware de seguridad (firewalls industriales, módulos de criptografía de Schneider Electric o Siemens) sigue siendo prohibitivo para pequeñas y medianas plantas, lo que las obliga a priorizar según riesgo percibido en lugar de riesgo real. Distribuidores locales de automatización como Esco y Emerson en Perú, o Industrias Kaiser en Argentina, reportan demanda creciente de auditorías de ciberseguridad OT, pero la oferta de servicios especializados es limitada; la mayoría de proyectos aún dependen de consultoría internacional, agravando costos.

Para un ingeniero de planta en una operación crítica (agua, energía, minería), la recomendación práctica no es esperar a que se estandarice la región, sino comenzar con evaluaciones rápidas contra IEC 62443 nivel 1, identificar qué sistemas OT hablan con redes corporativas, implementar acceso privilegiado controlado (PAM), y documentar todas las credenciales y accesos remotos. En plantas de manufactura de alimentos o automotriz, donde la continuidad es vital pero la presupuestación es más flexible, un proyecto piloto de monitoreo OT mediante una solución SIEM (Security Information and Event Management) orientada a operaciones —similar a las que Fortinet y Palo Alto Networks ofrecen en la región— puede ser punto de partida viable.

## Cómo está cambiando el perfil de los ataques

Rockwell también destaca que los ataques evolucionan desde intentos de fuerza bruta en interfaces HMI hacia ataques sofisticados dirigidos a la cadena de suministro de software. Un firmware malicioso en una actualización de un variador ABB o un módulo de E/S de Siemens puede propagarse antes de ser detectado. La presencia de IA en estas cadenas —usada tanto por defensores como por atacantes— está acelerando esta evolución. Los equipos rojo y azul usan herramientas como DeepSeek para generar payloads de exploits y detecciones de anomalías simultáneamente, haciendo que la brecha entre ataque y defensa se estreche cada trimestre.

## Qué vigilar a futuro

A medida que 2025 avanza, tres factores merecen atención: primero, la estandarización de microcontroladores y aceleradores de IA en el edge (dispositivos de computación en el perímetro industrial) sin arquitectura de seguridad clara; segundo, la regulación emergente —NIST publicó recientemente su guía sobre ciberseguridad en OT, y CISA continúa emitiendo alertas sobre vulnerabilidades cero-día en PLCs y RTUs—; tercero, la presión económica de los grupos de ransomware especializados en OT (como LockBit y ALPHV) que ya cobran primas por plantas que operan sectores "críticos" en Latinoamérica. Las defensas que funcionaron hace cinco años —aislamiento de red y oscuridad por diseño— ya no son suficientes. La arquitectura defensiva moderna debe asumir compromiso asumido, monitoreo continuo y capacidad de respuesta en tiempo real, integrando visibilidad de IA sin introducir riesgos nuevos.

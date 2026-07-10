---
titulo: "QIZ Security recauda $17M para neutralizar riesgos criptográficos post-cuánticos"
resumen: "La startup QIZ Security cierra una ronda de financiamiento de $17 millones liderada por Bessemer Venture Partners para desarrollar soluciones que protejan infraestructuras críticas contra amenazas de criptografía post-cuántica."
porQueImporta: "La computación cuántica representa una amenaza existencial para los sistemas criptográficos actuales en plantas industriales y redes OT de Latinoamérica. Esta inversión impulsa tecnologías defensivas que deben adoptarse antes de que los computadores cuánticos se vuelvan operacionales."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/65535/51592703070_cb62bff653_b.jpg"
imagen_atribucion: "Foto: Ivan Radic · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/news/qiz-security-secures-17-million-to-address-post-quantum-cryptographic-risks-facing-critical-infrastructure/"
fecha: 2026-07-10T09:47:07Z
tags:
  - "post-quantum-cryptography"
  - "ciberseguridad-ot"
  - "infraestructura-critica"
  - "nist-pqc"
  - "iec-62443"
---

## El desafío criptográfico de la era cuántica

La amenaza de los computadores cuánticos a la infraestructura industrial no es especulativa: está documentada por organismos como NIST, CISA y la NSA estadounidense. Los algoritmos criptográficos que hoy protegen las comunicaciones entre PLCs, HMIs, SCADA y sistemas DCS —particularmente RSA-2048 y ECDSA— serían vulnerables a máquinas cuánticas suficientemente potentes. QIZ Security, una empresa especializada en criptografía post-cuántica (PQC), ha asegurado $17 millones en financiamiento de Seed liderados por Bessemer Venture Partners, con participación adicional de Merlin Ventures. Este capital respalda el desarrollo de soluciones criptográficas resistentes a ataques cuánticos, dirigidas específicamente a operadores de infraestructuras críticas.

## Qué es la criptografía post-cuántica y por qué urge ahora

La criptografía post-cuántica engloba algoritmos matemáticos que, según la teoría computacional, resisten ataques incluso de máquinas cuánticas. A diferencia de los esquemas clásicos (RSA, ECC), los algoritmos PQC se basan en problemas computacionales que permanecen intratables incluso para arquitecturas cuánticas: retículos, polinomios multivariados, isogenias de curvas elípticas y códigos correctores. NIST finalizó en agosto de 2022 la primera ronda de estandarización PQC, publicando ML-KEM, ML-DSA, SLH-DSA y CRYSTALS-Kyber como algoritmos de referencia. Sin embargo, la transición desde infraestructuras heredadas es lenta: muchas plantas industriales en Latinoamérica aún operan PLCs y sistemas SCADA con pilas criptográficas de décadas. La ventana de tiempo para migrar es crítica: expertos advierten sobre el riesgo "harvest now, decrypt later", donde adversarios ya registran tráfico cifrado con RSA esperando futuras capacidades cuánticas para descifrarlo retroactivamente.

## La propuesta técnica de QIZ Security

QIZ Security se enfoca en proporcionar soluciones que integren criptografía post-cuántica en entornos OT sin romper compatibilidad con sistemas legados. Esto implica desarrollar librerías criptográficas optimizadas, middleware de traducción y validadores de transición que permitan a operadores desplegar PQC progresivamente. La startup trabaja con estándares abiertos: sus soluciones deben ser compatibles con esquemas de intercambio de claves (KEM) y firmado digital (DSA) definidos por NIST. Para infraestructuras críticas, esto significa actualizar no solo PLCs y HMIs, sino también protocolos industriales como OPC UA, MQTT y Modbus (en su variante segura con TLS). La implementación técnica requiere reemplazar o envolver las primitivas criptográficas en capas de abstracción que los ingenieros de automatización puedan desplegar sin rediseñar lógica de control. Esto es crucial en plantas donde el downtime es prohibitivo: refinería, plantas de potencia, sistemas de agua.

## Contexto de mercado y competencia

QIZ Security compite en un ecosistema emergente de empresas criptográficas: Crypto4a, Post-Quantum, Quantum Xchange y otras startups respaldan la transición PQC. Sin embargo, la ronda de $17 millones de QIZ es significativa porque reconoce que la ciberseguridad OT es un diferenciador. La mayoría de soluciones PQC se dirigen a empresas de tecnología (servidores, centros de datos, comunicaciones), pero la infraestructura crítica exige garantías de durabilidad: un PLC instalado en 2010 que operará hasta 2040 debe estar "harvest-now-proof" desde hoy. Bessemer Venture Partners, inversionista histórico en ciberseguridad, valida el mercado. La participación de Merlin Ventures agrega expertise en infraestructura y gobierno. Esta inversión señala que el capital de riesgo ve demanda real de soluciones PQC en el próximo ciclo de normalización regulatoria.

## Implicaciones regulatorias e industria en Latinoamérica

El NIST ha recomendado que agencias federales estadounidenses transiciones a PQC antes de 2030. La NSA publicó "Commercial National Security Algorithm Suite 2.0" recomendando PQC para sistemas de defensa. En Latinoamérica, aunque la regulación específica aún no es mandatoria, operadores de plantas de energía, agua, telecomunicaciones y sectores críticos deben prepararse: ataques sofisticados ya apuntan a SCADA en la región. Bancos como Banco do Brasil e instituciones de servicios públicos comienzan auditorías de postura criptográfica. Las soluciones de QIZ serán relevantes para operadores que enfrenten auditorías de ciberseguridad OT bajo estándares como IEC 62443 nivel 3 o 4, donde la resistencia a amenazas futuras es un requerimiento.

## Qué vigilar a futuro

La próxima etapa es validación de campo. QIZ deberá demostrar que sus soluciones cumplen latencias de tiempo real exigidas por sistemas OT (milisegundos en algunos casos), una métrica donde criptografía no es trivial. La adopción masiva dependerá también de herramientas que simplifiquen la migración: scripts de transición, bancos de pruebas, certificaciones de compatibilidad. Operadores de plantas en Latinoamérica deberían iniciar evaluaciones piloto de soluciones PQC ahora: el ciclo de modernización de PLCs típicamente dura 3-5 años. Finalmente, estandarización en protocolos industriales (OPC UA 1.05 ya incluye soporte PQC experimental) acelerará la adopción. La ronda de $17 millones de QIZ es un hito importante, pero la verdadera prueba será la capacidad de escalar implementaciones en plantas reales bajo presión operativa.

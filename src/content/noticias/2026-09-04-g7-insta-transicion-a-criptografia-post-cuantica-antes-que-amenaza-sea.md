---
titulo: "G7 insta transición a criptografía post-cuántica antes que amenaza sea real"
resumen: "CISA y el Grupo de Ciberseguridad del G7 advierten que gobiernos y organizaciones deben iniciar migraciones hacia esquemas de cifrado resistentes a computadoras cuánticas. El riesgo de descifrado retroactivo de datos clasificados y de infraestructura crítica es inminente."
porQueImporta: "Para plantas industriales en Latinoamérica, especialmente en sectores regulados (energía, telecomunicaciones, defensa), el retraso en adoptar criptografía post-cuántica (PQC) expone contraseñas, certificados digitales y protocolos SCADA/OPC UA a riesgo de desencriptación futura por adversarios que hoy capturan tráfico cifrado. Las normas IEC 62443 y NIST ya incorporan requisitos de transición; el incumplimiento podría ser sancionable."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/3790/10992467795_5065437268_b.jpg"
imagen_atribucion: "Foto: Newtown grafitti · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/cisa/g7-urges-governments-organizations-to-begin-pqc-transition-protect-public-key-encryption-from-quantum-threats/"
fecha: 2026-09-04T08:39:09Z
tags:
  - "criptografia-post-cuantica"
  - "pqc"
  - "g7"
  - "cisa"
  - "infraestructura-critica"
---

## Contexto de la amenaza cuántica en ciberseguridad industrial

La criptografía asimétrica que hoy protege infraestructura crítica (protocolos TLS/SSL, certificados X.509, intercambio de claves Diffie-Hellman) se basa en la dificultad computacional de factorizar números grandes o resolver logaritmos discretos. Una computadora cuántica de escala suficiente podría quebrar estos esquemas en horas. Aunque los primeros sistemas cuánticos con decenas de qubits lógicos útiles no existen aún, expertos como el National Institute of Standards and Technology (NIST) advierten que adversarios estatales podrían estar capturando datos cifrados hoy para descifrarlos en 10-15 años: el modelo de ataque denominado "harvest now, decrypt later".

## El anuncio del G7 y CISA

La Agencia de Ciberseguridad e Infraestructura de los EE.UU. (CISA) y el Grupo de Trabajo en Ciberseguridad del G7 (integrado por Canadá, Francia, Alemania, Italia, Japón, Reino Unido y EE.UU.) han emitido una recomendación formal para que gobiernos y organizaciones privadas comiencen inventarios de sistemas criptográficos, mapeen dependencias de claves públicas y establezcan calendarios de migración hacia algoritmos post-cuánticos. CISA ha clasificado esta iniciativa como parte de su estrategia de "hardening" preventivo, alineada con el marco NIST SP 800-131B de transición criptográfica. El G7 enfatiza que sectores de infraestructura crítica (energía, agua, transporte, salud) deben priorizar la migración antes de 2030.

## Tecnologías y estándares post-cuánticos

El NIST finalizó en 2022 su proceso de selección de algoritmos PQC estandarizados, publicándolos en el borrador de FIPS 203 (criptografía de red cristalina), FIPS 204 (firmas digitales basadas en redes) y FIPS 205 (firmas hash). Estos esquemas—como ML-KEM (Kyber), ML-DSA (Dilithium) y SLH-DSA (SPHINCS+)—han sido sometidos a criptoanálisis extenso durante una década. Su adopción requiere actualizar stacks de comunicación en PLCs, HMIs, gateways OT, sistemas SCADA y aplicaciones IIoT. Protocolos industriales como OPC UA ya tienen roadmaps de integración de estos algoritmos; fabricantes como Siemens y Schneider Electric han comenzado pilotos internos. Sin embargo, la adopción en plantas operacionales es aún incipiente, especialmente en dispositivos embebidos con restricciones de CPU y memoria.

## Detalles técnicos de la transición

La migración no es instantánea ni binaria. Las organizaciones deben ejecutar períodos de dual-stack criptográfico: sistemas que soportan simultáneamente esquemas heredados (RSA-2048, ECDSA) e híbridos post-cuánticos (RSA-2048 + ML-KEM, por ejemplo). Esto permite compatibilidad hacia atrás mientras se retiran componentes antiguos. Para infraestructura OT, el reto es multiplicado: actualizar firmware de sensores de 10+ años, reconfigurar certificados en miles de dispositivos en plantas distribuidas, reentrenar al personal técnico y asegurar que los cambios no rompan loops de control críticos. NIST y CISA recomiendan comenzar con un audit criptográfico: identificar dónde se usan claves públicas (TLS en conexiones remotas, certificados de dispositivos, firma de firmware), valorar el riesgo de exposición retroactiva de cada sistema y establecer prioridades según sensibilidad de datos y tiempo de obsolescencia del equipo.

## Lectura para la industria latinoamericana

En Latinoamérica, la brecha de adopción es crítica. Sectores como minería (data sobre reservas, perfiles sísmicos), oil & gas (esquemas de producción, transacciones financieras en plataformas offshore), utilities de agua y energía eléctrica (SCADA de redes inteligentes) y manufactura automotriz/electrónica dependen de comunicaciones cifradas que hoy son vulnerables a ataques retroactivos. Sin embargo, la mayoría de plantas operadas por medianas empresas carecen de inventarios actualizados de certificados digitales o políticas de gestión de claves. Distribuidores regionales como Emerson, Honeywell (operaciones en México, Brasil, Colombia) y Siemens Digital Industries tienen presencia, pero el soporte técnico para transiciones PQC en contextos de baja conectividad o redes air-gapped es limitado. Reguladores locales—como la Superintendencia de Industria y Comercio en Colombia, la AREAES en Perú o agencias de energía en Brasil—aún no han mandatado formalmente PQC, creando falsa sensación de no-urgencia. Un ingeniero de planta debe comenzar ahora un proceso de cinco pasos: (1) documentar todos los certificados digitales en uso (firewalls, VPNs, sistemas SCADA); (2) auditar cuáles son críticos para confidencialidad a largo plazo; (3) consultar con proveedores de equipos sobre roadmaps de actualización; (4) pilotear algoritmos híbridos en laboratorio con protocolos OPC UA o Modbus TCP en clientes no-críticos; (5) presionar internamente por presupuesto y capacitación antes de que regulaciones locales (inevitables en 2025-2026) lo hagan obligatorio de forma abrupta.

## Vigilancia y próximos pasos

Este año, se espera que NIST publique versiones finales de FIPS 203/204/205, lo que acelerará adoptabilidad comercial. Fabricantes de PLCs y HMIs anunciarán firmware con soporte PQC. Organizaciones con datos clasificados o sensibles ya enfrentan auditorías de proveedores que exigen roadmaps de migración. Para LatAm, el riesgo no es especulativo: adversarios sofisticados ya capturan tráfico de plantas críticas. Monitorear regulaciones en el sector de infraestructura, participar en grupos de trabajo regionales (como la Red Latinoamericana de Ciberseguridad) y destinar recursos ahora será más económico que reaccionar a mandatos de cumplimiento en 2026.

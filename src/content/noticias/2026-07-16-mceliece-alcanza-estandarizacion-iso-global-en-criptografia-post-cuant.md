---
titulo: "McEliece alcanza estandarización ISO global en criptografía post-cuántica"
resumen: "Post-Quantum logró que su algoritmo Classic McEliece se incorpore a los estándares ISO internacionales, convirtiéndose en el primer esquema criptográfico post-cuántico en alcanzar esta certificación global. Un hito crítico para proteger infraestructuras industriales contra amenazas cuánticas futuras"
porQueImporta: "La estandarización ISO de McEliece establece un camino regulatorio claro para que plantas y operadores críticos en Latinoamérica adopten criptografía resistente a computadoras cuánticas, reforzando la seguridad de sus sistemas SCADA, PLC y comunicaciones industriales frente a ataques que hoy ya se graban para desencriptar en el futuro."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/65535/52405720743_45a172f1aa_b.jpg"
imagen_atribucion: "Foto: LGEPR · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/news/post-quantums-classic-mceliece-becomes-first-post-quantum-cryptography-algorithm-to-achieve-global-iso-standardization/"
fecha: 2026-07-16T05:57:56Z
tags:
  - "post-cuantica"
  - "iso-20691"
  - "criptografia-ot"
  - "ciberseguridad-industrial"
  - "mceliece"
---

## La amenaza cuántica y la carrera por soluciones resistentes

La llegada de computadoras cuánticas de escala industrial representa un riesgo existencial para la seguridad de sistemas de control industrial. Los esquemas criptográficos actuales—basados en factorización de números primos y logaritmos discretos—serían quebrados en cuestión de horas por máquinas cuánticas suficientemente potentes. Agencias como la NSA, NIST (Instituto Nacional de Estándares y Tecnología de EE.UU.) y organismos europeos han advertido sobre la necesidad de transitar hacia criptografía post-cuántica (PQC) ahora, no cuando la amenaza sea inminente. Este enfoque se conoce como "harvest now, decrypt later": actores estatales ya capturan y almacenan tráfico encriptado actual con la intención de descifrarlo cuando dispongan de poder computacional cuántico.

## McEliece: tres décadas de robustez matemática

El algoritmo Classic McEliece fue propuesto originalmente por Robert McEliece en 1978 y se basa en la teoría de códigos correctores de errores, específicamente en el problema de decodificación síndrome, que permanece matemáticamente intratable incluso para ordenadores cuánticos. A diferencia de esquemas más modernos como Kyber o Dilithium (también avalados por NIST), McEliece ha sobrevivido más de 45 años sin ataques prácticos exitosos, lo que le confiere una confianza extraordinaria en comunidades de criptografía conservadora. Su inclusión en el estándar ISO 20691 marca el reconocimiento formal de esta solidez a nivel mundial.

## Incorporación en norma ISO 20691 y su alcance global

La certificación ISO otorga legitimidad regulatoria que trasciende fronteras nacionales. Organismos como NIST ya habían seleccionado McEliece como candidato finalista en su proceso de estandarización post-cuántica iniciado en 2016, pero la aprobación ISO agrega un nivel de aceptación que facilita la adopción en sectores altamente regulados: energía eléctrica, agua, petróleo y gas, transportes y manufactura crítica. En Latinoamérica, donde muchos operadores industriales sujetos a normativas de ciberseguridad OT (como IEC 62443) buscan conformidad con marcos internacionales, esta estandarización actúa como catalizador.

## Características técnicas y fortalezas operacionales

McEliece opera con tamaños de clave significativamente mayores que criptografía asimétrica clásica: típicamente entre 230 KB y varios megabytes para las claves públicas, lo que históricamente limitó su adopción en dispositivos de memoria constringida. Sin embargo, sus ventajas compensan este costo: resistencia demostrada contra ataques cuánticos, rapidez en operaciones de descifrado (beneficiosa para respuestas en tiempo real en plantas), y un margen de seguridad que crece a medida que se descubren nuevas capacidades cuánticas. Los operadores de infraestructuras críticas pueden confiar en que McEliece no será susceptible a demostraciones cuánticas que obliguen a cambios precipitados en años próximos.

## Implicaciones prácticas para plantas y sistemas OT en LatAm

La estandarización ISO abre la puerta a que proveedores de soluciones industriales—Siemens, Schneider Electric, ABB, Honeywell y proveedores locales—integren McEliece en VPNs industriales, certificados digitales para comunicación PLC-a-SCADA, y protección de firmwares críticos. En plantas de refinería, generación eléctrica y manufactura de precisión, donde compromisos criptográficos podrían significar sabotaje, la adopción de PQC deja de ser teórica. Organismos reguladores regionales ya comienzan a requerir hojas de ruta post-cuántica en auditorías de ciberseguridad OT. La norma ISO proporciona el fundamento técnico que inspecciones y certificadores necesitan para validar conformidad.

## Desafíos de transición y consideraciones prácticas

A pesar de la aprobación, la migración no es instantánea. Sistemas heredados en plantas latinoamericanas—algunos con PLCs que datan de los años 2000—requieren retrofits de firmware, sustitución de módulos de comunicación o incluso reemplazo de equipos. La interoperabilidad entre McEliece y esquemas clásicos durante el periodo transitorio demanda arquitecturas híbridas. Además, el entrenamiento de personal técnico en plantas y en centros de operación (SOC/NOC) para reconocer y responder a anomalías en sistemas criptográficos PQC es crítico. Consultores especializados aún son escasos en la región.

## Vigilancia regulatoria y próximos pasos

Otros candidatos post-cuánticos del proceso NIST—como Kyber (encriptación) y Dilithium/SPHINCS+ (firma digital)—probablemente alcanzarán estandares ISO en 2024-2025, creando un ecosistema diversificado. Operadores prudentes comenzarán evaluaciones piloto de McEliece en segmentos no críticos de sus redes OT ahora, acumulando datos de desempeño y familiaridad operacional. Asociaciones como la Industrial Internet Consortium (IIC) y cuerpos de normalización regionales (ICONTEC en Colombia, IRAM en Argentina) ya discuten guías de adopción. La ventana para prepararse es ahora; la estandarización ISO de McEliece es el pistoletazo de salida.

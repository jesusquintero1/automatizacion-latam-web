---
titulo: "Convertidores DC-DC aislados para aplicaciones SiC de alta tensión"
resumen: "Murata presenta convertidores DC-DC aislados de baja potencia para excitar compuertas de transistores SiC en sistemas de energía renovable, almacenamiento y carga de vehículos eléctricos. El nuevo diseño compacto integrado reduce complejidad en circuitos de control de potencia."
porQueImporta: "En Latinoamérica, la expansión de parques solares, sistemas de almacenamiento en baterías y puntos de carga rápida para EV demanda fuentes de alimentación compactas y confiables para controlar interruptores de potencia; estos convertidores aislados minimizan el tamaño de las tarjetas de control, reducen costos de ingeniería y mejoran la densidad de potencia en equipos que ya enfrentan restricciones térmicas en climas tropicales."
categoria: "PLC y Control"
imagen: "https://live.staticflickr.com/6019/6319427181_a6e9b79ece_b.jpg"
imagen_atribucion: "Foto: jurvetson · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Electronics Weekly"
  url: "https://www.electronicsweekly.com/news/products/isolated-dc-dc-converters-support-hv-sic-applications-2026-11/"
fecha: 2026-11-16T16:37:08Z
tags:
  - "gate-drive"
  - "sic"
  - "convertidor-dc-dc"
  - "potencia"
  - "aislamiento-galvanico"
---

## Contexto: electrónica de potencia en sistemas de energía variable

La transición energética en plantas industriales, microgrids y sistemas de distribución eléctrica requiere electrónica de potencia más sofisticada. Los transistores de carburo de silicio (SiC) han reemplazado a los MOSFET tradicionales en aplicaciones de media y alta tensión porque ofrecen menor resistencia, menor pérdida por conmutación y operación a frecuencias más altas. Sin embargo, controlar estos transistores SiC plantea un reto: requieren circuitos de excitación (gate drive) que aíslen galvánicamente el circuito de control de bajo voltaje del lado de alta tensión de potencia, evitando ruido electromagnético y garantizando seguridad del operario.

## El anuncio: serie MGJ2T2 de Murata para gate drive aislado

Murata, fabricante japonés especializada en componentes pasivos e integrados, presentó en Electronica 2026 la serie MGJ2T2, un convertidor DC-DC aislado de 2 W integrado en un encapsulado de circuito integrado sobre substrato (SiP, System-in-Package). Estos dispositivos funcionan como fuente de alimentación flotante para los circuitos que excitan las compuertas de los transistores SiC de potencia en convertidores para almacenamiento de energía, sistemas de distribución AC/DC de alta eficiencia y estaciones de carga rápida para vehículos eléctricos. La integración en SiP reduce el número de componentes externos necesarios comparado con soluciones discretas, bajando la complejidad del diseño de las tarjetas de control y el costo de ensamble.

## Cómo funcionan y por qué importa el aislamiento

Un gate driver aislado recibe una señal lógica de bajo voltaje (típicamente 3.3 V o 5 V) desde un controlador principal o FPGA, la aísla galvánicamente mediante un transformador integrado o fotoacoplador, y genera un voltaje flotante en el lado de alta tensión (comúnmente entre 12 V y 15 V) necesario para activar o desactivar el transistor SiC. En sistemas trifásicos o puentes de potencia, varios transistores SiC trabajan en diferentes potenciales; sin aislamiento, las corrientes de fuga y el acoplamiento capacitivo causarían disparos espurios o saturación de los circuitos de control. La solución integrada de Murata compacta esta función en un Solo encapsulado SiP, reduciendo la inductancia parasitaria y mejorando la inmunidad al ruido EMI, especialmente crítica en ambientes industriales ruidosos donde la radiación electromagnética de inductores de potencia de varios kilovatios puede degradar señales de control.

La densidad de potencia de 2 W en un pequeño footprint también es relevante para sistemas embebidos en equipos de distribución eléctrica o cargadores de EV, donde el espacio dentro de los armarios de control es limitado y el calor disipado debe minimizarse para evitar activación de sistemas de refrigeración costosos.

## Lectura para la industria latinoamericana

En Colombia, Perú y Chile, proyectos de energía solar distribuida a gran escala (granjas solares de 50-500 MW) están instalando inversores de potencia con transistores SiC para maximizar la captura de energía en climas con alta radiación. Argentina y Brasil avanzan en infraestructura de carga para vehículos eléctricos, donde estaciones de carga rápida de 350 kW requieren convertidores DC-DC de alta eficiencia para adaptar voltaje de baterías (400-900 V) a redes trifásicas. Los ingenieros encargados del diseño y mantenimiento de estos sistemas suelen comprar circuitos gate drive como componentes de terceros, importados de Asia con plazos largos y en valuta extranjera.

El convertidor MGJ2T2, si logra distribución en la región a través de distribuidores como Arrow, Tech Data o proveedores locales especializados en componentes de potencia, reduce la ingeniería personalizada. Las plantas que hoy diseñan sus propios gate drivers discretos (transformadores de ferrita, fotoacopladores, resistencias de terminación) pueden migrar a esta solución integrada, liberando recursos de ingeniería para otras áreas. Sin embargo, la curva de adopción será lenta: en México y América Central, donde la electrificación industrial aún usa convertidores más antiguos con IGBT, la demanda de SiC seguirá siendo nicho en los próximos 2-3 años. Especialistas en diseño de fuentes conmutadas que trabajen en startups de energía renovable o equipos OEM (como fabricantes de inversores) deberían evaluar esta serie contra competidores como Texas Instruments (ISO7x20M), ON Semiconductor (NCV7xxx) y Power Integrations (SCALE-iDriver) para validar que el aislamiento, la temperatura máxima de operación y el tiempo de respuesta cumplen especificaciones locales (a menudo más exigentes en climas tropicales con humedad y temperatura fluctuante).

## Vigilancia a futuro

La tendencia de integración SiP en componentes de potencia seguirá acelerándose; Murata y competidores lanzarán variantes de mayor potencia (5W, 10W) para aplicaciones de media tensión (1-10 kV). La normativa IEC 61131-2 y las guías de EMC industrial (IEC 61000-6-2) requerirán documentación más exhaustiva de inmunidad EMI para gate drivers; los ingenieros deben verificar certifications en sus adquisiciones. Además, la escasez y costo de componentes japoneses post-2024 podrían incentivarse soluciones alternativas de fabricantes chinos (Huawei, Goertek) o distribuidores locales que comiencen a stocking de estos dispositivos. Monitorear anuncios de Murata, TI y Power Integrations en conferencias regionales (como LatAm Industrial Show o Expo Energética) alertará sobre lanzamientos y disponibilidad regional.

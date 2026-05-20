---
titulo: "CrowdSec alerta sobre explotación creciente de routers industriales Four-Faith"
resumen: "Actores de amenaza explotan activamente una vulnerabilidad crítica de elusión de autenticación en routers celulares industriales Four-Faith F3x36. La actividad de botnet se expande hacia sectores críticos, alertan los investigadores de seguridad."
porQueImporta: "La explotación de routers industriales en entornos OT puede comprometer infraestructuras críticas en energía, agua y manufactura. En Latinoamérica, donde la modernización de plantas busca conectividad celular, estas vulnerabilidades representan un vector de ataque directo contra la disponibilidad operacional."
categoria: "Ciberseguridad OT"
imagen: "https://live.staticflickr.com/40/88652740_3c1c90bc85_b.jpg"
imagen_atribucion: "Foto: jessicafm · Openverse · CC BY 2.0"
imagen_fuente: "Openverse"
fuente:
  nombre: "Industrial Cyber"
  url: "https://industrialcyber.co/industrial-cyber-attacks/crowdsec-flags-rising-exploitation-of-four-faith-industrial-routers-as-botnet-activity-grows-across-critical-sectors/"
fecha: 2026-05-20T11:34:00Z
tags:
  - ciberseguridad-ot
  - four-faith
  - botnet
  - routers-industriales
  - vulnerabilidad-autenticacion
---

## El fallo de autenticación que expone la infraestructura industrial

Investigadores de CrowdSec han identificado una campaña activa de explotación dirigida a los routers celulares industriales Four-Faith serie F3x36, dispositivos ampliamente desplegados en plantas de manufactura, subestaciones eléctricas y sistemas de agua en todo el mundo. La vulnerabilidad central es un fallo de elusión de autenticación que permite a atacantes remotos obtener acceso administrativo sin credenciales válidas, convirtiendo estos equipos en puntos de entrada ideales para operaciones de botnet.

## Crecimiento de actividad botnet en sectores críticos

Según el reporte de CrowdSec, la explotación ha escalado significativamente en las últimas semanas, con múltiples actores de amenaza reclutando routers comprometidos para formar infraestructuras botnet distribuidas. Estos botnets OT no solo afectan a los routers mismos, sino que se utilizan como puentes para acceder a redes internas de control industrial conectadas a través de segmentación débil. Las campañas identificadas muestran patrones de escaneo automatizado y explotación masiva, indicando herramientas públicamente disponibles y coordinación entre múltiples equipos de atacantes.

La vulnerabilidad afecta principalmente a dispositivos Four-Faith F3x36 que carecen de parchado reciente. Estos routers, comúnmente utilizados para conectividad celular 4G/LTE en plantas remotas, soportan funciones SCADA y se integran con sistemas de control industrial heredados que frecuentemente no cuentan con defensas perimetrales robustas.

## Contexto técnico e impacto en OT

El fallo de autenticación permite a un atacante remoto sin credenciales acceder a la interfaz de administración web del router mediante solicitudes HTTP POST crafteadas. Una vez dentro, el atacante puede modificar configuraciones de firewall, redirigir tráfico, instalar backdoors persistentes o utilizar el dispositivo como nodo de comando y control. Para plantas que operan sistemas de control en tiempo real, una compromisos así puede facilitar ataques contra PLCs, HMIs y variadores conectados a la misma red.

En el contexto latinoamericano, muchas operaciones industriales en sectores como minería, energía renovable y manufactura han acelerado la adopción de routers celulares para monitoreo remoto y operaciones distribuidas, frecuentemente sin evaluación exhaustiva de riesgos de seguridad OT. Los parches de Four-Faith para este fallo han sido lentos en llegar a clientes, ampliando la ventana de exposición.

## Recomendaciones inmediatas

CrowdSec insta a operadores de plantas a inventariar todos los routers Four-Faith F3x36 en su infraestructura, verificar que ejecuten la versión firmware más reciente disponible, e implementar segmentación de red que aisle estos dispositivos de sistemas SCADA críticos. Además, monitoreo de comportamiento anómalo en tráfico de salida desde estos routers puede detectar actividad botnet antes de que se materialice un compromiso completo.

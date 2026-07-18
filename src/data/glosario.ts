// Glosario técnico OT/IT — contenido evergreen ORIGINAL (definiciones propias,
// verificables, no rewrites de feeds). Cada término es una página indexable que
// construye autoridad temática (topical authority) y enlaza al clúster. Baja
// competencia en español + alta intención = ganable para un sitio joven.
//
// Regla: definiciones curadas por un humano del dominio. NO auto-generar a escala
// (eso reintroduce el problema de contenido de poco valor). Calidad > cantidad.

export interface TerminoGlosario {
  /** slug URL-safe, en minúsculas y sin tildes */
  slug: string;
  /** nombre visible del término */
  termino: string;
  /** desarrollo de las siglas, si aplica */
  siglas?: string;
  /** categoría del sitio a la que pertenece (para enlazar al pillar) */
  categoria: string;
  /** frase corta para el listado y la meta description */
  resumen: string;
  /** definición completa (~120-200 palabras), en párrafos separados por \n\n */
  definicion: string;
  /** slugs de términos relacionados del propio glosario */
  relacionados: string[];
}

export const GLOSARIO: TerminoGlosario[] = [
  {
    slug: 'plc',
    termino: 'PLC',
    siglas: 'Programmable Logic Controller (Controlador Lógico Programable)',
    categoria: 'PLC y Control',
    resumen: 'Computadora industrial que lee sensores, ejecuta una lógica programada y acciona salidas.',
    definicion:
      'Un PLC (Controlador Lógico Programable) es una computadora industrial diseñada para automatizar máquinas y procesos. Lee el estado de sensores conectados a sus entradas, resuelve una lógica programada por un ingeniero y actualiza sus salidas hacia motores, válvulas y otros actuadores. Todo ello lo hace de forma cíclica y determinista, en el llamado ciclo de scan, que se repite miles de veces por segundo.\n\nA diferencia de una PC de oficina, el PLC está construido para soportar polvo, vibración, humedad y temperaturas extremas durante años sin fallar. Reemplazó a los antiguos tableros de relés cableados: cambiar el comportamiento de una máquina dejó de exigir recablear y pasó a ser cuestión de modificar un programa. Se programa según la norma IEC 61131-3, siendo LADDER el lenguaje más extendido. Es la pieza central de casi cualquier planta automatizada.',
    relacionados: ['scada', 'hmi', 'ladder', 'ciclo-de-scan', 'pac'],
  },
  {
    slug: 'scada',
    termino: 'SCADA',
    siglas: 'Supervisory Control And Data Acquisition',
    categoria: 'PLC y Control',
    resumen: 'Sistema de supervisión y adquisición de datos que monitorea y controla procesos a distancia.',
    definicion:
      'SCADA (Supervisión, Control y Adquisición de Datos) es un sistema de software y hardware que permite supervisar y controlar procesos industriales distribuidos geográficamente desde una sala de control central. Recoge datos en tiempo real de PLCs, RTUs y sensores repartidos por la planta o el territorio, los presenta en pantallas gráficas y permite al operador enviar órdenes de mando.\n\nUn SCADA típico incluye una interfaz de operador (HMI), una base de datos histórica para tendencias y reportes, un sistema de alarmas y comunicaciones con los dispositivos de campo mediante protocolos como Modbus, DNP3 o OPC UA. Se usa intensivamente en agua y saneamiento, energía eléctrica, petróleo y gas, y grandes plantas de manufactura. A diferencia de un DCS, el SCADA está pensado para procesos dispersos y con enlaces de comunicación de gran alcance, priorizando la supervisión sobre el control regulatorio de lazo cerrado.',
    relacionados: ['plc', 'hmi', 'rtu', 'dcs', 'opc-ua'],
  },
  {
    slug: 'hmi',
    termino: 'HMI',
    siglas: 'Human-Machine Interface (Interfaz Hombre-Máquina)',
    categoria: 'PLC y Control',
    resumen: 'La pantalla por la que un operador visualiza y opera una máquina o proceso.',
    definicion:
      'Una HMI (Interfaz Hombre-Máquina) es el punto de contacto por el cual una persona visualiza el estado de una máquina o proceso y actúa sobre él. En la práctica suele ser una pantalla táctil montada en el tablero de una máquina que muestra sinópticos, valores de proceso, alarmas y botones de mando.\n\nLa HMI se comunica con el PLC que gobierna la máquina y traduce datos crudos en información comprensible: gráficos de tendencia, indicadores de color, mensajes de alarma. Bien diseñada, reduce errores del operador y acelera el diagnóstico de fallas. No debe confundirse con un SCADA: la HMI suele ser local a una máquina o celda, mientras que el SCADA supervisa un proceso completo y distribuido. Hoy muchas HMI incorporan conectividad IIoT, permitiendo visualización remota desde navegador o móvil.',
    relacionados: ['plc', 'scada', 'setpoint'],
  },
  {
    slug: 'dcs',
    termino: 'DCS',
    siglas: 'Distributed Control System (Sistema de Control Distribuido)',
    categoria: 'PLC y Control',
    resumen: 'Sistema de control para plantas de proceso continuo, con controladores distribuidos y redundancia.',
    definicion:
      'Un DCS (Sistema de Control Distribuido) es una arquitectura de control diseñada para plantas de proceso continuo de gran escala: refinerías, petroquímicas, centrales eléctricas o plantas de papel. En vez de un controlador central único, distribuye la inteligencia en múltiples controladores repartidos por la planta, todos integrados bajo una misma plataforma de ingeniería y operación.\n\nEl DCS destaca por su control regulatorio de lazo cerrado (muchísimos lazos PID funcionando en paralelo), su alta redundancia (controladores, redes y fuentes duplicados para no detener el proceso ante una falla) y su integración nativa entre control, operación e histórico. Frente al SCADA, que supervisa procesos dispersos, el DCS gobierna un proceso concentrado y fuertemente acoplado donde la continuidad es crítica. La frontera entre DCS, SCADA y PLC se ha ido difuminando con los PAC y las plataformas modernas.',
    relacionados: ['scada', 'plc', 'pid', 'pac'],
  },
  {
    slug: 'pac',
    termino: 'PAC',
    siglas: 'Programmable Automation Controller',
    categoria: 'PLC y Control',
    resumen: 'Controlador que combina la robustez de un PLC con capacidades de PC y networking avanzado.',
    definicion:
      'Un PAC (Controlador de Automatización Programable) es la evolución del PLC hacia mayores prestaciones. Mantiene la robustez industrial y el determinismo de un PLC, pero añade más memoria y potencia de cálculo, capacidad para manejar lógica compleja, matemática avanzada y control de movimiento, y una conectividad de red mucho más rica.\n\nEl término surgió para describir controladores que difuminan la frontera entre el PLC clásico y la PC industrial: soportan múltiples lenguajes IEC 61131-3, bases de datos, comunicaciones con sistemas IT y protocolos como OPC UA de forma nativa. En la práctica, la distinción comercial entre "PLC de gama alta" y "PAC" es difusa. Se eligen para aplicaciones que exigen integrar control, adquisición de datos y comunicación con niveles superiores (MES/ERP) en un solo dispositivo.',
    relacionados: ['plc', 'dcs', 'opc-ua', 'mes'],
  },
  {
    slug: 'rtu',
    termino: 'RTU',
    siglas: 'Remote Terminal Unit (Unidad Terminal Remota)',
    categoria: 'PLC y Control',
    resumen: 'Dispositivo de campo que adquiere datos y ejecuta control en sitios remotos para un SCADA.',
    definicion:
      'Una RTU (Unidad Terminal Remota) es un dispositivo electrónico de campo que actúa como los "ojos y manos" de un sistema SCADA en ubicaciones remotas. Adquiere señales de sensores e instrumentos, ejecuta lógica de control local y transmite los datos al centro de supervisión mediante enlaces de comunicación que pueden ser radio, celular, satélite o fibra.\n\nLas RTU se usan donde el proceso está muy disperso: estaciones de bombeo de agua, pozos petroleros, subestaciones eléctricas, gasoductos. Están diseñadas para operar de forma autónoma en sitios sin personal, con amplios rangos de temperatura, bajo consumo y a menudo alimentación solar. Se diferencian del PLC en que priorizan la comunicación robusta a larga distancia y la operación remota; modernos protocolos como DNP3 y Modbus son habituales. La frontera entre RTU y PLC también se ha difuminado con equipos híbridos.',
    relacionados: ['scada', 'plc', 'modbus'],
  },
  {
    slug: 'ladder',
    termino: 'LADDER',
    siglas: 'Ladder Diagram / Diagrama de Escalera (LD)',
    categoria: 'PLC y Control',
    resumen: 'El lenguaje de programación de PLC más usado, basado en la lógica de relés.',
    definicion:
      'LADDER, o diagrama de escalera, es el lenguaje de programación de PLC más extendido y uno de los cinco que define la norma IEC 61131-3. Su nombre viene de su aspecto: dos rieles verticales de alimentación y "peldaños" horizontales donde se dibuja la lógica, imitando los antiguos esquemas de control con relés.\n\nCada peldaño se lee de izquierda a derecha: a la izquierda se colocan las condiciones (contactos, que representan entradas o marcas internas) y a la derecha el resultado (bobinas, que representan salidas). Si existe un camino de continuidad lógica a través de los contactos, la bobina se activa. Su gran ventaja es la intuición para quien viene de la electricidad, y su facilidad para diagnosticar en línea viendo qué contactos conducen. Es ideal para lógica booleana y secuencial; para cálculo intensivo se complementa con Texto Estructurado.',
    relacionados: ['plc', 'grafcet', 'ciclo-de-scan'],
  },
  {
    slug: 'grafcet',
    termino: 'Grafcet / SFC',
    siglas: 'Sequential Function Chart (Gráfico de Función Secuencial)',
    categoria: 'PLC y Control',
    resumen: 'Lenguaje gráfico para describir procesos secuenciales como una sucesión de etapas y transiciones.',
    definicion:
      'El Grafcet (en la norma IEC 61131-3 recogido como SFC, Sequential Function Chart) es un lenguaje gráfico para modelar la parte secuencial de un automatismo. Describe el proceso como una sucesión de etapas (estados) unidas por transiciones (condiciones que deben cumplirse para avanzar de una etapa a la siguiente).\n\nCada etapa activa unas acciones mientras está activa; cuando la condición de transición se cumple, el sistema desactiva la etapa actual y activa la siguiente. Este enfoque hace muy claro y mantenible el control de procesos por pasos: llenar-mezclar-vaciar un tanque, secuencias de arranque de motores, ciclos de máquina. Grafcet permite representar también divergencias y convergencias (procesos que se ramifican en paralelo o eligen caminos). Aunque nació como herramienta de análisis, hoy muchos entornos lo ejecutan directamente; cuando no, se traduce fácilmente a LADDER con un patrón SET/RESET por etapa.',
    relacionados: ['ladder', 'plc'],
  },
  {
    slug: 'ciclo-de-scan',
    termino: 'Ciclo de scan',
    categoria: 'PLC y Control',
    resumen: 'El ciclo repetitivo con que un PLC lee entradas, ejecuta el programa y escribe salidas.',
    definicion:
      'El ciclo de scan (o ciclo de barrido) es la forma en que un PLC ejecuta su programa: no lo resuelve una sola vez, sino de manera cíclica y continua, repitiéndose típicamente en milisegundos. Cada ciclo consta de tres fases principales.\n\nPrimero, la lectura de entradas: el PLC toma una "foto" del estado de todos sus sensores y la guarda en una imagen de memoria. Segundo, la ejecución del programa: resuelve toda la lógica usando esa imagen congelada, no el valor instantáneo de las entradas. Tercero, la escritura de salidas: actualiza físicamente motores, válvulas y luces según el resultado. Luego atiende tareas internas (diagnósticos, comunicaciones) y vuelve a empezar. El tiempo que tarda una vuelta completa es el tiempo de scan. Entender este mecanismo es clave: explica por qué una entrada que cambia a mitad de ciclo no se "ve" hasta el siguiente barrido, y por qué el control es determinista.',
    relacionados: ['plc', 'ladder', 'watchdog'],
  },
  {
    slug: 'watchdog',
    termino: 'Watchdog',
    categoria: 'PLC y Control',
    resumen: 'Temporizador de seguridad que detecta si el PLC se quedó colgado y fuerza una acción segura.',
    definicion:
      'El watchdog (perro guardián) es un temporizador de seguridad que vigila que el programa del PLC siga ejecutándose con normalidad. Funciona con una premisa simple: el sistema debe "reiniciar" periódicamente el temporizador dentro de cada ciclo de scan. Si por alguna falla el programa se cuelga o el tiempo de scan se dispara por encima de un límite, el watchdog no se reinicia a tiempo, expira y dispara una acción de protección.\n\nEsa acción suele ser poner el PLC en estado seguro, desactivar salidas y señalar la falla. Sin un watchdog, un PLC colgado podría dejar salidas energizadas de forma peligrosa sin que nadie lo note hasta que "no anda la línea". Es un mecanismo básico de seguridad y disponibilidad; muchos CPU lo traen integrado a nivel de firmware, y en aplicaciones críticas se refuerza con watchdogs externos por hardware.',
    relacionados: ['ciclo-de-scan', 'plc'],
  },
  {
    slug: 'setpoint',
    termino: 'Setpoint',
    siglas: 'SP — valor de consigna',
    categoria: 'PLC y Control',
    resumen: 'El valor deseado de una variable de proceso que el sistema de control intenta alcanzar y mantener.',
    definicion:
      'El setpoint (valor de consigna, SP) es el valor objetivo que se le fija a una variable de proceso: la temperatura que queremos en un horno, la presión en una línea, el nivel en un tanque o la velocidad de un motor. El sistema de control tiene como misión llevar la variable real (la variable de proceso, PV) hasta ese setpoint y mantenerla ahí pese a las perturbaciones.\n\nLa diferencia entre el setpoint y la variable de proceso es el error, y sobre ese error trabaja el controlador (por ejemplo un lazo PID) para decidir cuánto actuar. El setpoint puede ser fijo, ajustado por el operador desde una HMI, o variar en el tiempo siguiendo una receta o rampa. Es un concepto central de todo control automático: sin un valor deseado claro, no hay nada que regular.',
    relacionados: ['pid', 'hmi', 'vfd'],
  },
  {
    slug: 'pid',
    termino: 'Control PID',
    siglas: 'Proporcional-Integral-Derivativo',
    categoria: 'PLC y Control',
    resumen: 'El algoritmo de control de lazo cerrado más usado en la industria.',
    definicion:
      'El control PID (Proporcional-Integral-Derivativo) es el algoritmo de control de lazo cerrado más utilizado en la industria. Su trabajo es llevar una variable de proceso (temperatura, presión, caudal, velocidad) hasta un setpoint y mantenerla ahí, calculando continuamente la señal de salida a partir del error (la diferencia entre lo deseado y lo medido).\n\nCombina tres acciones. La proporcional reacciona en magnitud al error actual: cuanto mayor el error, mayor la corrección. La integral acumula el error pasado para eliminar la desviación permanente y llevar la variable exactamente al setpoint. La derivativa anticipa la tendencia del error para amortiguar oscilaciones y sobrepasos. Ajustar sus tres ganancias (sintonía) es un arte práctico: mal sintonizado, el lazo oscila o responde lento. Se implementa en PLCs, PACs y DCS, y gobierna desde un termostato hasta el control de una turbina.',
    relacionados: ['setpoint', 'dcs', 'vfd'],
  },
  {
    slug: 'vfd',
    termino: 'Variador de frecuencia (VFD)',
    siglas: 'Variable Frequency Drive',
    categoria: 'Energía y Sostenibilidad',
    resumen: 'Dispositivo que regula la velocidad de un motor eléctrico variando la frecuencia de alimentación.',
    definicion:
      'Un variador de frecuencia (VFD, del inglés Variable Frequency Drive) es un equipo de electrónica de potencia que controla la velocidad y el par de un motor de inducción trifásico variando la frecuencia y la tensión que le suministra. Como la velocidad de estos motores es proporcional a la frecuencia de la red, cambiar la frecuencia permite ajustar las revoluciones de forma continua.\n\nSus beneficios son grandes: arranques suaves que evitan picos de corriente y esfuerzos mecánicos, control preciso de velocidad para el proceso y, sobre todo, ahorro de energía notable en bombas y ventiladores, donde reducir un poco la velocidad reduce mucho el consumo. Internamente rectifica la corriente alterna a continua y luego la reconstruye a la frecuencia deseada mediante modulación PWM. Se comanda desde un PLC por señal analógica o por bus de campo, y es una pieza clave de la eficiencia energética industrial.',
    relacionados: ['setpoint', 'pid', 'encoder'],
  },
  {
    slug: 'encoder',
    termino: 'Encoder',
    categoria: 'Robótica',
    resumen: 'Sensor que convierte posición o velocidad de un eje en una señal eléctrica para el control.',
    definicion:
      'Un encoder es un sensor que traduce la posición angular o lineal (y, por derivación, la velocidad) de un elemento mecánico en una señal eléctrica que el sistema de control puede leer. Es el órgano de realimentación imprescindible del control de movimiento: sin saber dónde está el eje, no se puede posicionar con precisión.\n\nHay dos grandes familias. El encoder incremental entrega pulsos a medida que el eje gira; contándolos se conoce el desplazamiento, pero se pierde la referencia si se corta la alimentación (necesita un "homing"). El encoder absoluto entrega en todo momento un código único por posición, de modo que conoce su ubicación exacta incluso tras un apagón. Se usan en servomotores, robots, máquinas CNC y cualquier aplicación que requiera posicionamiento fino. Su resolución (pulsos por vuelta o bits) determina la precisión alcanzable.',
    relacionados: ['servo', 'vfd', 'cobot'],
  },
  {
    slug: 'servo',
    termino: 'Servomotor',
    categoria: 'Robótica',
    resumen: 'Motor con realimentación que permite control preciso de posición, velocidad y par.',
    definicion:
      'Un servomotor es un motor diseñado para el control preciso de posición, velocidad y par, gracias a un lazo de realimentación cerrado. A diferencia de un motor común que solo gira, el servo forma un sistema (motor + encoder + servodrive) capaz de moverse a una posición exacta y mantenerla contra perturbaciones.\n\nEl servodrive compara continuamente la posición deseada con la que reporta el encoder y corrige en tiempo real, con gran dinámica y exactitud. Esto los hace ideales para robótica, máquinas de empaque, corte a medida, CNC y cualquier tarea de movimiento coordinado y rápido. Frente a un motor con variador de frecuencia, el servo ofrece mucha mayor precisión y respuesta, a mayor costo. El control de movimiento moderno coordina múltiples ejes servo mediante buses deterministas como EtherCAT para lograr trayectorias complejas y sincronizadas.',
    relacionados: ['encoder', 'vfd', 'cobot'],
  },
  {
    slug: 'cobot',
    termino: 'Cobot',
    siglas: 'Collaborative Robot (Robot Colaborativo)',
    categoria: 'Robótica',
    resumen: 'Robot diseñado para trabajar de forma segura junto a personas, sin jaulas.',
    definicion:
      'Un cobot (robot colaborativo) es un robot industrial concebido para compartir espacio de trabajo con personas de forma segura, sin las jaulas y barreras que aíslan a los robots tradicionales. Logra esa seguridad mediante sensores de fuerza y par, límites de velocidad y potencia, y bordes redondeados: si detecta un contacto anómalo, se detiene de inmediato.\n\nSu otra gran característica es la facilidad de uso. Muchos cobots se programan "enseñándoles" el movimiento a mano (guiado manual) o con interfaces gráficas sencillas, lo que baja la barrera de entrada para pymes sin equipo de robótica. Se usan en tareas repetitivas de carga y descarga, ensamblaje, atornillado, paletizado ligero e inspección. No sustituyen a los robots de alta velocidad y carga, pero abren la automatización flexible a aplicaciones y empresas que antes no podían justificarla. Su despliegue seguro se rige por la norma ISO/TS 15066.',
    relacionados: ['servo', 'encoder', 'agv'],
  },
  {
    slug: 'agv',
    termino: 'AGV / AMR',
    siglas: 'Automated Guided Vehicle / Autonomous Mobile Robot',
    categoria: 'Robótica',
    resumen: 'Vehículos que transportan materiales por la planta de forma automática o autónoma.',
    definicion:
      'Los AGV (Vehículos de Guiado Automático) y los AMR (Robots Móviles Autónomos) automatizan el transporte interno de materiales en fábricas y centros logísticos. La diferencia está en cómo navegan. El AGV sigue una ruta fija predefinida: una banda magnética, un cable enterrado, marcas o reflectores; es fiable pero rígido, y cambiar su recorrido exige reconfigurar la infraestructura.\n\nEl AMR, en cambio, navega de forma autónoma: construye un mapa del entorno con láser y cámaras (SLAM), planifica su ruta y esquiva obstáculos y personas dinámicamente, sin infraestructura fija. Eso lo hace mucho más flexible y rápido de desplegar. Ambos descargan a los operarios de mover carros y tarimas, reducen errores y funcionan de forma continua. Se integran con el SCADA/MES y los sistemas de gestión de flota para coordinar decenas de unidades. Son piezas centrales de la intralogística 4.0.',
    relacionados: ['cobot', 'iiot', 'mes'],
  },
  {
    slug: 'iiot',
    termino: 'IIoT',
    siglas: 'Industrial Internet of Things (Internet Industrial de las Cosas)',
    categoria: 'Industria 4.0',
    resumen: 'La aplicación del IoT a la industria: conectar máquinas y sensores para obtener datos y valor.',
    definicion:
      'El IIoT (Internet Industrial de las Cosas) es la aplicación de las tecnologías de Internet de las Cosas al entorno industrial: conectar máquinas, sensores, PLCs e instrumentos a redes para recolectar datos, analizarlos y convertirlos en decisiones. Es uno de los pilares de la Industria 4.0.\n\nA diferencia del IoT de consumo, el IIoT opera bajo exigencias de fiabilidad, seguridad y latencia mucho más estrictas: una falla puede detener una línea o poner en riesgo a personas. Sus casos de uso típicos incluyen el mantenimiento predictivo (anticipar averías midiendo vibración, temperatura o consumo), la monitorización de eficiencia (OEE), la trazabilidad y la optimización energética. Tecnológicamente se apoya en protocolos como MQTT y OPC UA, en pasarelas (gateways) que conectan el mundo OT con la nube, y cada vez más en el edge computing para procesar datos cerca de la máquina. Su valor no está en conectar por conectar, sino en el análisis que habilita.',
    relacionados: ['digital-twin', 'edge-computing', 'opc-ua', 'ot-it'],
  },
  {
    slug: 'digital-twin',
    termino: 'Gemelo digital',
    siglas: 'Digital Twin',
    categoria: 'Industria 4.0',
    resumen: 'Réplica virtual de un activo o proceso real, alimentada con sus datos en tiempo real.',
    definicion:
      'Un gemelo digital (digital twin) es una réplica virtual de un activo, proceso o sistema físico, que se mantiene sincronizada con su contraparte real mediante datos en tiempo real. No es solo un modelo 3D: es un modelo vivo que refleja el estado, comportamiento y condiciones actuales del objeto real.\n\nAl recibir continuamente datos de sensores del activo físico, el gemelo permite simular escenarios, predecir comportamientos y optimizar sin tocar la máquina real. Sus usos van desde ensayar cambios de proceso antes de aplicarlos, hasta el mantenimiento predictivo, la formación de operadores o la puesta en marcha virtual de una línea antes de construirla. Existen gemelos de una pieza, de una máquina, de una línea o de una planta entera. Su valor crece con la calidad y frescura de los datos que lo alimentan; es una de las tecnologías estrella de la Industria 4.0 y depende directamente de una buena base IIoT.',
    relacionados: ['iiot', 'edge-computing', 'mes'],
  },
  {
    slug: 'edge-computing',
    termino: 'Edge computing',
    categoria: 'Industria 4.0',
    resumen: 'Procesar los datos cerca de donde se generan, en la máquina, en vez de enviarlos todos a la nube.',
    definicion:
      'El edge computing (computación en el borde) consiste en procesar los datos cerca de donde se generan —en la propia máquina, en una pasarela o en un servidor local de planta— en lugar de enviarlos todos a un centro de datos o a la nube. En el contexto industrial, el "borde" es el piso de planta.\n\nSu razón de ser es práctica. Muchas decisiones industriales necesitan latencia muy baja (milisegundos) que un viaje de ida y vuelta a la nube no puede garantizar. Además, procesar localmente reduce el ancho de banda necesario, permite seguir operando aunque se caiga la conexión, y mantiene datos sensibles dentro de la planta por seguridad. El edge no sustituye a la nube: la complementa. Un patrón típico filtra y analiza en el borde en tiempo real, y envía a la nube solo los datos relevantes o agregados para análisis histórico y de flota. Es habilitador clave del IIoT y del control con IA.',
    relacionados: ['iiot', 'digital-twin', 'ot-it'],
  },
  {
    slug: 'mes',
    termino: 'MES',
    siglas: 'Manufacturing Execution System (Sistema de Ejecución de Manufactura)',
    categoria: 'Industria 4.0',
    resumen: 'El software que conecta el piso de planta (OT) con la gestión del negocio (ERP).',
    definicion:
      'Un MES (Sistema de Ejecución de Manufactura) es el software que gestiona y controla la producción en el piso de planta, actuando como puente entre el nivel de control (PLCs, SCADA) y el nivel de gestión del negocio (ERP). Traduce las órdenes de producción del ERP en instrucciones ejecutables y devuelve datos reales de lo que ocurre en la fábrica.\n\nEntre sus funciones están el seguimiento de órdenes y lotes en tiempo real, la trazabilidad completa (qué materiales y parámetros entraron en cada producto), la gestión de la calidad, el cálculo de indicadores como el OEE, y la coordinación de recursos y personal. En el modelo de la pirámide de automatización (norma ISA-95) el MES ocupa el nivel intermedio, esencial para la Industria 4.0 porque digitaliza y da visibilidad a la ejecución. Sin MES, existe una brecha ciega entre lo que el negocio planifica y lo que la planta realmente hace.',
    relacionados: ['scada', 'ot-it', 'iiot', 'pac'],
  },
  {
    slug: 'ot-it',
    termino: 'Convergencia OT/IT',
    siglas: 'Operational Technology / Information Technology',
    categoria: 'Ciberseguridad OT',
    resumen: 'La integración entre las tecnologías del piso de planta (OT) y las de información (IT).',
    definicion:
      'La convergencia OT/IT es la integración creciente entre dos mundos que tradicionalmente vivían separados. La OT (Tecnología Operacional) es todo lo que controla el proceso físico: PLCs, SCADA, sensores, actuadores; prioriza disponibilidad y seguridad física, con ciclos de vida de décadas. La IT (Tecnología de la Información) es el mundo de servidores, redes corporativas y software de gestión; prioriza la confidencialidad de los datos y se renueva en pocos años.\n\nLa Industria 4.0 exige que ambos conversen: los datos de planta (OT) deben llegar a los sistemas de análisis y negocio (IT) para crear valor. Esa unión trae enormes beneficios, pero también riesgos: conectar equipos OT antes aislados los expone a ciberamenazas de IT, con la diferencia de que aquí un ataque puede detener una planta o causar daños físicos. Gestionar esa convergencia con arquitecturas seguras (segmentación, zonas y conductos según IEC 62443) es hoy una prioridad de la ciberseguridad industrial.',
    relacionados: ['iiot', 'mes', 'opc-ua', 'edge-computing'],
  },
  {
    slug: 'opc-ua',
    termino: 'OPC UA',
    siglas: 'OPC Unified Architecture',
    categoria: 'Industria 4.0',
    resumen: 'Estándar de comunicación industrial abierto e interoperable, seguro y multiplataforma.',
    definicion:
      'OPC UA (OPC Unified Architecture) es un estándar abierto de comunicación e interoperabilidad para la industria, mantenido por la OPC Foundation. Nació para superar las limitaciones del antiguo OPC clásico (atado a Windows) y se ha convertido en una de las columnas vertebrales de la Industria 4.0 y de la convergencia OT/IT.\n\nSus virtudes clave: es independiente de plataforma y fabricante (corre en cualquier sistema operativo y en dispositivos desde un sensor hasta la nube), incorpora seguridad de serie (cifrado, autenticación e integridad), y no solo transporta datos sino también su significado, mediante un modelo de información que describe qué representa cada dato. Esto permite que equipos de distintas marcas se entiendan sin traductores a medida. Se usa para conectar PLCs, SCADA, MES y sistemas en la nube. Su perfil PubSub, sobre MQTT o UDP, lo hace apto también para escenarios IIoT de muchos dispositivos.',
    relacionados: ['modbus', 'iiot', 'ot-it', 'mes'],
  },
  {
    slug: 'modbus',
    termino: 'Modbus',
    categoria: 'PLC y Control',
    resumen: 'Protocolo de comunicación industrial veterano, simple y omnipresente.',
    definicion:
      'Modbus es un protocolo de comunicación industrial creado en 1979 que, por su simplicidad y apertura, sigue siendo uno de los más usados del mundo. Funciona bajo un modelo maestro-esclavo (hoy llamado cliente-servidor): un dispositivo maestro consulta a los esclavos, que responden con sus datos.\n\nExisten dos variantes principales. Modbus RTU opera sobre líneas serie RS-485, muy común en instrumentos, variadores y sensores por su robustez y bajo costo. Modbus TCP encapsula el mismo protocolo sobre redes Ethernet, integrándolo en infraestructuras modernas. Su gran ventaja es la universalidad: casi cualquier equipo industrial "habla" Modbus, lo que lo hace la lingua franca para integrar dispositivos de distintos fabricantes. Su desventaja es que es un protocolo antiguo, sin seguridad nativa y con un modelo de datos plano (registros numéricos sin semántica), razón por la que en aplicaciones nuevas convive con o cede terreno a OPC UA y protocolos de tiempo real como PROFINET o EtherCAT.',
    relacionados: ['opc-ua', 'rtu', 'plc'],
  },
  {
    slug: 'poka-yoke',
    termino: 'Poka-yoke',
    categoria: 'Casos de Estudio',
    resumen: 'Mecanismo a prueba de errores que impide o hace evidente una equivocación en el proceso.',
    definicion:
      'Poka-yoke es un término japonés (de la filosofía Lean/Toyota) que designa cualquier mecanismo a prueba de errores: un dispositivo o diseño que impide que se cometa una equivocación, o que la hace inmediatamente evidente si ocurre. La idea es no depender de la atención humana perfecta, sino diseñar el proceso para que el error sea imposible o salte a la vista.\n\nLos ejemplos abundan dentro y fuera de la industria: un conector USB que solo entra en una orientación, una pieza con un pin que impide montarla al revés, un sensor que detiene la máquina si falta un componente, o un contador que no deja avanzar hasta colocar todos los tornillos. En automatización, los poka-yoke se implementan a menudo con sensores y lógica de PLC que verifican condiciones antes de permitir el siguiente paso. Bien aplicados, reducen drásticamente los defectos, el retrabajo y los accidentes, con inversiones normalmente pequeñas. Son un pilar de la calidad y la mejora continua.',
    relacionados: ['plc', 'mes'],
  },
];

export const GLOSARIO_POR_SLUG: Record<string, TerminoGlosario> = Object.fromEntries(
  GLOSARIO.map((t) => [t.slug, t]),
);

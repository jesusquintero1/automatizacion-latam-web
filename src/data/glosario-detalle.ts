// Ampliación de las fichas del glosario: uso práctico, errores frecuentes y
// preguntas. Vive aparte de `glosario.ts` para no tocar las definiciones ya
// publicadas y para que el diff de cada ampliación sea legible.
//
// POR QUÉ EXISTE: las 25 fichas rondaban las 200 palabras. Son páginas
// indexables, y 25 páginas de 200 palabras son exactamente el "contenido de
// poco valor" que arrastra al resto del sitio. Con estas tres secciones cada
// ficha pasa de ~210 a ~650 palabras SIN relleno: lo que se añade es lo que un
// técnico busca de verdad (cómo se usa, en qué se equivoca la gente, qué se
// pregunta), que además es donde vive el tráfico long-tail.
//
// REGLA: escrito a mano, verificable, con cifras y modelos concretos. Si una
// sección no aporta nada real, se deja fuera: es preferible una ficha de 400
// palabras honestas que una de 700 rellenas.

export interface DetalleTermino {
  /** Cómo se usa en planta. Párrafos separados por \n\n */
  enLaPractica: string;
  /** Errores frecuentes: el titulo es el error, el detalle explica y corrige */
  errores: { titulo: string; detalle: string }[];
  /** Preguntas frecuentes reales (alimentan el JSON-LD FAQPage) */
  faq: { q: string; a: string }[];
}

export const DETALLE_GLOSARIO: Record<string, DetalleTermino> = {
  plc: {
    enLaPractica:
      'En una planta real el PLC rara vez trabaja solo: se elige por número de entradas y salidas, por el tipo de señal que debe leer y por el bus de campo al que se conectará. Un Siemens LOGO! o un Zelio Logic de Schneider resuelven una bomba con boya y un par de contactores; un S7-1200 o un CompactLogix aparecen cuando hay decenas de señales, comunicación con una HMI y receta de producto. La regla práctica: contar entradas y salidas reales, sumar un 20-30 % de reserva para futuras modificaciones y verificar que el modelo soporte los módulos analógicos que el proceso pedirá después.\n\nEl trabajo diario no es programar, es diagnosticar. Un técnico pasa más horas leyendo el estado de las entradas en línea que escribiendo lógica nueva: si una electroválvula no acciona, la secuencia es mirar si el PLC está viendo la entrada de permiso, si la bobina de salida está energizada en el programa y si la salida física tiene tensión. Ese orden — programa primero, campo después — ahorra la mayoría de las horas perdidas.',
    errores: [
      {
        titulo: 'Confundir el fallo del programa con el fallo del campo',
        detalle:
          'Antes de tocar una línea de código conviene forzar la salida desde el software. Si el actuador se mueve, el problema está en la lógica o en un permiso; si no se mueve, está en el cableado, en el relé o en el propio actuador. Invertir ese orden hace perder horas modificando lógica que estaba bien.',
      },
      {
        titulo: 'Dimensionar el PLC justo, sin reserva de E/S',
        detalle:
          'Una planta cambia. Elegir un controlador con exactamente las entradas y salidas del día uno obliga a añadir módulos de expansión —o a cambiar el equipo— en la primera modificación. Un 20-30 % de reserva cuesta poco al comprar y evita un rediseño completo más adelante.',
      },
      {
        titulo: 'Programar sin condiciones de arranque seguras',
        detalle:
          'Tras un corte de energía el PLC vuelve a arrancar. Si la lógica no define en qué estado deben quedar los actuadores, la máquina puede reanudar un movimiento a medias con un operario dentro. El estado de arranque y el rearme manual tras emergencia se diseñan antes de escribir la secuencia, no después.',
      },
    ],
    faq: [
      {
        q: '¿Cuántas entradas y salidas necesito en mi PLC?',
        a: 'Cuenta las señales reales del proceso —cada sensor es una entrada, cada actuador una salida— y añade entre un 20 % y un 30 % de reserva. Las modificaciones posteriores casi siempre suman señales, y ampliar con módulos cuesta más que haber comprado con margen.',
      },
      {
        q: '¿Un PLC puede reemplazarse por un Arduino o una Raspberry Pi?',
        a: 'Para un prototipo o un proyecto educativo, sí. Para producción, no: el PLC está certificado para operar años con vibración, ruido eléctrico y temperaturas extremas, tiene entradas protegidas contra sobretensión y un ciclo determinista. Un microcontrolador de hobby no ofrece ninguna de esas garantías ni cobertura ante una auditoría de seguridad.',
      },
      {
        q: '¿Qué pasa con el programa si el PLC se queda sin energía?',
        a: 'El programa permanece: se guarda en memoria no volátil. Lo que se pierde son los valores de las variables que no estén declaradas como retentivas, incluidos contadores y acumulados de producción. Si un dato debe sobrevivir a un corte, hay que marcarlo explícitamente como retentivo.',
      },
    ],
  },

  scada: {
    enLaPractica:
      'Un SCADA se justifica cuando hay que ver, registrar y explicar lo que pasa en varios equipos a la vez. Una sola máquina se supervisa con su HMI local; un acueducto con seis estaciones de bombeo repartidas en veinte kilómetros necesita un SCADA que concentre estados, alarmas y tendencias en un único puesto. Ese es el criterio real de decisión: no el tamaño de la planta, sino cuántos puntos hay que mirar simultáneamente y si alguien tendrá que rendir cuentas del histórico.\n\nEl valor del SCADA aparece después del incidente, no durante. Cuando un lote sale fuera de especificación, el historiador permite reconstruir qué temperatura hubo a las 3:14 de la madrugada y qué operario reconoció qué alarma. Por eso el diseño de las tendencias y del registro de eventos merece tanto cuidado como las pantallas: una planta con pantallas bonitas y sin histórico utilizable resuelve la operación diaria pero no responde ninguna pregunta seria.',
    errores: [
      {
        titulo: 'Convertir el SCADA en un árbol de Navidad de alarmas',
        detalle:
          'Cuando todo es alarma, nada es alarma. Un operador que recibe doscientas notificaciones por turno deja de leerlas y silencia el sistema entero. Las guías de gestión de alarmas (ISA-18.2) sugieren priorizar y limitar: una alarma debe exigir una acción concreta del operador, o no debería ser alarma sino evento registrado.',
      },
      {
        titulo: 'Confundir SCADA con control',
        detalle:
          'El SCADA supervisa; el control vive en el PLC o el RTU. Si la lógica crítica se implementa en el servidor SCADA, una caída de red o un reinicio de Windows deja el proceso sin control. La secuencia siempre se programa abajo, en el controlador; arriba solo se observa y se ajustan consignas.',
      },
      {
        titulo: 'Dejar el histórico sin dimensionar',
        detalle:
          'Registrar miles de variables cada segundo llena el disco en semanas y ralentiza las consultas. Conviene definir por variable cada cuánto se guarda y cuánto tiempo se conserva; la mayoría de señales admiten registro por excepción (solo cuando cambian más de una banda muerta) sin perder información útil.',
      },
    ],
    faq: [
      {
        q: '¿Cuál es la diferencia entre SCADA y HMI?',
        a: 'La HMI es la interfaz local de una máquina: una pantalla junto al equipo para que el operador lo maneje. El SCADA es un sistema de supervisión que concentra datos de muchos controladores, normalmente distribuidos, y añade histórico, gestión de alarmas y generación de reportes.',
      },
      {
        q: '¿Necesito un SCADA si solo tengo una máquina?',
        a: 'Normalmente no. Con una máquina, la HMI local cubre operación y diagnóstico. El SCADA empieza a compensar cuando hay varios equipos que supervisar a la vez, ubicaciones remotas, o una exigencia de trazabilidad histórica que la HMI no puede almacenar.',
      },
      {
        q: '¿Qué pasa si el servidor SCADA se cae?',
        a: 'Si el sistema está bien diseñado, el proceso sigue funcionando: los PLC y RTU mantienen el control de forma autónoma. Se pierde la visibilidad, el registro histórico y la posibilidad de ajustar consignas de forma remota, pero no el control. Si al caer el SCADA se detiene el proceso, hay lógica crítica mal ubicada.',
      },
    ],
  },

  hmi: {
    enLaPractica:
      'Diseñar una HMI es sobre todo decidir qué no mostrar. La tentación habitual es reproducir el P&ID completo con todos los valores en pantalla; el resultado es un tablero donde el operador no distingue lo normal de lo anómalo. Las guías de alto rendimiento (High Performance HMI) recomiendan lo contrario: fondo gris neutro, valores en gris oscuro, y el color reservado exclusivamente para lo que exige atención. Una pantalla bien hecha se lee en dos segundos desde tres metros.\n\nLa jerarquía habitual son cuatro niveles: una vista general de planta, una por área, una por equipo y una de diagnóstico. El operador vive en el segundo nivel y baja solo cuando algo falla. En instalaciones pequeñas los dos niveles intermedios se funden, pero conviene mantener separada la pantalla de diagnóstico: es la que usará el técnico de mantenimiento a las tres de la mañana, y sus necesidades no son las del operador de turno.',
    errores: [
      {
        titulo: 'Usar el rojo y el verde como colores decorativos',
        detalle:
          'Si las tuberías en servicio ya son verdes, el verde deja de significar "correcto" y el operador pierde la referencia. El color debe reservarse para el estado anómalo. Añade que entre un 5 % y un 8 % de los hombres tiene algún grado de daltonismo rojo-verde: el estado nunca debe comunicarse solo por color, sino también por forma, texto o posición.',
      },
      {
        titulo: 'Pantallas que exigen buena vista y precisión de ratón',
        detalle:
          'Una HMI se opera de pie, con guantes, a veces con poca luz y con la pantalla sucia. Los botones diminutos y las fuentes pequeñas que se ven bien en el escritorio del programador resultan inutilizables en planta. Conviene validar el diseño en el sitio real antes de darlo por cerrado.',
      },
      {
        titulo: 'Dejar la navegación sin salida',
        detalle:
          'Es frecuente encontrar pantallas a las que se llega pero de las que no se sale sin reiniciar. Toda vista debe tener un camino de vuelta visible y constante, en la misma posición en todas las pantallas.',
      },
    ],
    faq: [
      {
        q: '¿Qué colores debo usar en una HMI industrial?',
        a: 'Fondo gris neutro y valores de proceso en gris oscuro o negro, con el color reservado para las condiciones anómalas: rojo para alarma crítica, amarillo para advertencia. Si todo tiene color, nada destaca. Y el estado nunca debe depender únicamente del color, por accesibilidad.',
      },
      {
        q: '¿Cuántas pantallas debe tener una HMI?',
        a: 'Las que el proceso necesite, organizadas en niveles: general de planta, por área, por equipo y diagnóstico. Lo importante no es el número sino que el operador llegue a cualquier información relevante en dos o tres toques y sepa siempre volver.',
      },
      {
        q: '¿La HMI puede sustituir al SCADA?',
        a: 'En una máquina aislada, sí. Cuando hay que supervisar varios equipos a la vez, conservar histórico de meses o generar reportes de producción, la HMI se queda corta: no está pensada para almacenar ni para consolidar datos de múltiples fuentes.',
      },
    ],
  },

  dcs: {
    enLaPractica:
      'El DCS es la opción natural en procesos continuos donde una parada no programada cuesta muy cara: refinerías, plantas petroquímicas, generación eléctrica, papeleras. Su rasgo distintivo no es la potencia de cálculo sino la redundancia y la ingeniería integrada: controladores por pares, fuentes duplicadas, redes redundantes y una única base de datos de la que salen a la vez la lógica, las pantallas, las alarmas y el histórico. Cambiar el rango de un transmisor se hace en un sitio y se propaga solo.\n\nEsa integración es también su coste. Un DCS obliga a trabajar dentro del ecosistema del fabricante —Honeywell, Emerson, Yokogawa, ABB, Siemens— con licencias, formación y servicio asociados. La frontera con un SCADA sobre PLC se ha ido difuminando: hoy una arquitectura de PLC redundantes con un buen SCADA cubre muchos casos que hace quince años exigían un DCS. La pregunta útil es cuánto cuesta un minuto de parada y cuántos lazos analógicos hay en juego.',
    errores: [
      {
        titulo: 'Elegir DCS por prestigio y no por proceso',
        detalle:
          'En procesos discretos —envasado, manipulación, ensamblaje— el DCS aporta poco frente a un PLC y encarece la instalación y el mantenimiento. El DCS brilla en control regulatorio continuo con cientos de lazos analógicos, no en secuencias de máquina.',
      },
      {
        titulo: 'Suponer que redundante significa infalible',
        detalle:
          'La redundancia cubre el fallo de un componente, no un error de configuración ni una lógica mal diseñada, que se replican idénticos en ambos controladores. Además, la conmutación debe probarse periódicamente: es habitual descubrir en la emergencia que el respaldo llevaba meses degradado.',
      },
      {
        titulo: 'Descuidar la obsolescencia',
        detalle:
          'Un DCS opera quince o veinte años, más que el ciclo de soporte de muchos de sus componentes. Los planes de migración se preparan con años de antelación; llegar al final de soporte sin plan deja a la planta dependiendo de repuestos de segunda mano.',
      },
    ],
    faq: [
      {
        q: '¿Cuál es la diferencia entre DCS y PLC con SCADA?',
        a: 'El DCS integra control y supervisión en un producto único con redundancia nativa y una base de datos común, orientado a procesos continuos. Un PLC con SCADA son piezas separadas que hay que integrar, más flexible y económico, y muy adecuado en procesos discretos. La frontera se ha difuminado bastante en la última década.',
      },
      {
        q: '¿Cuándo se justifica un DCS?',
        a: 'Cuando hay cientos de lazos analógicos de control continuo, cuando una parada no programada tiene un coste muy elevado y cuando se necesita redundancia real en controladores, redes y fuentes. En procesos discretos o instalaciones pequeñas rara vez compensa.',
      },
      {
        q: '¿Un DCS es más seguro que un PLC?',
        a: 'Es más disponible, que no es lo mismo. Su redundancia reduce las paradas por fallo de un componente. La seguridad funcional frente a riesgos para las personas es competencia de un sistema instrumentado de seguridad (SIS) certificado según IEC 61511, independiente del sistema de control.',
      },
    ],
  },

  pac: {
    enLaPractica:
      'La sigla PAC nació como argumento comercial a comienzos de los 2000 para nombrar controladores que hacían más que un PLC clásico: manejar bases de datos, ejecutar lenguajes de alto nivel, coordinar movimiento y visión, y comunicarse con sistemas de información. Dos décadas después la distinción se ha diluido casi por completo, porque los PLC de gama media ya incorporan casi todo eso. Al comparar equipos conviene ignorar la etiqueta y mirar las especificaciones concretas.\n\nLas preguntas que sí discriminan son concretas: ¿cuántos ejes coordinados soporta y con qué tiempo de ciclo?, ¿admite Texto Estructurado y programación orientada a objetos, o solo LADDER?, ¿puede abrir una conexión a una base de datos SQL sin pasarela intermedia?, ¿trae servidor OPC UA integrado?, ¿cuánta memoria de programa y de datos ofrece? Esas respuestas deciden el proyecto; la palabra impresa en el catálogo, no.',
    errores: [
      {
        titulo: 'Pagar un sobreprecio por la etiqueta',
        detalle:
          'Comprar un controlador porque el catálogo dice PAC en lugar de PLC, sin comparar prestaciones reales, es frecuente. Muchos PLC de gama media cubren los mismos requisitos por bastante menos.',
      },
      {
        titulo: 'Traer prácticas de software de escritorio a la planta',
        detalle:
          'Que el controlador acepte lenguajes de alto nivel no significa que se pueda programar como una aplicación de servidor. La lógica sigue ejecutándose en un ciclo determinista: llamadas bloqueantes, esperas activas o asignación dinámica de memoria alargan el ciclo de scan de forma impredecible.',
      },
      {
        titulo: 'Subestimar la curva de aprendizaje del equipo',
        detalle:
          'Un controlador con más capacidades exige más formación. Si el personal de mantenimiento solo domina LADDER, una lógica escrita en Texto Estructurado con objetos puede resultar imposible de diagnosticar a las tres de la mañana. La capacidad del equipo forma parte del criterio de selección.',
      },
    ],
    faq: [
      {
        q: '¿Qué diferencia hay realmente entre un PAC y un PLC?',
        a: 'Cada vez menos. El término PAC describía controladores con más memoria, lenguajes de alto nivel, control de movimiento y conectividad con sistemas de información. Hoy los PLC de gama media incorporan casi todo eso, así que conviene comparar especificaciones concretas en lugar de fiarse de la etiqueta.',
      },
      {
        q: '¿Debo elegir un PAC para un proyecto de Industria 4.0?',
        a: 'No por la etiqueta, sino por requisitos verificables: servidor OPC UA integrado, capacidad de conexión a bases de datos, memoria suficiente y soporte de los lenguajes que tu equipo domina. Varios PLC modernos cumplen todo eso.',
      },
      {
        q: '¿Un PAC reemplaza a un DCS?',
        a: 'En instalaciones medianas puede cubrir funciones que antes exigían un DCS, sobre todo combinado con un buen SCADA. Lo que no replica de fábrica es la redundancia integrada y la ingeniería unificada de un DCS en procesos continuos grandes.',
      },
    ],
  },

  rtu: {
    enLaPractica:
      'La RTU es el controlador de la intemperie: pozos de agua, estaciones de bombeo, subestaciones eléctricas, oleoductos, puntos de medición repartidos en decenas de kilómetros. Frente a un PLC convencional prioriza tres cosas: consumo bajísimo para funcionar con panel solar y batería, rango de temperatura amplio y comunicación por enlaces lentos e intermitentes —radio, celular, satélite— sin perder datos.\n\nEsa última capacidad es la que de verdad la distingue. Una RTU bien configurada almacena localmente las lecturas cuando el enlace cae y las envía con su marca de tiempo original al recuperarse, lo que se conoce como store and forward. Sin esa función, cada corte de cobertura deja un agujero permanente en el histórico. Protocolos como DNP3 o IEC 60870-5-101/104 se diseñaron precisamente para esto, y por eso siguen siendo el estándar en agua y energía frente a alternativas más modernas pero más habladoras.',
    errores: [
      {
        titulo: 'Dimensionar el panel solar con el promedio anual',
        detalle:
          'La instalación debe sobrevivir a la peor racha, no al promedio: varios días nublados seguidos en la peor época del año. El cálculo se hace sobre el mes de menor radiación y con autonomía de batería para tres a cinco días sin sol.',
      },
      {
        titulo: 'Elegir un protocolo hablador para un enlace caro',
        detalle:
          'Sondear cada segundo por enlace celular multiplica el consumo de datos y de energía sin aportar nada en procesos lentos, como el nivel de un tanque. Los protocolos por excepción (DNP3) reportan solo cuando el valor cambia más allá de una banda muerta, y reducen drásticamente el tráfico.',
      },
      {
        titulo: 'Olvidar la marca de tiempo en origen',
        detalle:
          'Si la RTU no sella cada lectura con su hora local sincronizada, los datos que llegan tras una caída de enlace se registran con la hora de recepción. El histórico queda inservible justo para analizar el incidente que causó la caída.',
      },
    ],
    faq: [
      {
        q: '¿Cuál es la diferencia entre una RTU y un PLC?',
        a: 'Un PLC está pensado para control rápido dentro de una planta, con energía estable y red fiable. Una RTU está pensada para sitios remotos: consumo mínimo, rango de temperatura amplio, comunicación por enlaces lentos o intermitentes y almacenamiento local con marca de tiempo. Las gamas modernas se solapan bastante.',
      },
      {
        q: '¿Qué protocolo se usa con una RTU?',
        a: 'DNP3 e IEC 60870-5-101/104 son los más extendidos en agua y energía porque reportan por excepción, manejan marcas de tiempo en origen y toleran enlaces intermitentes. Modbus también se usa, pero al ser un protocolo de sondeo resulta menos eficiente en enlaces caros.',
      },
      {
        q: '¿Qué pasa con los datos si la RTU pierde comunicación?',
        a: 'Si tiene store and forward configurado, los guarda localmente con su marca de tiempo y los transmite al restablecerse el enlace, sin dejar huecos. Sin esa función, los datos de la ventana sin comunicación se pierden de forma definitiva.',
      },
    ],
  },

  ladder: {
    enLaPractica:
      'LADDER sigue siendo el lenguaje dominante por una razón cultural más que técnica: se lee como un esquema de relés, así que el electricista que mantiene la máquina puede diagnosticar sin ser programador. Esa es su gran virtud y conviene no perderla. Un programa que se entiende de un vistazo, con contactos bien nombrados y comentarios en cada escalón, vale más que uno más compacto que solo su autor puede seguir.\n\nDonde LADDER se vuelve incómodo es en el cálculo. Una fórmula de escalado, un algoritmo de control o la manipulación de cadenas resultan farragosos en escalera y limpios en Texto Estructurado. La práctica habitual en proyectos serios es mixta: la secuencia y los enclavamientos en LADDER, para que mantenimiento los siga; los bloques de cálculo en ST, encapsulados como funciones con nombres claros. La norma IEC 61131-3 permite exactamente esa convivencia.',
    errores: [
      {
        titulo: 'Escribir escalones kilométricos',
        detalle:
          'Un escalón con quince contactos en serie y ocho ramas en paralelo es indiagnosticable en línea: no se ve de un vistazo qué condición está bloqueando la salida. Conviene partirlo en condiciones intermedias con marcas bien nombradas, aunque use más memoria.',
      },
      {
        titulo: 'Usar direcciones absolutas sin simbología',
        detalle:
          'Un programa lleno de I0.3 y Q1.5 sin nombres simbólicos obliga a tener el plano eléctrico al lado para entender cualquier cosa. Nombrar cada señal —ArranqueBombaP101, NivelAltoTanque— convierte el programa en documentación viva.',
      },
      {
        titulo: 'Duplicar bobinas de la misma salida',
        detalle:
          'Escribir dos veces la misma bobina en el programa hace que solo prevalezca la última que se resuelve en el ciclo de scan, con un comportamiento aparentemente aleatorio. Cada salida debe tener una sola bobina; si hay varias condiciones, se combinan en un único escalón.',
      },
    ],
    faq: [
      {
        q: '¿LADDER está obsoleto?',
        a: 'No. Sigue siendo el lenguaje más usado en automatización industrial porque el personal de mantenimiento lo lee sin ser programador, lo que reduce muchísimo el tiempo de diagnóstico. Lo habitual es combinarlo con Texto Estructurado para la parte de cálculo.',
      },
      {
        q: '¿Qué diferencia hay entre LADDER y Texto Estructurado?',
        a: 'LADDER es gráfico y representa el flujo de una condición hacia una salida, ideal para secuencias y enclavamientos. Texto Estructurado es un lenguaje textual parecido a Pascal, mucho más cómodo para cálculos, bucles y manejo de datos. Ambos están normalizados en IEC 61131-3 y pueden convivir en el mismo proyecto.',
      },
      {
        q: '¿Por qué mi salida no se activa aunque el escalón parece correcto?',
        a: 'Las causas más frecuentes son tres: la misma bobina está duplicada en otro punto del programa y se resuelve después; hay una condición de enclavamiento fuera del escalón que se está evaluando antes; o la salida física está forzada. Revisar el programa en línea y buscar todas las apariciones de esa salida resuelve casi todos los casos.',
      },
    ],
  },

  grafcet: {
    enLaPractica:
      'Grafcet brilla cuando el proceso es una secuencia clara de etapas: llenar, agitar, calentar, vaciar. En lugar de intentar sostener el estado con una maraña de marcas y enclavamientos en LADDER, se dibuja una etapa por paso, con su transición y su condición. El programa refleja el proceso, y cualquiera que mire el diagrama entiende en qué punto está la máquina.\n\nCuando el PLC no soporta SFC de forma nativa —caso de muchos equipos de gama baja, incluidos LOGO! o Zelio— la traducción a LADDER se hace con un patrón fijo: una marca interna por etapa, y en cada transición se resetea la etapa actual y se activa la siguiente (`R Mn` seguido de `S Mn+1`). Mantener ese patrón de forma estricta, sin atajos, es lo que hace que la secuencia siga siendo legible y depurable meses después. Las salidas se activan por etapa, nunca dentro de la lógica de transición.',
    errores: [
      {
        titulo: 'Activar más de una etapa a la vez sin quererlo',
        detalle:
          'Si la transición activa la etapa siguiente pero no desactiva la anterior, la secuencia avanza con dos etapas simultáneas y las salidas se solapan. El patrón SET/RESET debe aplicarse siempre completo y en el orden correcto.',
      },
      {
        titulo: 'No definir la etapa inicial tras un corte de energía',
        detalle:
          'Al arrancar, alguna etapa debe estar activa o la secuencia se queda congelada sin motivo aparente. Se resuelve activando la etapa inicial en el primer ciclo de scan, y decidiendo explícitamente si tras un corte se reanuda o se exige rearme manual.',
      },
      {
        titulo: 'Mezclar la lógica de las salidas con la de las transiciones',
        detalle:
          'Las salidas deben depender del estado de la etapa, no de las condiciones que provocan el salto. Mezclarlas produce pulsos fantasma en el cambio de etapa, difíciles de reproducir y de diagnosticar.',
      },
    ],
    faq: [
      {
        q: '¿Grafcet y SFC son lo mismo?',
        a: 'Prácticamente. Grafcet es la norma francesa original (IEC 60848) orientada a la especificación del proceso; SFC es el lenguaje de programación derivado de ella e incluido en la IEC 61131-3. En el día a día los términos se usan indistintamente.',
      },
      {
        q: '¿Cómo programo Grafcet si mi PLC no soporta SFC?',
        a: 'Se traduce a LADDER con una marca interna por etapa. En cada transición se resetea la marca de la etapa actual y se activa la de la siguiente, y las salidas se condicionan al estado de cada marca. Es el patrón habitual en Zelio, LOGO! y otros equipos de gama básica.',
      },
      {
        q: '¿Cuándo conviene Grafcet en lugar de LADDER directo?',
        a: 'Cuando el proceso es secuencial y tiene tres o más pasos con orden definido. Si son dos enclavamientos y una bomba, Grafcet añade complejidad sin beneficio; a partir de cuatro o cinco etapas, mantiene el programa legible donde el LADDER plano se vuelve inmanejable.',
      },
    ],
  },

  'ciclo-de-scan': {
    enLaPractica:
      'El ciclo de scan explica la mayoría de los comportamientos "raros" de un PLC. El controlador lee todas las entradas y guarda una foto, resuelve el programa completo con esa foto y después escribe las salidas. Nada de lo que ocurra en el campo a mitad del programa se ve hasta el ciclo siguiente. Un pulsador que se accione y se suelte en menos de un ciclo puede pasar completamente desapercibido.\n\nEn la práctica esto tiene dos consecuencias. La primera es que las señales muy breves —el diente de un encoder, un sensor de paso a alta velocidad— necesitan entradas rápidas con interrupción de hardware, no lógica normal. La segunda es que el orden de los escalones importa: si una marca se calcula en el escalón 40 y se usa en el 10, ese uso trabajará con el valor del ciclo anterior, introduciendo un retardo de un scan que a veces basta para romper una temporización fina. Un ciclo típico va de 1 a 10 ms según el tamaño del programa y la CPU.',
    errores: [
      {
        titulo: 'Esperar que el PLC vea un pulso más corto que el scan',
        detalle:
          'Si el ciclo dura 8 ms y la señal está presente 3 ms, el PLC nunca la registra. La solución no es acelerar el programa sino usar entradas de alta velocidad con captura por hardware, o alargar la señal con un relé o un monoestable.',
      },
      {
        titulo: 'Ignorar el orden de resolución de los escalones',
        detalle:
          'Usar una marca antes de calcularla dentro del mismo ciclo hace que se trabaje con el valor anterior. En secuencias rápidas o temporizaciones ajustadas ese scan de retardo produce fallos intermitentes muy difíciles de reproducir.',
      },
      {
        titulo: 'Meter bucles largos en el programa cíclico',
        detalle:
          'Un bucle que recorre miles de posiciones alarga el ciclo y puede disparar el watchdog. Los cálculos pesados se reparten entre varios ciclos o se llevan a una tarea de menor prioridad.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto dura el ciclo de scan de un PLC?',
        a: 'Entre 1 y 10 milisegundos en la mayoría de aplicaciones, según el tamaño del programa y la potencia de la CPU. El propio PLC suele exponer el tiempo de ciclo actual, mínimo y máximo, y conviene vigilarlo porque crece a medida que el programa se amplía.',
      },
      {
        q: '¿Por qué mi PLC no detecta un pulso muy corto?',
        a: 'Porque solo mira las entradas una vez por ciclo. Si el pulso dura menos que el ciclo de scan, cae entre dos lecturas y no existe para el programa. Se resuelve con entradas de alta velocidad por interrupción o alargando físicamente la señal.',
      },
      {
        q: '¿El orden de los escalones afecta al resultado?',
        a: 'Sí. El programa se resuelve de arriba abajo dentro de cada ciclo, así que usar una marca antes de calcularla significa trabajar con el valor del ciclo anterior. En procesos rápidos ese retardo de un scan puede ser determinante.',
      },
    ],
  },

  watchdog: {
    enLaPractica:
      'El watchdog es un temporizador que el PLC reinicia al terminar cada ciclo. Si el programa se demora más del límite configurado —un bucle sin salida, un cálculo desbocado, una comunicación que bloquea— el temporizador vence y el controlador pasa a estado de fallo, poniendo las salidas en un estado seguro. Es una red de protección: prefiere una parada controlada a una máquina gobernada por un programa colgado.\n\nCuando un watchdog dispara, la reacción correcta no es subir el límite sino averiguar qué escalón se está comiendo el tiempo. Casi siempre es una de tres cosas: un bucle cuya condición de salida no se cumple nunca, una instrucción de comunicación que espera respuesta de un equipo que no contesta, o un cálculo que creció con el tiempo. Elevar el umbral hace desaparecer el síntoma y conserva la causa, que reaparecerá en el peor momento.',
    errores: [
      {
        titulo: 'Subir el tiempo de watchdog para que deje de disparar',
        detalle:
          'Es el reflejo más común y el peor. El watchdog está avisando de que el programa se demora de forma anómala; ampliarlo solo retrasa el diagnóstico y amplía la ventana en la que la máquina opera sin control efectivo.',
      },
      {
        titulo: 'Confundirlo con el watchdog de comunicaciones',
        detalle:
          'Son cosas distintas. El watchdog de CPU vigila el tiempo de ciclo; el de comunicaciones vigila que el interlocutor siga vivo. Diagnosticar uno mirando el otro lleva a conclusiones equivocadas.',
      },
      {
        titulo: 'No definir el estado seguro de las salidas',
        detalle:
          'Al dispararse el watchdog las salidas van al estado configurado. Si nadie lo definió, el valor por defecto puede no ser el seguro para ese proceso: una válvula que debía cerrarse puede quedar abierta.',
      },
    ],
    faq: [
      {
        q: '¿Qué significa que el PLC entró en fallo por watchdog?',
        a: 'Que un ciclo de programa tardó más que el tiempo máximo configurado. El PLC lo interpreta como un bloqueo y pasa a estado seguro. Las causas habituales son un bucle sin salida, una comunicación que espera respuesta indefinidamente o un cálculo demasiado pesado.',
      },
      {
        q: '¿Puedo desactivar el watchdog?',
        a: 'Técnicamente muchos PLC lo permiten, pero es una muy mala idea: se elimina la única protección frente a un programa colgado y la máquina puede quedar con las salidas congeladas en un estado peligroso. Lo correcto es corregir la causa del exceso de tiempo.',
      },
      {
        q: '¿Cuál es un valor razonable de watchdog?',
        a: 'Depende del proceso, pero como referencia se configura holgadamente por encima del tiempo de ciclo máximo observado —del orden de tres a cinco veces— dejando margen para las variaciones normales sin llegar a tolerar un bloqueo real.',
      },
    ],
  },

  setpoint: {
    enLaPractica:
      'El setpoint es el valor al que se quiere llevar la variable de proceso, y su gestión rara vez es tan simple como escribir un número. En la práctica aparecen tres cuestiones. La primera son los límites: un operador no debería poder introducir 400 °C en un tanque que soporta 120, así que el rango se acota en la propia lógica, no solo en la pantalla. La segunda es la rampa: cambiar bruscamente de 20 a 80 °C provoca una respuesta violenta del controlador; lo habitual es hacer que el setpoint efectivo se desplace de forma gradual.\n\nLa tercera es de dónde viene. Un setpoint local lo fija el operador en la HMI; uno remoto llega desde el SCADA o desde una receta de producto; y en control en cascada el setpoint de un lazo lo genera la salida de otro. Esa conmutación entre modos debe ser sin salto: al pasar de local a remoto, el valor debe tomarse suavemente para que el proceso no dé un tirón, algo que en instalaciones mal ajustadas produce sobrepresiones cada vez que se cambia de modo.',
    errores: [
      {
        titulo: 'Permitir setpoints fuera del rango físico del proceso',
        detalle:
          'Validar el valor solo en la pantalla no basta: el mismo dato puede escribirse desde el SCADA o desde una receta. Los límites deben imponerse en la lógica del controlador, que es el último punto por el que pasa el valor.',
      },
      {
        titulo: 'Cambiar el setpoint de golpe',
        detalle:
          'Un salto grande provoca una acción proporcional y derivativa muy agresiva, con sobreimpulso y desgaste del actuador. Una rampa de setpoint suaviza la transición sin tocar la sintonía del lazo.',
      },
      {
        titulo: 'Conmutar entre local y remoto con salto',
        detalle:
          'Si al cambiar de modo el setpoint pasa bruscamente de un valor a otro, el proceso da un tirón. La conmutación debe ser sin salto (bumpless), inicializando el nuevo modo con el valor que estaba activo.',
      },
    ],
    faq: [
      {
        q: '¿Qué diferencia hay entre setpoint y variable de proceso?',
        a: 'El setpoint es el valor deseado, el objetivo. La variable de proceso es el valor real que mide el instrumento. La diferencia entre ambos es el error, que es precisamente lo que el controlador intenta llevar a cero.',
      },
      {
        q: '¿Qué es una rampa de setpoint y por qué se usa?',
        a: 'Es hacer que el setpoint se desplace gradualmente hacia el nuevo valor en lugar de saltar de golpe. Evita el sobreimpulso, reduce el esfuerzo del actuador y protege al proceso de cambios bruscos, sin necesidad de resintonizar el lazo.',
      },
      {
        q: '¿Qué es un setpoint remoto?',
        a: 'Un valor que no fija el operador local sino un sistema superior: el SCADA, una receta de producto o, en control en cascada, la salida de otro lazo. La conmutación entre setpoint local y remoto debe hacerse sin salto para no perturbar el proceso.',
      },
    ],
  },

  pid: {
    enLaPractica:
      'Sintonizar un PID en planta rara vez sigue el método del libro. El procedimiento que funciona es empezar solo con la acción proporcional, subir la ganancia hasta que la respuesta empiece a oscilar y retroceder a la mitad; después añadir integral hasta eliminar el error permanente, con cuidado porque es la acción que más desestabiliza; y dejar la derivativa fuera salvo que el proceso sea lento y con poco ruido. En control de caudal y de presión la derivativa suele estorbar más que ayudar, porque amplifica el ruido del transmisor.\n\nAntes de tocar ninguna constante conviene descartar los problemas mecánicos, que se disfrazan de mala sintonía. Una válvula con histéresis, un posicionador desajustado o un transmisor mal calibrado producen oscilaciones que ninguna combinación de parámetros arregla. Un lazo que oscila con periodo muy regular y amplitud constante casi siempre está señalando fricción en la válvula, no una ganancia excesiva.',
    errores: [
      {
        titulo: 'Sintonizar con la válvula en mal estado',
        detalle:
          'La histéresis y la fricción (stiction) provocan un ciclo límite que parece un problema de ajuste. Se puede distinguir: si la oscilación tiene amplitud constante y forma de onda cuadrada más que sinusoidal, el problema es mecánico. Ningún parámetro lo corrige.',
      },
      {
        titulo: 'Abusar de la acción derivativa',
        detalle:
          'La derivativa reacciona a la velocidad de cambio, así que amplifica el ruido del transmisor y produce una salida nerviosa que desgasta el actuador. En caudal y presión suele dejarse en cero; se reserva para procesos térmicos lentos y bien filtrados.',
      },
      {
        titulo: 'No limitar la acumulación integral',
        detalle:
          'Si el actuador se satura y el error persiste, el término integral sigue creciendo (windup). Al volver el proceso al rango normal, el controlador tarda muchísimo en descargar esa acumulación y produce un sobreimpulso enorme. Todo PID en producción necesita anti-windup activo.',
      },
    ],
    faq: [
      {
        q: '¿Cómo sintonizo un PID sin conocer el modelo del proceso?',
        a: 'Empieza solo con proporcional: sube la ganancia hasta que aparezca oscilación sostenida y redúcela a la mitad. Añade después acción integral hasta que desaparezca el error permanente, sin pasarte. Deja la derivativa en cero salvo que el proceso sea lento y la señal esté limpia de ruido.',
      },
      {
        q: '¿Por qué mi lazo PID oscila?',
        a: 'Puede ser ganancia excesiva o acción integral demasiado rápida, pero antes de tocar parámetros hay que descartar la mecánica: válvula con fricción, posicionador desajustado o transmisor mal calibrado. Una oscilación de amplitud constante y forma cuadrada apunta casi siempre a la válvula.',
      },
      {
        q: '¿Qué es el windup integral?',
        a: 'La acumulación descontrolada del término integral cuando el actuador está saturado y el error no puede corregirse. Al normalizarse el proceso, esa acumulación provoca un sobreimpulso grande y prolongado. Se evita con una función anti-windup, presente en todos los bloques PID industriales.',
      },
    ],
  },

  modbus: {
    enLaPractica:
      'Modbus sigue vivo cuarenta años después por una razón sencilla: es tan simple que lo implementa cualquiera, y prácticamente todo equipo industrial lo habla. Un variador, un medidor de energía, una balanza y un PLC de fabricantes distintos se entienden sin pasarelas. Esa universalidad compensa sus limitaciones evidentes: no lleva marca de tiempo, no describe los datos, no tiene seguridad de ningún tipo y funciona por sondeo, con un maestro que pregunta y esclavos que responden.\n\nEl punto donde más tiempo se pierde es el direccionamiento. La documentación de cada fabricante mezcla dos convenciones: la dirección "de protocolo", que empieza en 0, y la "de usuario", que empieza en 1 y suele venir con el prefijo 4 para los holding registers. El registro 40001 del manual es el 0 en la trama. Cuando un valor sale desplazado exactamente una posición, casi siempre es esto. El segundo punto es el orden de bytes en los valores de 32 bits: la norma no lo fija, y cada fabricante lo resuelve a su manera.',
    errores: [
      {
        titulo: 'Equivocarse en el desplazamiento del direccionamiento',
        detalle:
          'Leer el registro 40001 como dirección 40001 en lugar de 0 es el error más repetido con Modbus. Si el dato aparece corrido justo una posición, revisa qué convención usa el manual antes de buscar en otro sitio.',
      },
      {
        titulo: 'Ignorar el orden de palabras en valores de 32 bits',
        detalle:
          'Un flotante ocupa dos registros y la norma no define en qué orden. Si el valor leído es absurdo pero cambia cuando cambia el real, prueba a intercambiar las palabras: muchos maestros ofrecen las cuatro combinaciones posibles.',
      },
      {
        titulo: 'Tratar Modbus TCP como si fuera seguro',
        detalle:
          'Modbus no tiene autenticación ni cifrado: cualquiera con acceso a la red puede leer y, sobre todo, escribir registros. Nunca debe exponerse a Internet ni a la red corporativa sin segmentación, cortafuegos y control de acceso.',
      },
    ],
    faq: [
      {
        q: '¿Por qué el registro 40001 de Modbus se lee como dirección 0?',
        a: 'Porque conviven dos convenciones. La de usuario numera desde 1 y añade un prefijo por tipo de dato (4 para holding registers), mientras que la trama del protocolo direcciona desde 0. Así, 40001 en el manual equivale a la dirección 0 en la comunicación real.',
      },
      {
        q: '¿Cuál es la diferencia entre Modbus RTU y Modbus TCP?',
        a: 'RTU es la versión serie, normalmente sobre RS-485, con trama binaria y comprobación CRC; admite varios esclavos en un mismo bus de dos hilos. TCP encapsula el mismo modelo de datos sobre Ethernet. La lógica de registros es idéntica; cambia el medio físico y el direccionamiento de red.',
      },
      {
        q: '¿Es seguro usar Modbus?',
        a: 'El protocolo no ofrece ninguna seguridad: ni autenticación, ni cifrado, ni verificación de integridad frente a manipulación. Es aceptable dentro de una red OT bien segmentada y aislada, pero nunca debe quedar accesible desde Internet ni desde la red corporativa.',
      },
    ],
  },

  vfd: {
    enLaPractica:
      'El ahorro energético de un variador no viene de "regular la velocidad" sino de la física de las cargas centrífugas: en una bomba o un ventilador la potencia varía aproximadamente con el cubo de la velocidad, así que trabajar al 80 % del caudal consume alrededor de la mitad. Ese es el caso de negocio. En cargas de par constante —una cinta transportadora, un compresor de desplazamiento positivo— la relación es lineal y el ahorro mucho menor: el variador se justifica ahí por control de proceso o por arranque suave, no por energía.\n\nEl ahorro real aparece solo si antes se elimina el estrangulamiento. Una bomba regulada con válvula de estrangulamiento gasta energía calentando el fluido; sustituir esa válvula por control de velocidad es donde está el retorno. Instalar el variador y dejar la válvula parcialmente cerrada conserva buena parte de la pérdida y arruina el cálculo de amortización, que en instalaciones bien planteadas suele situarse entre uno y tres años.',
    errores: [
      {
        titulo: 'Instalar el variador y dejar la válvula estrangulando',
        detalle:
          'Es la forma más común de no obtener el ahorro prometido. Si la válvula sigue restringiendo el caudal, la energía se sigue disipando ahí. El variador debe sustituir a la estrangulación, no convivir con ella.',
      },
      {
        titulo: 'Cablear el motor sin cable apantallado ni buena puesta a tierra',
        detalle:
          'La conmutación rápida del variador genera interferencia electromagnética que se acopla a las señales analógicas cercanas y produce lecturas erráticas en toda la instalación. Cable apantallado con la pantalla aterrizada en ambos extremos y separación física de las señales de instrumentación son obligatorios, no opcionales.',
      },
      {
        titulo: 'Hacer trabajar un motor estándar a muy baja frecuencia',
        detalle:
          'Un motor autoventilado refrigera con su propio ventilador acoplado al eje: por debajo de aproximadamente el 30-40 % de la velocidad nominal deja de refrigerar bien y se recalienta aunque la corriente parezca normal. Para operación continua a baja velocidad hace falta ventilación forzada independiente o un motor apto para variador.',
      },
    ],
    faq: [
      {
        q: '¿Cuánta energía ahorra realmente un variador de frecuencia?',
        a: 'En bombas y ventiladores, mucho: la potencia varía aproximadamente con el cubo de la velocidad, así que reducir el caudal al 80 % puede recortar cerca de la mitad del consumo. En cargas de par constante, como cintas o compresores, la relación es lineal y el ahorro bastante menor.',
      },
      {
        q: '¿Por qué mis señales analógicas se vuelven inestables al instalar un variador?',
        a: 'Por interferencia electromagnética. El variador conmuta a alta frecuencia y acopla ruido a los cables cercanos. Se corrige con cable apantallado al motor, pantalla correctamente aterrizada, separación física respecto a las señales de instrumentación y, si hace falta, filtros de salida.',
      },
      {
        q: '¿Puedo usar cualquier motor con un variador?',
        a: 'La mayoría de motores trifásicos funcionan, pero con matices. A baja velocidad un motor autoventilado se recalienta porque su ventilador gira despacio, y los picos de tensión del variador exigen un aislamiento reforzado. Para servicio continuo a velocidad reducida conviene un motor declarado apto para variador o ventilación forzada.',
      },
    ],
  },

  encoder: {
    enLaPractica:
      'La primera decisión es incremental o absoluto. El incremental entrega pulsos y el sistema cuenta: es barato y preciso, pero al perder alimentación olvida dónde estaba y obliga a hacer una búsqueda de referencia (homing) en cada arranque. El absoluto entrega la posición real codificada, así que al encender ya sabe dónde está. En un eje que mueve una herramienta cerca de topes, o en una máquina que no puede permitirse un homing tras cada corte de energía, el absoluto se paga solo.\n\nLa segunda es la resolución, que conviene calcular y no elegir por catálogo. Se parte de la precisión mecánica que exige el proceso y se traslada al eje del encoder considerando la reducción. Pedir 10.000 pulsos por vuelta cuando el proceso tolera medio milímetro solo genera un flujo de pulsos que el contador puede no seguir. Y la tercera, la que más fallos causa en campo, es el acoplamiento: un encoder mal alineado o unido con un acople rígido acaba con el rodamiento y con lecturas que se degradan progresivamente.',
    errores: [
      {
        titulo: 'Acoplar el encoder con un acople rígido',
        detalle:
          'Cualquier desalineación se transmite íntegra al rodamiento del encoder y lo destruye en meses. Se usa siempre un acople flexible, que absorbe la desalineación angular y axial sin transmitir esfuerzo.',
      },
      {
        titulo: 'Cablear la señal sin apantallar en entorno con variadores',
        detalle:
          'Los pulsos son señales rápidas y de bajo nivel: el ruido de un variador cercano introduce cuentas fantasma y la posición se va desviando poco a poco. Cable apantallado, preferiblemente con salida diferencial (line driver) en lugar de colector abierto.',
      },
      {
        titulo: 'Olvidar el homing tras corte de energía con encoder incremental',
        detalle:
          'Si el programa asume que la posición guardada sigue siendo válida tras un corte, el primer movimiento puede ir contra un tope. Con encoder incremental el arranque debe exigir siempre una búsqueda de referencia antes de habilitar movimiento automático.',
      },
    ],
    faq: [
      {
        q: '¿Encoder incremental o absoluto?',
        a: 'Incremental si el sistema puede hacer una búsqueda de referencia al arrancar y el coste importa. Absoluto cuando perder la posición es caro o peligroso: conserva la posición real sin alimentación y evita el homing tras cada corte de energía.',
      },
      {
        q: '¿Qué resolución de encoder necesito?',
        a: 'Se calcula desde la precisión que exige el proceso, trasladada al eje del encoder según la reducción mecánica. Pedir más resolución de la necesaria encarece el equipo y puede saturar la entrada de conteo del controlador.',
      },
      {
        q: '¿Por qué mi encoder pierde cuentas?',
        a: 'Las causas habituales son tres: ruido eléctrico acoplado por cable no apantallado cerca de un variador, una frecuencia de pulsos superior a la que admite la entrada del PLC, o un acoplamiento mecánico desalineado que hace patinar o vibrar el eje.',
      },
    ],
  },

  servo: {
    enLaPractica:
      'Un servo no es un motor más potente: es un sistema en lazo cerrado formado por motor, encoder y drive, que corrige la posición miles de veces por segundo. Se elige cuando hacen falta posicionamiento preciso, perfiles de movimiento controlados o par sostenido a baja velocidad. Un motor con variador mueve; un servo coloca. Esa es la frontera práctica: si el requisito es "llegar a 128,5 mm en 300 ms sin sobrepasar", es servo.\n\nEl dimensionamiento se hace por inercia y no por potencia, y ahí está el error clásico. La relación entre la inercia de la carga reflejada al eje y la del propio motor debería mantenerse en un rango razonable —como referencia habitual, por debajo de 10:1, y bastante menos si se buscan movimientos muy dinámicos—. Con una relación excesiva el lazo se vuelve inestable y ninguna sintonía lo arregla: hay que cambiar la reducción o el motor. Conviene calcular esa relación antes de comprar, no después de montar.',
    errores: [
      {
        titulo: 'Dimensionar por potencia en lugar de por inercia',
        detalle:
          'Un motor con par de sobra puede ser incapaz de controlar una carga cuya inercia reflejada lo supera muchas veces. La relación de inercias es el criterio determinante en servoaccionamientos, junto con el par pico necesario para acelerar.',
      },
      {
        titulo: 'Ignorar la elasticidad de la transmisión',
        detalle:
          'Correas largas, acoples flexibles o reductores con holgura introducen resonancias mecánicas que el lazo de control excita. El resultado es un zumbido o vibración a determinada velocidad que no se corrige con ganancias, sino rigidizando la mecánica o filtrando esa frecuencia.',
      },
      {
        titulo: 'Cablear potencia y realimentación juntas',
        detalle:
          'El cable de potencia del servo conmuta a alta frecuencia; si comparte canaleta con el del encoder, induce ruido en la realimentación y el eje se vuelve errático. Deben ir separados y apantallados.',
      },
    ],
    faq: [
      {
        q: '¿Cuál es la diferencia entre un servomotor y un motor con variador?',
        a: 'El servo trabaja en lazo cerrado con realimentación de posición: sabe exactamente dónde está y corrige el error continuamente, con gran precisión y dinámica. Un motor con variador regula velocidad en lazo abierto o con realimentación básica, suficiente para mover pero no para posicionar con exactitud.',
      },
      {
        q: '¿Qué relación de inercia es aceptable en un servo?',
        a: 'Como referencia general se busca mantener la inercia de la carga reflejada por debajo de unas diez veces la del motor, y bastante menos en aplicaciones muy dinámicas. Por encima de ese rango el lazo se vuelve difícil de estabilizar y la sintonía deja de compensar.',
      },
      {
        q: '¿Por qué mi servo vibra a cierta velocidad?',
        a: 'Casi siempre es una resonancia mecánica de la transmisión —correa, acople o reductor— que el lazo de control amplifica. Se ataca rigidizando la mecánica, cambiando la relación de transmisión o aplicando un filtro de rechazo en esa frecuencia dentro del drive.',
      },
    ],
  },

  cobot: {
    enLaPractica:
      'La expresión "no necesita valla" es la fuente de casi todos los malentendidos con los cobots. Lo que la normativa evalúa no es el robot sino la aplicación completa: el robot, la herramienta, la pieza y el entorno. Un cobot con una pinza de puntas afiladas o manipulando una pieza caliente puede requerir el mismo resguardo que un robot industrial clásico. La evaluación de riesgos según ISO 10218 y la especificación ISO/TS 15066 es obligatoria, y es la que determina si el vallado se puede eliminar.\n\nSu terreno natural son series cortas y mucha variedad de producto: el cobot se reprograma guiándolo con la mano en minutos, sin necesidad de un programador especializado, y se traslada de una célula a otra. Donde no compite es en velocidad. Operando en modo colaborativo real las velocidades son sustancialmente menores que las de un robot industrial tras valla, así que en producción masiva de una sola referencia el robot tradicional sigue siendo más rentable.',
    errores: [
      {
        titulo: 'Suponer que colaborativo significa "sin evaluación de riesgos"',
        detalle:
          'La evaluación es obligatoria y valora la aplicación completa, no el robot aislado. La herramienta, la pieza manipulada y el entorno pueden exigir resguardos aunque el brazo sea colaborativo.',
      },
      {
        titulo: 'Prometer los tiempos de ciclo de un robot industrial',
        detalle:
          'En modo colaborativo el cobot opera con velocidades y fuerzas limitadas por norma. Dimensionar la producción con los tiempos de un robot tras valla lleva a incumplir el objetivo desde el primer día.',
      },
      {
        titulo: 'Olvidar el peso de la herramienta en la carga útil',
        detalle:
          'La carga nominal incluye la pinza, el cableado y cualquier utillaje. Un cobot de 5 kg con una pinza de 1,5 kg solo puede manipular 3,5 kg reales, y a máxima extensión el límite práctico baja todavía más.',
      },
    ],
    faq: [
      {
        q: '¿Un cobot necesita valla de seguridad?',
        a: 'Depende de la evaluación de riesgos de la aplicación completa, no del robot. Si la herramienta tiene aristas cortantes, la pieza está caliente o el entorno añade peligros, puede hacer falta resguardo. La norma que rige el trabajo colaborativo es la ISO/TS 15066, junto con la ISO 10218.',
      },
      {
        q: '¿Cuándo conviene un cobot frente a un robot industrial?',
        a: 'Cuando hay series cortas, muchos cambios de referencia, espacio reducido y falta de personal especializado en programación. Para producción masiva de una sola pieza, el robot industrial tras valla ofrece tiempos de ciclo bastante mejores.',
      },
      {
        q: '¿Cuánto peso puede manipular realmente un cobot de 10 kg?',
        a: 'Menos de 10 kg. De la carga nominal hay que descontar la pinza y el utillaje, y además la capacidad disminuye cuando el brazo trabaja extendido o en ciertas orientaciones. Conviene verificar la carga útil en la posición y velocidad concretas de la aplicación.',
      },
    ],
  },

  agv: {
    enLaPractica:
      'La diferencia entre AGV y AMR está en cómo deciden el camino. El AGV sigue una infraestructura física —banda magnética, cable enterrado, reflectores— y si algo bloquea la ruta, se detiene y espera. El AMR construye un mapa del entorno y calcula su trayectoria, así que rodea el obstáculo y sigue. Esa autonomía tiene un precio: el AGV es más barato, más predecible y perfectamente adecuado cuando la ruta es fija y el tráfico escaso.\n\nEl fracaso de estos proyectos casi nunca es del vehículo. Es del entorno y de la integración: suelos con desniveles o juntas que descalibran la navegación, pasillos que el mapa no contempla porque siempre hay un palet aparcado, puertas que el robot no puede abrir, ascensores sin integrar, y sobre todo la falta de conexión con el sistema de gestión de almacén. Un AMR que no sabe qué debe mover ni adónde acaba siendo un carro caro. La flota se dimensiona por número de movimientos por hora, incluyendo tiempos de carga de batería.',
    errores: [
      {
        titulo: 'Dimensionar la flota sin contar los tiempos de carga',
        detalle:
          'Un vehículo no está disponible las 24 horas: necesita cargar. Si el cálculo de movimientos por hora ignora ese tiempo muerto, la flota se queda corta en cuanto arranca la operación real.',
      },
      {
        titulo: 'Dar por bueno el suelo sin medirlo',
        detalle:
          'Juntas de dilatación, desniveles, rampas y rejillas afectan a la navegación y al transporte de la carga. Es un problema caro de corregir después, y conviene levantarlo antes de firmar el proyecto.',
      },
      {
        titulo: 'No integrar con el sistema de gestión de almacén',
        detalle:
          'Sin conexión al WMS o al ERP, alguien tiene que decirle a cada vehículo qué mover y adónde, lo que anula gran parte del ahorro. La integración es parte del proyecto, no un extra posterior.',
      },
    ],
    faq: [
      {
        q: '¿Cuál es la diferencia entre AGV y AMR?',
        a: 'El AGV sigue una ruta fija marcada por infraestructura —banda magnética, cable, reflectores— y se detiene ante un obstáculo. El AMR navega de forma autónoma con un mapa y sensores, replanifica su trayectoria y rodea obstáculos. El AGV es más económico y predecible; el AMR, más flexible.',
      },
      {
        q: '¿Qué necesita mi planta antes de instalar AMR?',
        a: 'Suelo en buen estado y sin desniveles problemáticos, pasillos con ancho suficiente y despejados de forma estable, cobertura de red fiable, puntos de carga bien ubicados e integración con el sistema que decide qué se mueve y cuándo.',
      },
      {
        q: '¿Cuántos vehículos necesito?',
        a: 'Se calcula sobre movimientos por hora: distancia media por trayecto, velocidad real —no la nominal—, tiempos de carga y descarga y tiempo de recarga de batería. Conviene añadir margen para picos de producción y para la indisponibilidad por mantenimiento.',
      },
    ],
  },

  iiot: {
    enLaPractica:
      'La mayoría de proyectos de IIoT que fracasan lo hacen por el mismo motivo: se instalan sensores antes de tener una pregunta. Conectar doscientas señales genera un panel bonito, un coste de plataforma recurrente y ninguna decisión distinta. El orden que funciona es el inverso: identificar una pérdida concreta y cuantificada —esta línea para tres horas al mes por un fallo de rodamiento— e instrumentar solo lo que permite anticiparla.\n\nLa arquitectura habitual coloca una pasarela entre la planta y la nube. Esa pasarela lee de los PLC por Modbus u OPC UA, filtra y agrega en el borde, y envía a la nube solo lo relevante, normalmente por MQTT. Es también la frontera de seguridad: el tráfico debe ser saliente e iniciado desde la planta, nunca una conexión entrante desde Internet hacia la red OT. Esa regla, sencilla de enunciar, es la que separa un proyecto IIoT razonable de una puerta abierta a los sistemas de control.',
    errores: [
      {
        titulo: 'Instrumentar primero y preguntarse después',
        detalle:
          'Sin una pregunta de negocio concreta, los datos se acumulan sin traducirse en decisiones. Empezar por una pérdida cuantificada y medir solo lo necesario para atacarla da resultados verificables y financia la siguiente fase.',
      },
      {
        titulo: 'Abrir puertos entrantes hacia la red OT',
        detalle:
          'Exponer un PLC o una pasarela a conexiones entrantes desde Internet es una de las formas más rápidas de comprometer una planta. La conexión debe iniciarse siempre desde dentro hacia fuera, con la red OT segmentada y sin rutas directas.',
      },
      {
        titulo: 'Enviar todo el dato crudo a la nube',
        detalle:
          'Transmitir cada lectura a máxima frecuencia dispara el coste de conectividad y de almacenamiento sin aportar precisión. Filtrar y agregar en el borde —enviar por excepción o resumen— reduce el gasto de forma drástica sin perder información útil.',
      },
    ],
    faq: [
      {
        q: '¿Por dónde empiezo un proyecto de IIoT?',
        a: 'Por una pérdida concreta y medible: una parada recurrente, un consumo anómalo, un defecto de calidad. Instrumenta solo lo necesario para atacarla, demuestra el ahorro y amplía después. Empezar por la plataforma en lugar de por el problema es la causa más frecuente de fracaso.',
      },
      {
        q: '¿IIoT e IoT son lo mismo?',
        a: 'No. El IoT de consumo prioriza coste y comodidad; el IIoT opera en entornos hostiles, con equipos de quince o veinte años de vida útil, exigencias de disponibilidad y consecuencias físicas si algo falla. Los requisitos de robustez y seguridad son de otro orden.',
      },
      {
        q: '¿Es seguro conectar mis PLC a la nube?',
        a: 'Puede serlo si la conexión la inicia siempre la planta hacia fuera, a través de una pasarela que aísle la red OT, con la red segmentada y sin puertos entrantes expuestos. Lo que nunca es seguro es publicar directamente un PLC en Internet.',
      },
    ],
  },

  'digital-twin': {
    enLaPractica:
      'La palabra gemelo digital se usa para cosas muy distintas, y conviene distinguirlas porque el coste cambia por completo. Un modelo 3D que se ve bonito no es un gemelo. Un gemelo digital real está alimentado con datos en vivo del activo físico y sirve para responder preguntas: cuánta vida útil le queda a este rodamiento, qué pasa si subo la velocidad de la línea un 10 %, dónde está el cuello de botella con esta mezcla de producto.\n\nEl caso de uso con retorno más claro y menos discutido es la puesta en marcha virtual. Se simula la máquina y se prueba el programa del PLC contra el modelo antes de que exista el equipo físico. Los errores de lógica se detectan en la oficina en lugar de en planta con la línea parada y el cliente esperando, lo que suele recortar semanas del arranque. Es también el más acotado: no exige un modelo perfecto de todo, solo del comportamiento que el programa debe gobernar.',
    errores: [
      {
        titulo: 'Llamar gemelo digital a una maqueta 3D',
        detalle:
          'Sin datos en vivo del activo físico y sin capacidad de responder preguntas, es una visualización. Útil para comunicar, pero no aporta nada de lo que promete un gemelo digital.',
      },
      {
        titulo: 'Modelar con más detalle del necesario',
        detalle:
          'El esfuerzo crece muchísimo con la fidelidad, y casi siempre la pregunta a responder no la necesita. Conviene fijar primero qué decisión debe soportar el modelo y modelar solo hasta ahí.',
      },
      {
        titulo: 'No prever el mantenimiento del modelo',
        detalle:
          'La planta cambia: se sustituye un equipo, se modifica una secuencia. Si el gemelo no se actualiza, en pocos meses da respuestas que ya no corresponden a la realidad y se deja de usar. El mantenimiento del modelo es parte del coste recurrente.',
      },
    ],
    faq: [
      {
        q: '¿Qué diferencia hay entre un gemelo digital y una simulación?',
        a: 'La simulación es un modelo que se ejecuta con datos hipotéticos para estudiar escenarios. El gemelo digital está conectado al activo real y se alimenta de sus datos en vivo, de modo que refleja el estado actual y evoluciona con él.',
      },
      {
        q: '¿Cuál es el uso más rentable de un gemelo digital?',
        a: 'La puesta en marcha virtual: validar el programa del PLC contra un modelo de la máquina antes de tenerla montada. Detecta errores de lógica en la oficina en lugar de en planta, y suele recortar semanas de arranque con un alcance de modelado acotado.',
      },
      {
        q: '¿Necesito un gemelo digital de toda la planta?',
        a: 'Casi nunca. Se empieza por el activo crítico o el cuello de botella, con el nivel de detalle mínimo que responda a la pregunta concreta. Modelar la planta entera multiplica el coste y el mantenimiento sin multiplicar el beneficio.',
      },
    ],
  },

  'edge-computing': {
    enLaPractica:
      'Procesar en el borde se justifica por tres motivos concretos, y conviene saber cuál aplica. El primero es la latencia: una inspección de calidad que debe rechazar una pieza en 50 ms no puede esperar el viaje de ida y vuelta a la nube. El segundo es el volumen: una cámara generando vídeo continuo satura cualquier enlace, así que se analiza localmente y se envía solo el resultado. El tercero es la continuidad: la planta debe seguir funcionando cuando el enlace a Internet caiga, cosa que ocurre.\n\nEl reparto habitual coloca en el borde la inferencia y el filtrado, y en la nube el entrenamiento de modelos, la consolidación entre plantas y el histórico largo. Lo que suele subestimarse es la gestión del parque: veinte equipos de borde repartidos por la planta son veinte dispositivos que hay que actualizar, parchear y monitorizar. Sin una estrategia de despliegue remoto, en un año conviven cuatro versiones distintas de software y nadie sabe qué corre en cada armario.',
    errores: [
      {
        titulo: 'Usar edge donde bastaba con el PLC',
        detalle:
          'Si la decisión es una comparación contra un umbral, el controlador ya la toma en milisegundos. Añadir un equipo de borde suma un punto de fallo y un coste de mantenimiento sin aportar capacidad nueva.',
      },
      {
        titulo: 'No planificar la actualización remota',
        detalle:
          'Actualizar a mano equipos repartidos por la planta no escala. Sin despliegue centralizado, las versiones divergen y aparecen fallos imposibles de reproducir porque cada nodo ejecuta algo distinto.',
      },
      {
        titulo: 'Instalar hardware de oficina en el armario',
        detalle:
          'Un miniPC de consumo en un tablero sin ventilación, con polvo y vibración, falla en meses. El equipo de borde debe ser de grado industrial, con rango de temperatura adecuado y preferiblemente sin partes móviles.',
      },
    ],
    faq: [
      {
        q: '¿Cuándo necesito edge computing en lugar de nube?',
        a: 'Cuando la latencia es crítica (decisiones en milisegundos), cuando el volumen de datos es demasiado grande para transmitirlo —vídeo, vibración a alta frecuencia— o cuando el proceso debe seguir operando aunque caiga el enlace a Internet.',
      },
      {
        q: '¿El edge sustituye a la nube?',
        a: 'No, se reparten el trabajo. El borde ejecuta inferencia y filtrado en tiempo real; la nube entrena los modelos, consolida información entre plantas y guarda el histórico largo. La arquitectura habitual combina ambos.',
      },
      {
        q: '¿Qué hardware se usa en el borde industrial?',
        a: 'Equipos de grado industrial: rango de temperatura amplio, sin ventilador ni disco mecánico, montaje en riel DIN y alimentación de 24 V. El hardware de oficina no sobrevive al polvo, la vibración y la temperatura de un tablero.',
      },
    ],
  },

  mes: {
    enLaPractica:
      'El MES ocupa la capa intermedia: traduce la orden de producción que baja del ERP en instrucciones concretas para la planta, y devuelve hacia arriba lo que realmente ocurrió. Su valor más tangible es la trazabilidad. Cuando un cliente reclama por un lote, el MES responde con qué materia prima se usó, en qué máquina, con qué parámetros, en qué turno y con qué operario. Sin él, esa reconstrucción son días de revisar papeles y hojas de cálculo.\n\nLa implantación fracasa casi siempre por el mismo sitio: la captura de datos. Si el operario tiene que teclear en un terminal lo que ya hizo, los datos llegan tarde, incompletos y a veces inventados al final del turno. Lo que funciona es capturar automáticamente desde los PLC todo lo que se pueda —conteos, tiempos, paradas, parámetros— y dejar al operario solo aquello que exige criterio humano, como clasificar el motivo de una parada. Cuanto menos teclee, más fiable es el dato.',
    errores: [
      {
        titulo: 'Cargar al operario con la captura manual',
        detalle:
          'Todo lo que exija teclear compite con el trabajo real y termina rellenándose de memoria al final del turno. La captura automática desde los PLC es la base; lo manual se reserva para lo que requiere juicio humano.',
      },
      {
        titulo: 'Implantar el MES sobre procesos indefinidos',
        detalle:
          'El sistema exige formalizar rutas, tiempos estándar y motivos de parada. Si esa definición no existe, el proyecto se convierte en un ejercicio de consultoría de procesos disfrazado de instalación de software, con plazos y costes muy distintos a los previstos.',
      },
      {
        titulo: 'Duplicar funciones con el ERP',
        detalle:
          'Sin una frontera clara sobre qué dato es maestro en cada sistema, aparecen discrepancias entre lo que dice el ERP y lo que dice el MES, y se pierde la confianza en ambos. Esa frontera se define antes de empezar.',
      },
    ],
    faq: [
      {
        q: '¿Qué diferencia hay entre MES y ERP?',
        a: 'El ERP gestiona el negocio: pedidos, compras, inventario, costes, con horizonte de días o semanas. El MES gestiona la ejecución en planta: qué se está fabricando ahora, en qué máquina, con qué parámetros, con horizonte de minutos. El MES recibe la orden del ERP y le devuelve lo realmente producido.',
      },
      {
        q: '¿Necesito un MES o me basta con un SCADA?',
        a: 'El SCADA supervisa el proceso y sus variables. El MES gestiona la producción: órdenes, trazabilidad por lote, genealogía de materiales, rendimiento por turno e indicadores como el OEE. Si la pregunta es qué está haciendo el proceso, basta el SCADA; si es qué se produjo, con qué material y quién lo hizo, hace falta MES.',
      },
      {
        q: '¿Cuánto tarda una implantación de MES?',
        a: 'Depende mucho del alcance, pero la parte larga rara vez es el software: es formalizar procesos, definir motivos de parada, integrar con el ERP y conectar la captura automática desde los equipos. Acotar el alcance a una línea piloto antes de extender reduce bastante el riesgo.',
      },
    ],
  },

  'ot-it': {
    enLaPractica:
      'La convergencia OT/IT choca con una diferencia de prioridades que no es cultural sino estructural. En IT el orden es confidencialidad, integridad y disponibilidad; en OT es exactamente el inverso, porque una parada tiene consecuencias físicas inmediatas. Por eso el reflejo de IT de parchear el martes por la noche no cabe en una planta donde el controlador de un horno no se reinicia sin planificar una parada de producción con semanas de antelación.\n\nEl modelo de referencia sigue siendo la segmentación por niveles de Purdue, con una zona desmilitarizada industrial entre la red de planta y la corporativa. La regla práctica: ningún equipo de la red corporativa habla directamente con un PLC, y los datos se publican hacia arriba desde la DMZ, no se extraen desde arriba. Donde más fricción aparece es en la gestión de accesos remotos de proveedores, que históricamente se resolvía con un módem o un TeamViewer instalado por el integrador y olvidado durante años.',
    errores: [
      {
        titulo: 'Aplicar la política de parcheo de IT sin adaptarla',
        detalle:
          'Un parche automático que reinicia un equipo en mitad de un lote puede costar mucho más que la vulnerabilidad que corrige. En OT los parches se planifican con las paradas de producción y se prueban antes en un entorno equivalente.',
      },
      {
        titulo: 'Dejar accesos remotos de proveedores sin control',
        detalle:
          'Herramientas de escritorio remoto instaladas por integradores y nunca revocadas son una de las puertas de entrada más habituales. El acceso debe ser nominal, temporal, registrado y revocable, y pasar siempre por la DMZ industrial.',
      },
      {
        titulo: 'Escanear la red OT con herramientas de IT',
        detalle:
          'Un escaneo agresivo de puertos puede tumbar PLC antiguos que no toleran tráfico inesperado. En OT se usan herramientas de descubrimiento pasivo, que observan el tráfico sin inyectar nada.',
      },
    ],
    faq: [
      {
        q: '¿Por qué no se puede gestionar la red OT igual que la de IT?',
        a: 'Porque las prioridades se invierten. En IT manda la confidencialidad; en OT, la disponibilidad y la seguridad física. Además los equipos industriales tienen ciclos de vida de quince o veinte años, protocolos sin cifrado y ventanas de mantenimiento muy limitadas.',
      },
      {
        q: '¿Qué es el modelo Purdue?',
        a: 'Un modelo de referencia que organiza la arquitectura industrial en niveles, desde el proceso físico hasta los sistemas de negocio, con una zona desmilitarizada industrial que separa la red de planta de la corporativa. Es la base de casi todas las arquitecturas de segmentación OT.',
      },
      {
        q: '¿Cómo doy acceso remoto seguro a un proveedor?',
        a: 'A través de la DMZ industrial, con cuenta nominal y temporal, autenticación multifactor, sesión registrada y permisos limitados a los equipos concretos que debe tocar. Nunca con una herramienta instalada permanentemente y con credenciales compartidas.',
      },
    ],
  },

  'opc-ua': {
    enLaPractica:
      'OPC UA resuelve dos problemas que Modbus deja abiertos: describe los datos y los protege. Un cliente puede recorrer el espacio de direcciones de un servidor y descubrir qué variables existen, de qué tipo son y qué unidades tienen, sin que nadie le pase una tabla de registros. Y la seguridad forma parte del protocolo, con certificados, firma y cifrado. Por eso es el estándar de referencia en proyectos nuevos de Industria 4.0.\n\nEsa riqueza tiene un coste. Un servidor OPC UA consume bastante más recursos que un esclavo Modbus, y la gestión de certificados es el punto donde más proyectos se atascan: cliente y servidor deben confiarse mutuamente, y un certificado caducado corta la comunicación sin previo aviso. Conviene anotar las fechas de vencimiento junto al resto del mantenimiento preventivo. Para telemetría a gran escala, el perfil PubSub sobre MQTT resulta más eficiente que el modelo cliente-servidor clásico.',
    errores: [
      {
        titulo: 'Desactivar la seguridad para que funcione',
        detalle:
          'Ante el primer problema de certificados es tentador cambiar el modo a None. Con eso se renuncia justo a lo que distingue a OPC UA de Modbus, y queda un canal sin autenticar sobre el que se puede escribir. La solución es configurar la confianza mutua correctamente.',
      },
      {
        titulo: 'Olvidar la caducidad de los certificados',
        detalle:
          'Un certificado vencido interrumpe la comunicación de forma repentina y sin causa aparente. Las fechas de renovación deben estar en el plan de mantenimiento, igual que un cambio de filtro.',
      },
      {
        titulo: 'Sondear en lugar de suscribirse',
        detalle:
          'OPC UA permite suscripciones que notifican solo cuando el valor cambia. Programar un sondeo cíclico de miles de variables desperdicia ancho de banda y carga el servidor sin necesidad.',
      },
    ],
    faq: [
      {
        q: '¿Qué ventaja tiene OPC UA sobre Modbus?',
        a: 'Describe los datos —el cliente descubre qué variables hay, de qué tipo y con qué unidades, sin tabla de registros externa— e incluye seguridad nativa con certificados, firma y cifrado. Modbus no ofrece ninguna de las dos cosas, aunque es más ligero y universal.',
      },
      {
        q: '¿OPC UA es seguro por defecto?',
        a: 'Ofrece los mecanismos, pero hay que configurarlos. Si se despliega con el modo de seguridad en None, el canal queda sin autenticar ni cifrar. La seguridad real depende de gestionar bien los certificados y la confianza entre cliente y servidor.',
      },
      {
        q: '¿Qué es OPC UA PubSub?',
        a: 'Un modelo de publicación y suscripción, habitualmente sobre MQTT o UDP, alternativo al clásico cliente-servidor. Escala mucho mejor para telemetría con muchos emisores y consumidores, que es el caso típico de un despliegue IIoT.',
      },
    ],
  },

  'poka-yoke': {
    enLaPractica:
      'Un poka-yoke bien hecho hace que el error sea imposible, no improbable. La jerarquía es clara: lo mejor es que la pieza no encaje si está mal orientada, porque entonces no hace falta ni detectar ni avisar; después viene detectar el error y detener el proceso; y en último lugar, avisar al operario. Un cartel que dice "verificar orientación" no es un poka-yoke, es una esperanza. Los mejores suelen ser mecánicos, baratos y no fallan: un pin asimétrico, un rebaje que solo admite una posición.\n\nCuando la geometría no permite resolverlo así, se recurre a la detección: un sensor que confirma la presencia del tornillo antes de habilitar el siguiente paso, una balanza que verifica que la bolsa lleva las cuatro piezas, un lector que compara el código de la etiqueta con el de la orden. La clave es que la comprobación bloquee el avance del proceso. Si solo enciende una luz que se puede ignorar, el defecto sigue pasando cuando hay prisa, que es justo cuando más ocurren.',
    errores: [
      {
        titulo: 'Confundir un aviso con un poka-yoke',
        detalle:
          'Una etiqueta, un cartel o una luz que el operario puede ignorar no impiden el error. El dispositivo debe bloquear el avance o hacer físicamente imposible la operación incorrecta.',
      },
      {
        titulo: 'Diseñarlo sin quien hace el trabajo',
        detalle:
          'Un poka-yoke incómodo se acaba puenteando: se calza el sensor, se desmonta la guía. Quien opera la máquina sabe dónde ocurre el error y qué solución es tolerable; sin esa participación, el dispositivo dura semanas.',
      },
      {
        titulo: 'No verificar que sigue funcionando',
        detalle:
          'Un sensor desalineado o un tope suelto dejan de proteger sin que nadie lo note, porque la ausencia de defectos se confunde con que todo va bien. La comprobación periódica del propio poka-yoke debe estar en el plan de mantenimiento.',
      },
    ],
    faq: [
      {
        q: '¿Qué es exactamente un poka-yoke?',
        a: 'Un dispositivo o diseño que impide que un error se convierta en defecto. En su forma ideal hace imposible la operación incorrecta —una pieza que solo encaja en una orientación—; en su forma más común, detecta el error y detiene el proceso antes de que avance.',
      },
      {
        q: '¿Un poka-yoke tiene que ser electrónico?',
        a: 'Al contrario: los mejores suelen ser mecánicos y muy baratos. Un pin asimétrico, una guía o un rebaje que solo admiten una posición no se estropean, no necesitan calibración y no se pueden ignorar.',
      },
      {
        q: '¿Cómo sé si mi poka-yoke funciona?',
        a: 'Probándolo a propósito: se intenta cometer el error de forma deliberada y se comprueba que el dispositivo lo impide o detiene el proceso. Esa verificación debe repetirse periódicamente, porque un sensor desalineado deja de proteger sin dar ninguna señal.',
      },
    ],
  },
};

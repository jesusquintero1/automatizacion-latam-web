---
titulo: "Sakana AI entrena redes neuronales sin retropropagación"
resumen: "Sakana AI presenta Error Diffusion, un método para entrenar redes neuronales que respeta el principio de Dale (compatibilidad biológica) sin usar retropropagación. Alcanza 96.7% en MNIST y 61.7% en CIFAR-10 mediante enrutamiento modular de errores."
porQueImporta: "Este avance abre caminos hacia sistemas de inteligencia artificial más alineados con mecanismos biológicos, lo que podría derivar en modelos más eficientes energéticamente para dispositivos edge y aplicaciones de control en plantas de manufactura latinoamericanas."
categoria: "Inteligencia Artificial"
imagen: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Simplified_neural_network_training_example.svg"
imagen_atribucion: "Foto: Mikael Häggström, M.D. Author info - Reusing images- Conflicts of interest: None Mikael Häggström, M.D. · Openverse · CC0 (dominio público)"
imagen_fuente: "Openverse"
fuente:
  nombre: "MarkTechPost"
  url: "https://www.marktechpost.com/2026/07/17/sakana-ais-error-diffusion-trains-dale-compliant-dual-stream-networks-reaching-96-7-mnist-and-61-7-cifar-10-without-backpropagation/"
fecha: 2026-07-18T06:32:43Z
tags:
  - "ia-biologica"
  - "redes-neuronales"
  - "error-diffusion"
  - "aprendizaje-sin-retropropagacion"
  - "principio-dale"
---

## El problema de la retropropagación en circuitos biológicos

Durante décadas, la retropropagación ha sido el algoritmo dominante para entrenar redes neuronales profundas. Sin embargo, existe una limitación fundamental: requiere el transporte de pesos (weight transport), un mecanismo que los circuitos biológicos del cerebro no parecen implementar. Las neuronas reales no tienen forma de comunicar cambios de peso hacia atrás a través de las sinapsis de la manera que la retropropagación demanda. Este desajuste entre la biología y los algoritmos de aprendizaje artificial ha motivado durante años la búsqueda de alternativas más plausibles desde el punto de vista neurocientífico.

Sakana AI, laboratorio de investigación japonés especializado en inteligencia artificial inspirada en la biología, ha propuesto una solución elegante a este problema. Su nuevo método, denominado Error Diffusion, logra entrenar redes neuronales complejas sin depender de la retropropagación tradicional, manteniendo al mismo tiempo compatibilidad con principios biológicos reales.

## El principio de Dale y las redes de doble flujo

Un principio central en neurociencia es el de Dale, que establece que cada neurona es o bien excitadora (acelera la activación de sus neuronas objetivo) o bien inhibidora (la frena), pero no ambas simultáneamente. Este es un hecho observable en circuitos biológicos reales: las neuronas glutamatérgicas excitan, las GABAérgicas inhiben, sin mezcla.

Error Diffusion aprovecha esta estructura biológica para construir redes de doble flujo (dual-stream networks) donde cada neurona mantiene una naturaleza fija: excitadora o inhibidora. El algoritmo propuesto logra entrenar estas redes respetando el principio de Dale, algo que métodos anteriores no alcanzaban de manera satisfactoria. La arquitectura resultante es más cercana a la realidad neurobiológica, lo que abre la puerta a simulaciones e implementaciones más realistas.

## Funcionamiento técnico: enrutamiento modular de errores

El mecanismo central de Error Diffusion es el enrutamiento modular de errores. En lugar de propagar gradientes hacia atrás de forma monolítica, el algoritmo descompone el error en componentes modulares que fluyen a través de diferentes rutas de la red. Este enfoque permite que los errores se difundan sin requerir la sincronización global y el transporte de información que caracteriza a la retropropagación.

La clave está en cómo se estructura este enrutamiento: el error se desglosa en señales que respetan la separación excitadora/inhibidora impuesta por Dale. Cada componente del error se enruta a través de neuronas inhibidoras o excitadoras según corresponda, manteniendo la coherencia biológica del sistema. Este diseño no solo es más plausible neurobiológicamente, sino que también reduce la cantidad de comunicación bilateral que la red debe mantener.

## Resultados experimentales: de MNIST a CIFAR-10

Los resultados experimentales demuestran la viabilidad práctica del método. En el conjunto de datos MNIST (dígitos escritos a mano, tarea relativamente simple), Error Diffusion alcanza una precisión del 96.7%, comparable a métodos tradicionales. Más impresionante aún es su desempeño en CIFAR-10 (clasificación de 10 clases de objetos comunes), donde logra 61.7% de precisión.

Aunque estos números pueden parecer modestos respecto a sistemas de última generación que superan el 99% en MNIST y el 99%+ en CIFAR-10 con redes convolucionales modernas, el contexto importa: se trata de redes que respetan estrictamente el principio de Dale, sin retropropagación tradicional, y aún así alcanzan rendimientos útiles. Los investigadores también demostraron que el método escala a tareas de aprendizaje reforzado, sugiriendo versatilidad más allá de clasificación supervisada.

## Ablaciones dependientes de la tarea y revelaciones clave

La investigación incluye ablaciones sistemáticas donde se desactivan o modifican componentes específicos del algoritmo para entender qué contribuye al rendimiento. Estos experimentos ablatorios dependientes de la tarea revelan que ciertos aspectos del enrutamiento modular son críticos para MNIST pero menos para CIFAR-10, y viceversa. Esto sugiere que el método es adaptable: diferentes aplicaciones pueden beneficiarse de configuraciones particulares del algoritmo.

Estos hallazgos son particularmente valiosos porque permiten optimizar Error Diffusion para dominios específicos, desde percepción visual hasta control de robótica, ajustando qué componentes se enfatizan según la naturaleza del problema.

## Implicaciones para manufactura y control industrial en LatAm

Desde una perspectiva industrial, este avance tiene implicaciones prácticas significativas. Los sistemas de control y visión de máquina en plantas de manufactura requieren algoritmos eficientes en términos energéticos, especialmente cuando se desean desplegar en dispositivos edge o gateways con restricciones de potencia. Un algoritmo de aprendizaje que no requiere retropropagación tradicional puede ser más sencillo de implementar en hardware especializado de bajo consumo.

Además, la compatibilidad biológica abre la puerta a implementaciones neuromórficas, donde se utilizan chips analógicos o digitales de baja potencia inspirados en la estructura del cerebro. Para plantas en regiones donde la energía es crítica o cara, esto podría traducirse en sistemas de IA más económicos.

## Perspectivas futuras y vigilancia del sector

A medida que métodos como Error Diffusion maduren, esperamos ver su integración en frameworks de aprendizaje automático estándar, similar a cómo PyTorch y TensorFlow han democratizado la retropropagación. La brecha aún existe: el rendimiento en tareas complejas (imágenes de alta resolución, lenguaje natural) sigue siendo inferior al de redes tradicionales.

La comunidad de investigación continuará refinando estos algoritmos biológicamente plausibles. Para ingenieros latinoamericanos involucrados en automatización, mantener la vista en estos desarrollos es prudente, ya que podrían catalizar una nueva generación de sistemas de control e IA más eficientes y adaptables a las realidades de plantas en contextos de recursos limitados.

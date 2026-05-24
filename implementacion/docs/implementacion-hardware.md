# Implementación hardware

## Introducción

La parte hardware de **VigiaSenior** se ha planteado como una aproximación funcional y didáctica al comportamiento de un pastillero inteligente. No se pretende desarrollar un dispositivo industrial completo, sino disponer de un soporte físico o simulado que permita al alumnado comprender la relación entre el dispositivo y el backend.

Por este motivo, la implementación hardware se ha simplificado y orientado a la exploración de eventos, estados y flujos de interacción.

## Objetivo de la parte hardware

La finalidad principal del hardware dentro del proyecto es:

- simular o registrar aperturas de cajitas;
- permitir la confirmación de una toma;
- ofrecer señales visuales y acústicas básicas;
- enviar eventos al backend o reproducir el flujo localmente;
- servir como recurso de apoyo para comprender la lógica del sistema.

En consecuencia, el protagonismo del proyecto sigue estando en el **backend**, no en la electrónica.

## Placa y entorno de trabajo

La implementación se ha apoyado en una placa **Arduino Nano ESP32** o, en el caso de simulación, en una placa virtual equivalente en entornos como **Wokwi**.

Esta elección permite:

- conectividad Wi‑Fi;
- facilidad de programación;
- disponibilidad de simulación;
- integración sencilla con una API REST.

## Componentes principales del prototipo

La versión planteada del prototipo utiliza los siguientes elementos:

- 6 pulsadores o sensores para simular la apertura de 6 cajitas;
- 6 LEDs de estado;
- 1 botón de confirmación;
- 1 buzzer;
- cableado básico y placa de pruebas;
- conexión Wi‑Fi en la versión integrada con backend.

## Mapeo de pines

El mapeo adoptado para el prototipo es el siguiente:

- **D1–D6** → sensores o pulsadores de las cajitas;
- **D7–D12** → LEDs asociados a las cajitas;
- **A0** → botón de confirmación;
- **A1** → buzzer.

Este mapeo se ha mantenido fijo para facilitar la relación entre documentación, sketches y pruebas.

## Funcionamiento esperado

El comportamiento básico del prototipo es el siguiente:

1. se activa una toma programada;
2. el sistema indica visual o acústicamente la necesidad de realizar la toma;
3. el usuario abre la cajita correspondiente;
4. el sistema registra la apertura;
5. el usuario confirma la toma mediante el botón;
6. el backend o la lógica local determinan si la toma es correcta.

## Modos de trabajo

La implementación hardware se ha contemplado en dos modos principales.

### 1. Modo sin backend
En este modo, el prototipo funciona de forma local y permite explorar:

- activación de una toma;
- apertura correcta o incorrecta;
- confirmación;
- timeout;
- comportamiento de LEDs y buzzer;
- salida por monitor serie.

Este modo resulta útil para pruebas iniciales, sesiones exploratorias y actividades del alumnado sin dependencia de red ni servidor.

### 2. Modo con backend
En este modo, el dispositivo se conecta por Wi‑Fi y envía eventos al backend.

Los eventos principales que se manejan son:

- `device_online`
- `heartbeat`
- `box_opened`
- `dose_confirmed`

Este modo permite comprobar la integración real entre dispositivo y backend.

## Simulación virtual

Además del montaje físico, el proyecto contempla simulaciones en **Wokwi**, con el fin de:

- facilitar la exploración por parte del alumnado;
- evitar depender exclusivamente del hardware real;
- reproducir el comportamiento del sistema desde un navegador;
- experimentar con sensores, LEDs, buzzer y eventos.

La simulación se considera especialmente útil en contextos de aula donde no todos los equipos dispongan del prototipo físico completo.

## Relación con el backend

La parte hardware está subordinada a la lógica general del backend. Es decir, el dispositivo no decide por sí mismo cuándo una toma es correcta, sino que:

- detecta interacciones;
- registra o envía eventos;
- consulta la planificación diaria;
- delega en el backend la interpretación funcional de dichos eventos.

Esta decisión es importante porque mantiene el foco del proyecto en la capa servidor.

## Valor didáctico

La implementación hardware aporta valor al proyecto por varias razones:

- da contexto real al backend;
- favorece la comprensión del enfoque IoT;
- permite visualizar eventos y respuestas del sistema;
- incrementa la motivación del alumnado;
- refuerza la relación entre software, datos y comportamiento físico.

## Conclusión

La parte hardware de **VigiaSenior** se ha concebido como un recurso de apoyo técnico y didáctico, no como un fin en sí mismo. Su presencia en el proyecto sirve para contextualizar el backend, enriquecer la experiencia de aprendizaje y aportar una dimensión práctica al desarrollo de la API y de la lógica de negocio.

# Diagramas del proyecto

## Introducción

Los diagramas constituyen un recurso de apoyo fundamental dentro de **VigiaSenior**, ya que permiten representar de forma visual aspectos que, explicados únicamente con texto, resultarían menos claros para el alumnado y para el profesorado.

Su función principal es facilitar la comprensión global del sistema, apoyar la documentación técnica y reforzar la transferibilidad del proyecto.

## Tipos de diagramas utilizados o recomendados

Dentro del proyecto se consideran especialmente útiles los siguientes tipos de diagramas.

### 1. Diagrama general de arquitectura
Representa la relación entre los bloques principales del sistema:

- dispositivo físico o simulado;
- backend;
- base de datos;
- panel o frontend;
- profesorado y alumnado como agentes de trabajo y consulta.

Este diagrama permite entender rápidamente la estructura general del proyecto.

### 2. Diagrama de flujo funcional
Muestra el recorrido de una toma desde que se activa hasta que se resuelve.

Puede incluir pasos como:

1. consulta del plan del día;
2. activación de una toma;
3. apertura de cajita;
4. confirmación;
5. validación de la toma;
6. generación de alerta si procede.

Este tipo de diagrama es especialmente útil para explicar la lógica de negocio.

### 3. Diagrama de dominio o modelo lógico
Representa las entidades principales del sistema y sus relaciones:

- paciente;
- cuidador;
- dispositivo;
- plan de medicación;
- toma programada;
- evento;
- alerta.

Sirve como apoyo al diseño de la base de datos y de la API.

### 4. Esquema de conexión del prototipo
Muestra de forma visual la relación entre:

- pulsadores;
- LEDs;
- botón de confirmación;
- buzzer;
- placa base.

Este diagrama facilita la comprensión del montaje físico y del paralelismo entre simulación y hardware real.

## Función didáctica de los diagramas

Los diagramas cumplen una función importante dentro de la propuesta didáctica porque:

- ayudan a reducir la complejidad inicial;
- permiten una visión global del sistema;
- facilitan la explicación en clase;
- refuerzan la documentación técnica;
- mejoran la comprensión del alumnado;
- enriquecen la presentación oral final.

## Relación con el repositorio

Los diagramas del proyecto pueden aparecer en distintos lugares del repositorio:

- en el `README.md`, como apoyo visual inicial;
- en `implementacion/docs/`, como parte de la documentación técnica;
- en `presentacion/`, como recurso para la defensa oral;
- en `assets/`, como material gráfico reusable.

## Recomendaciones de uso

Para que los diagramas resulten realmente útiles, conviene que:

- sean claros y legibles;
- mantengan coherencia con los nombres usados en el código y la documentación;
- no intenten mostrar demasiada información a la vez;
- se usen como apoyo a la explicación, no como sustituto del análisis.

## Conclusión

En un proyecto como **VigiaSenior**, los diagramas no tienen solo un valor estético, sino también organizativo, explicativo y didáctico. Constituyen un puente entre la parte curricular y la parte técnica, y ayudan a que el repositorio sea más comprensible, reutilizable y defendible.

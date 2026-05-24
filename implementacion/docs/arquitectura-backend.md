# Arquitectura del backend

## Introducción

El backend de **VigiaSenior** se ha diseñado como una aplicación web en entorno servidor orientada a la gestión de un sistema IoT sencillo para el seguimiento de la medicación en personas mayores. Su finalidad es recibir eventos del dispositivo, consultar la planificación de tomas, actualizar estados, generar alertas y ofrecer información estructurada a un panel o frontend.

La arquitectura se ha planteado buscando claridad, mantenibilidad y separación de responsabilidades, de manera que el alumnado pueda comprender con facilidad el flujo interno de la aplicación y trabajar sobre él de forma progresiva.

## Objetivos de la arquitectura

La arquitectura adoptada persigue los siguientes objetivos:

- separar la lógica de presentación de la lógica de negocio;
- aislar el acceso a datos de la capa de aplicación;
- facilitar la validación de entradas y el control de errores;
- permitir la evolución progresiva del proyecto sin necesidad de rehacer toda la estructura;
- mantener una organización coherente con los resultados de aprendizaje del módulo.

## Estructura general por capas

El backend se organiza siguiendo una estructura por capas, en la que cada bloque cumple una función concreta.

### 1. Capa de rutas
La capa de rutas define los endpoints disponibles y dirige cada petición al controlador correspondiente.

Sus funciones principales son:

- declarar las rutas HTTP;
- asociar cada endpoint con su controlador;
- mantener una entrada clara a la API.

### 2. Capa de controladores
Los controladores reciben la petición, extraen parámetros, llaman a los servicios y construyen la respuesta HTTP.

Sus responsabilidades son:

- leer parámetros de ruta, query o body;
- delegar la lógica real en la capa de servicios;
- devolver respuestas consistentes;
- propagar errores al sistema de manejo global.

### 3. Capa de servicios
La capa de servicios contiene la lógica de negocio principal del sistema.

Aquí se sitúan aspectos como:

- validación funcional de operaciones;
- reglas de actualización de tomas;
- interpretación de eventos del dispositivo;
- generación y resolución de alertas;
- construcción de respuestas de dashboard.

### 4. Capa de repositorios
Los repositorios encapsulan el acceso a la base de datos.

Sus funciones son:

- consultar entidades;
- crear, actualizar o eliminar registros;
- aislar Prisma o la tecnología de persistencia del resto de capas.

### 5. Capa de validación y tipos
El sistema incorpora validaciones de entrada y tipos auxiliares para garantizar mayor consistencia.

Se emplean principalmente para:

- validar payloads de eventos;
- validar parámetros esperados;
- definir estructuras de respuesta;
- reducir errores de tipado durante el desarrollo.

## Entidades principales del dominio

El backend trabaja sobre un conjunto de entidades mínimas que estructuran el proyecto:

- **Patient**: paciente asociado al sistema.
- **Caregiver**: cuidador o familiar responsable.
- **Device**: dispositivo físico o simulado.
- **MedicationPlan**: plan general de medicación.
- **DoseSchedule / ScheduledDose**: programación concreta de tomas.
- **DeviceEvent**: evento recibido desde el dispositivo.
- **Alert**: aviso generado por incidencias en las tomas.

Estas entidades permiten representar tanto la parte estructural del sistema como el flujo dinámico derivado de la interacción con el pastillero.

## Flujo general de funcionamiento

El flujo principal del backend puede resumirse del siguiente modo:

1. el dispositivo consulta el plan del día;
2. el backend devuelve la información de las tomas programadas;
3. el dispositivo registra eventos como apertura de cajita o confirmación;
4. el backend interpreta esos eventos;
5. se actualiza el estado de la toma correspondiente;
6. si procede, se genera una alerta;
7. el frontend consulta dashboard, tomas y alertas.

## Regla principal de negocio

La regla central del proyecto es la siguiente:

> Una toma solo se considera correcta cuando existe **apertura + confirmación** dentro de una ventana de tiempo configurable.

Esto implica que el backend no se limita a guardar eventos, sino que debe interpretarlos dentro de una lógica temporal y funcional.

## Manejo de errores

El backend incorpora un sistema básico de manejo de errores con el fin de mantener respuestas comprensibles y coherentes.

Se contemplan, entre otros, casos como:

- dispositivo inexistente;
- paciente inexistente;
- alerta inexistente;
- payload inválido;
- intento de resolver una alerta ya resuelta;
- falta de información requerida.

## Ventajas de esta arquitectura

La arquitectura adoptada resulta adecuada para el proyecto por varias razones:

- facilita el aprendizaje del alumnado;
- permite trabajar por capas y responsabilidades;
- mejora la legibilidad del código;
- favorece las pruebas y la depuración;
- mantiene una separación clara entre acceso a datos, lógica y respuesta HTTP.

## Conclusión

La arquitectura del backend de **VigiaSenior** responde a una lógica didáctica y técnica al mismo tiempo. No se ha buscado una solución compleja, sino una estructura suficientemente sólida como para soportar el proyecto, facilitar el desarrollo por parte del alumnado y servir como base comprensible y reutilizable para futuras adaptaciones.

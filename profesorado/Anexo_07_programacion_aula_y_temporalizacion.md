# Anexo · Secuenciación por sesiones del proyecto VigiaSenior

## Introducción

Este anexo complementa el documento `07_programacion_aula_y_temporalizacion.md` y concreta la propuesta didáctica del proyecto **VigiaSenior** a nivel de sesiones. Su finalidad es facilitar la aplicación directa de la programación de aula por parte de otro docente, detallando qué se trabaja en cada sesión, qué productos se esperan y qué relación guarda cada bloque con la evaluación del proyecto.

La propuesta se organiza en **10 sesiones**, planteadas para desarrollarse dentro del módulo **Desarrollo web en entorno servidor** del CFGS de **Desarrollo de Aplicaciones Web**, manteniendo como eje una única situación de aprendizaje diseñada en forma de proyecto: el desarrollo del backend de un pastillero inteligente orientado al seguimiento de la medicación en personas mayores.

## Criterios generales de la secuenciación

La secuenciación responde a una lógica progresiva:

- comprensión del problema y del contexto;
- análisis funcional;
- modelado del dominio y de los datos;
- diseño de la API;
- implementación del backend;
- integración con simulación o hardware;
- documentación y defensa final.

Se trata, por tanto, de una propuesta coherente con una metodología de **Aprendizaje Basado en Proyectos**, donde cada sesión contribuye a la construcción gradual del producto final y genera evidencias útiles para la evaluación.

---

## Sesión 1. Presentación del reto y contextualización

**Objetivo principal:** introducir el proyecto, su sentido didáctico y el problema real que pretende resolver.

**Contenidos y actividades:**
- presentación del proyecto VigiaSenior;
- explicación del contexto social: seguimiento de la medicación en personas mayores;
- relación del proyecto con el módulo 0613;
- presentación de la estructura general del repositorio;
- explicación del producto final esperado.

**Agrupamiento:** grupo clase y creación inicial de equipos.

**Recursos:**
- README del proyecto;
- portada y diagrama general;
- materiales introductorios del profesorado.

**Producto o evidencia:**
- comprensión inicial del reto;
- formación de equipos y reparto provisional de roles.

**Instrumentos de evaluación:**
- observación directa;
- participación en la sesión;
- registro inicial de comprensión del proyecto.

---

## Sesión 2. Análisis funcional del sistema

**Objetivo principal:** identificar actores, eventos, reglas de negocio y necesidades del sistema.

**Contenidos y actividades:**
- identificación de actores: paciente, cuidador, dispositivo, backend;
- análisis del flujo general del sistema;
- definición de qué se entiende por toma correcta;
- identificación de estados de una toma;
- detección de posibles alertas.

**Agrupamiento:** trabajo por equipos.

**Recursos:**
- plantilla de análisis funcional;
- dossier del proyecto;
- enunciado del reto.

**Producto o evidencia:**
- análisis funcional inicial del sistema;
- listado de requisitos mínimos.

**Instrumentos de evaluación:**
- revisión del análisis funcional;
- observación del trabajo cooperativo;
- feedback del profesorado.

---

## Sesión 3. Modelo de dominio y estructura de datos

**Objetivo principal:** traducir el análisis funcional a entidades, relaciones y estructura de datos.

**Contenidos y actividades:**
- diseño del dominio del proyecto;
- identificación de entidades principales;
- relaciones entre paciente, dispositivo, plan, toma, evento y alerta;
- discusión sobre estados y trazabilidad de la información.

**Agrupamiento:** trabajo por equipos con puesta en común final.

**Recursos:**
- plantilla de modelo de datos;
- tabla de relación RA/CE;
- documentación curricular.

**Producto o evidencia:**
- borrador del modelo de dominio;
- esquema lógico inicial de datos.

**Instrumentos de evaluación:**
- revisión del modelo de datos;
- rúbrica parcial de diseño;
- observación del razonamiento técnico.

---

## Sesión 4. Diseño de la API REST

**Objetivo principal:** definir los endpoints mínimos y las estructuras de intercambio de información.

**Contenidos y actividades:**
- definición de endpoints para dispositivo y frontend;
- diseño de rutas, parámetros y cuerpos de petición;
- definición de respuestas esperadas;
- elaboración de ejemplos JSON;
- discusión sobre errores y validaciones.

**Agrupamiento:** trabajo por equipos.

**Recursos:**
- plantilla de diseño de API;
- documentación técnica del proyecto;
- prompts de apoyo, si se considera oportuno.

**Producto o evidencia:**
- documento de API mínima;
- contrato inicial entre backend y dispositivo.

**Instrumentos de evaluación:**
- revisión del diseño de la API;
- observación del trabajo de equipo;
- corrección guiada en clase.

---

## Sesión 5. Estructura del backend y preparación del entorno

**Objetivo principal:** preparar la base técnica del proyecto y dejar lista la estructura inicial del backend.

**Contenidos y actividades:**
- organización de carpetas;
- explicación de rutas, controladores, servicios y repositorios;
- configuración inicial del proyecto;
- revisión del esquema de base de datos;
- puesta en marcha del entorno local.

**Agrupamiento:** trabajo por equipos.

**Recursos:**
- estructura base del backend;
- documentación de arquitectura;
- Visual Studio Code;
- Node.js y entorno de desarrollo.

**Producto o evidencia:**
- esqueleto del backend preparado;
- entorno funcional en local.

**Instrumentos de evaluación:**
- observación del progreso;
- revisión de estructura;
- comprobación funcional mínima.

---

## Sesión 6. Persistencia y consulta del plan del día

**Objetivo principal:** implementar la parte de persistencia básica y la consulta de planificación diaria.

**Contenidos y actividades:**
- implementación del modelo de datos;
- conexión con la base de datos;
- carga inicial de datos de prueba;
- desarrollo del endpoint de planificación diaria;
- validación de respuestas.

**Agrupamiento:** trabajo por equipos.

**Recursos:**
- backend base;
- gestor de base de datos;
- documentación de acceso a datos.

**Producto o evidencia:**
- persistencia operativa;
- endpoint `schedule/today` funcional.

**Instrumentos de evaluación:**
- revisión del código;
- comprobación práctica del endpoint;
- observación del proceso de desarrollo.

---

## Sesión 7. Registro de eventos del dispositivo

**Objetivo principal:** implementar la recepción y almacenamiento de eventos enviados por el dispositivo.

**Contenidos y actividades:**
- definición y validación del payload de eventos;
- registro de apertura de cajitas;
- registro de confirmación de tomas;
- revisión del flujo `box_opened` y `dose_confirmed`;
- trazabilidad de eventos en base de datos.

**Agrupamiento:** trabajo por equipos.

**Recursos:**
- documentación de API;
- esquemas del proyecto;
- simulación o ejemplos de payload.

**Producto o evidencia:**
- endpoint de eventos funcional;
- registro persistente de interacciones.

**Instrumentos de evaluación:**
- revisión técnica;
- pruebas manuales;
- lista de control de funcionamiento.

---

## Sesión 8. Lógica de negocio, alertas y dashboard

**Objetivo principal:** completar la interpretación de eventos y generar información útil para visualización y seguimiento.

**Contenidos y actividades:**
- aplicación de la regla apertura + confirmación;
- gestión de timeout de tomas;
- generación y resolución de alertas;
- construcción de respuesta para dashboard;
- revisión de casos correctos e incorrectos.

**Agrupamiento:** trabajo por equipos con contraste entre grupos.

**Recursos:**
- documentación de lógica de negocio;
- backend desarrollado en sesiones previas;
- ejemplos de casos de prueba.

**Producto o evidencia:**
- lógica principal implementada;
- dashboard y alertas disponibles.

**Instrumentos de evaluación:**
- revisión del comportamiento del sistema;
- rúbrica parcial de implementación;
- pruebas dirigidas.

---

## Sesión 9. Integración con simulación o hardware y pruebas

**Objetivo principal:** validar el sistema en un flujo completo, conectando la parte software con la parte física o simulada.

**Contenidos y actividades:**
- conexión con simulación Wokwi o prototipo físico;
- envío y recepción de eventos reales o simulados;
- revisión del flujo completo de una toma;
- detección de errores y ajustes;
- discusión sobre limitaciones del MVP.

**Agrupamiento:** trabajo por equipos y demostraciones breves.

**Recursos:**
- simulaciones;
- hardware del proyecto;
- monitor serie;
- backend operativo.

**Producto o evidencia:**
- integración funcional comprobada;
- registro de incidencias y mejoras.

**Instrumentos de evaluación:**
- observación práctica;
- checklist de validación;
- demostración de funcionamiento.

---

## Sesión 10. Documentación final y preparación de la defensa oral

**Objetivo principal:** cerrar el proyecto como propuesta transferible y preparar la presentación final.

**Contenidos y actividades:**
- revisión del repositorio;
- organización final de materiales de profesorado y alumnado;
- comprobación de documentación técnica y curricular;
- preparación del guion de defensa;
- ensayo de la exposición oral.

**Agrupamiento:** equipos de trabajo y ensayo final.

**Recursos:**
- repositorio completo;
- documentación técnica;
- guion de presentación;
- presentación visual.

**Producto o evidencia:**
- repositorio ordenado y revisado;
- defensa preparada;
- materiales finales listos para exposición.

**Instrumentos de evaluación:**
- revisión final del proyecto;
- rúbrica de presentación oral;
- observación del ensayo.

---

## Tabla resumen de sesiones

| Sesión | Bloque | Objetivo principal | Evidencia principal |
|---|---|---|---|
| 1 | Introducción | Presentar el reto y el contexto | comprensión inicial del proyecto |
| 2 | Análisis | Identificar actores, eventos y reglas | análisis funcional |
| 3 | Diseño | Definir dominio y datos | modelo lógico inicial |
| 4 | Diseño | Diseñar la API REST | documento de API |
| 5 | Implementación | Preparar el backend | estructura base funcional |
| 6 | Implementación | Persistencia y planificación | endpoint del plan del día |
| 7 | Implementación | Registrar eventos | endpoint de eventos |
| 8 | Implementación | Aplicar lógica y alertas | dashboard y alertas |
| 9 | Validación | Integrar y probar | prueba completa del sistema |
| 10 | Cierre | Documentar y preparar defensa | repositorio y exposición final |

---

## Observación final

Esta secuenciación puede adaptarse en función del ritmo del grupo, del número de horas semanales disponibles y del peso que se quiera dar a la parte técnica, documental o expositiva. No obstante, se considera una propuesta equilibrada y viable, al permitir desarrollar el proyecto de forma progresiva, generar evidencias evaluables en cada fase y preparar una presentación final coherente con la programación de aula diseñada.

# 5. BLOQUES DE UNIDADES DIDÁCTICAS, TEMPORALIZACIÓN Y RELACIÓN CON RA

## 5.1. Consideraciones previas y encaje dentro del módulo

La presente propuesta no pretende ocupar la totalidad del curso académico, sino concretarse en una **situación de aprendizaje basada en proyecto** integrada dentro del módulo **0613 · Desarrollo web en entorno servidor**, correspondiente al **2.º curso del CFGS de Desarrollo de Aplicaciones Web**.

La programación didáctica general del módulo establece una duración anual de **6 horas semanales**. Dentro de ese marco, la propuesta **VigiaSenior** se plantea como un bloque específico de trabajo intensivo de aproximadamente **20 horas de aula**, distribuido en **10 sesiones** agrupadas en **5 semanas**, con una dedicación aproximada de **2 sesiones semanales centradas específicamente en el proyecto**.

Esta decisión permite que la situación de aprendizaje:

- se integre de manera realista en la programación general del módulo;
- no invada la totalidad de los contenidos anuales;
- mantenga una carga de trabajo asumible;
- y permita relacionar el proyecto con resultados de aprendizaje, criterios de evaluación, metodología y evaluación continua.

## 5.2. Ubicación temporal dentro del curso y relación con el calendario

Tomando como referencia el calendario escolar y la programación del módulo, se considera adecuado ubicar la propuesta en el **segundo trimestre**, entre **mediados de enero y mediados de febrero**.

La elección de este tramo responde a varios motivos:

- evita el cierre del primer periodo de evaluación;
- deja margen suficiente antes del tramo más próximo a la **AV2**;
- permite desarrollar un proyecto completo sin solaparse con el cierre final del curso;
- y favorece que el alumnado tenga ya una base previa del módulo sobre la que construir un producto más integrado.

La propuesta se distribuye de la siguiente manera:

- **Duración total estimada:** 20 horas de aula.
- **Número de sesiones o bloques de trabajo:** 10.
- **Distribución orientativa:** 5 semanas.
- **Ritmo recomendado:** 2 sesiones semanales.
- **Ubicación orientativa:** del 12 de enero al 13 de febrero.

Las fechas tienen carácter orientativo y pueden ajustarse levemente según el horario real del grupo, la disponibilidad del aula de informática, el ritmo del alumnado o la necesidad de dedicar más tiempo a alguna fase.

## 5.3. Relación con los bloques funcionales del proyecto

La propuesta puede integrarse dentro del módulo a través de cuatro grandes bloques de trabajo:

### Bloque 1. Análisis y diseño del sistema
Se centra en la comprensión del problema, el análisis funcional, la identificación de actores y eventos, la definición de la regla principal de negocio y la construcción del modelo de dominio.

### Bloque 2. Diseño de servicios y estructura del backend
Se orienta a la definición de la API REST, la organización de la arquitectura técnica y la preparación del entorno de desarrollo.

### Bloque 3. Implementación del backend
Incluye la persistencia de datos, la consulta del plan del día, el registro de eventos, la aplicación de la lógica de tomas, la generación de alertas y la elaboración del dashboard o consulta de seguimiento.

### Bloque 4. Validación, documentación y defensa
Comprende la integración con simulación o hardware, las pruebas, la revisión final del repositorio, la documentación y la preparación de la defensa oral.

## 5.4. Relación orientativa con resultados de aprendizaje

Dado el carácter aplicado e integrador del proyecto, esta situación de aprendizaje se vincula principalmente con los siguientes resultados de aprendizaje del módulo:

- **RA5**: desarrollo de servicios web y procesamiento de información en entorno servidor.
- **RA6**: acceso, gestión y persistencia de datos.
- **RA7**: programación de servicios y aplicaciones web con estructura coherente y documentada.
- **RA8**: uso de frameworks y tecnologías del servidor para aplicaciones dinámicas.
- **RA9**: integración de código, repositorios y servicios de información externos o heterogéneos, así como prueba, depuración y documentación.

La intensidad de esa relación no es idéntica en todas las sesiones, pero el conjunto del proyecto permite evidenciar varios criterios vinculados a estos resultados de aprendizaje.

## 5.5. Tabla general de temporalización

| Semana | Fechas orientativas | Sesiones | Bloque | Producto principal |
|---|---|---:|---|---|
| 1 | 12–16 enero | 1 y 2 | Análisis | comprensión del problema y análisis funcional |
| 2 | 19–23 enero | 3 y 4 | Diseño | modelo de datos y diseño de la API |
| 3 | 26–30 enero | 5 y 6 | Implementación inicial | estructura del backend, persistencia y primer endpoint |
| 4 | 2–6 febrero | 7 y 8 | Implementación funcional | eventos, lógica de tomas, alertas y consulta de estado |
| 5 | 9–13 febrero | 9 y 10 | Validación y cierre | pruebas, documentación, entrega y preparación de la defensa |

## 5.6. Hitos y entregas previstas

Para favorecer la evaluación continua y evitar que el proyecto dependa únicamente de la entrega final, se establecen tres hitos principales:

### Hito 1. Final de la semana 2
**Entrega prevista:**
- contextualización breve del problema;
- análisis funcional del sistema;
- modelo de dominio y estructura de datos;
- borrador razonado de la API REST.

### Hito 2. Final de la semana 4
**Entrega prevista:**
- backend base operativo;
- persistencia inicial y modelo de datos implementado;
- endpoints principales en funcionamiento;
- lógica básica de eventos y estados parcialmente integrada.

### Hito 3. Final de la semana 5
**Entrega prevista:**
- backend MVP funcional;
- pruebas manuales y/o automáticas básicas;
- integración con simulación o prototipo;
- documentación técnica;
- repositorio revisado;
- materiales de defensa preparados.

## 5.7. Desarrollo completo de las sesiones

A continuación se detalla el desarrollo de las diez sesiones de trabajo. En todas ellas se parte de un uso prioritario del **aula de informática**, con **ordenadores de aula**, **acceso a red local e Internet**, proyector o PDI cuando sea necesario, y el software habitual del módulo y del proyecto.

---

### Sesión 1. Presentación del reto y contextualización

**Finalidad de la sesión**  
Introducir la situación de aprendizaje, presentar el problema real que da sentido al proyecto y situar a alumnado y profesorado dentro del marco técnico y didáctico de VigiaSenior.

**Contenidos y foco de trabajo**
- Presentación del proyecto.
- Problema social de partida.
- Qué se espera del producto final.
- Qué se entiende por backend dentro del sistema.
- Relación entre dispositivo, backend, base de datos y panel de seguimiento.

**Actividades del profesorado**
- Presenta el reto y su sentido social.
- Explica la doble dimensión del proyecto: didáctica y técnica.
- Muestra la estructura general del repositorio.
- Aclara qué se va a desarrollar y qué no forma parte del alcance principal.
- Organiza equipos y orienta el reparto inicial de responsabilidades.

**Actividades del alumnado**
- Escucha activa y toma de notas.
- Lectura guiada del enunciado y del README del proyecto.
- Identificación inicial del problema a resolver.
- Formación o consolidación de equipos.
- Primer reparto de roles.

**Agrupamiento**
- Gran grupo al inicio.
- Pequeño grupo al final.

**Espacio y recursos**
- Aula de informática.
- Ordenadores.
- Proyector/PDI.
- Repositorio del proyecto.
- Documentación inicial del alumnado.

**Software o herramientas**
- Navegador web.
- GitHub.
- Visual Studio Code.
- PDF o Markdown del enunciado.

**Producto o evidencia**
- Comprensión inicial del proyecto.
- Registro del reparto de roles.
- Anotaciones de contexto y alcance.

**Instrumentos de evaluación**
- Observación directa.
- Lista de control inicial.
- Revisión de la participación y comprensión del reto.

---

### Sesión 2. Análisis funcional del sistema

**Finalidad de la sesión**  
Traducir el problema general a un análisis funcional básico: actores, eventos, flujo del sistema, regla de negocio principal y condiciones de uso.

**Contenidos y foco de trabajo**
- Actores del sistema.
- Eventos principales.
- Regla de negocio: apertura + confirmación dentro de ventana.
- Estados posibles de la toma.
- Alertas e incidencias.

**Actividades del profesorado**
- Guía la identificación de actores y eventos.
- Propone preguntas de análisis funcional.
- Corrige malentendidos de enfoque.
- Ayuda a distinguir entre problema real, dominio técnico y detalle de implementación.

**Actividades del alumnado**
- Completa la plantilla de análisis funcional.
- Identifica actores, entradas, salidas y decisiones del sistema.
- Define estados posibles de la toma.
- Explica con lenguaje natural qué se considera una toma correcta.

**Agrupamiento**
- Trabajo por equipos.
- Puesta en común final breve.

**Espacio y recursos**
- Aula de informática.
- Plantilla de análisis funcional.
- Repositorio.
- Pizarra o documento compartido.

**Software o herramientas**
- Navegador.
- Editor de texto o Markdown.
- Visual Studio Code.
- Herramienta colaborativa si se utiliza.

**Producto o evidencia**
- Análisis funcional inicial del proyecto.
- Documento de actores, eventos y reglas.

**Instrumentos de evaluación**
- Revisión del documento de análisis.
- Observación del proceso.
- Corrección oral guiada.

---

### Sesión 3. Modelo de dominio y estructura de datos

**Finalidad de la sesión**  
Transformar el análisis funcional en un modelo técnico inicial: entidades, relaciones, estados y estructura básica de la persistencia.

**Contenidos y foco de trabajo**
- Entidades del dominio.
- Relaciones principales.
- Traducción de reglas a datos persistentes.
- Estado de las tomas.
- Introducción al esquema real del proyecto.

**Actividades del profesorado**
- Explica cómo pasar del análisis al modelo de dominio.
- Presenta una propuesta de entidades mínimas.
- Orienta sobre claves, relaciones y sentido de los datos.
- Relaciona esta parte con la futura implementación en Prisma.

**Actividades del alumnado**
- Diseña su propio esquema del dominio.
- Revisa el modelo propuesto por el proyecto.
- Identifica relaciones clave entre paciente, dispositivo, toma, evento y alerta.
- Genera un primer diagrama o tabla de entidades.

**Agrupamiento**
- Equipos de trabajo.

**Espacio y recursos**
- Aula de informática.
- Esquemas de ejemplo.
- Documentación técnica del backend.
- Plantilla para modelo de datos.

**Software o herramientas**
- Visual Studio Code.
- Editor de diagramas, Draw.io o documento compartido.
- Navegador web.

**Producto o evidencia**
- Modelo de dominio o tabla de entidades.
- Primer documento de estructura de datos.

**Instrumentos de evaluación**
- Revisión del modelo de dominio.
- Lista de control sobre coherencia de entidades y relaciones.

---

### Sesión 4. Diseño de la API REST

**Finalidad de la sesión**  
Definir la comunicación entre el backend y el resto del sistema mediante una API mínima, clara y coherente.

**Contenidos y foco de trabajo**
- Concepto de API REST.
- Endpoints mínimos del proyecto.
- Métodos HTTP.
- Parámetros de ruta.
- Cuerpos JSON.
- Respuestas y errores.

**Actividades del profesorado**
- Presenta los endpoints mínimos del MVP.
- Explica diferencia entre endpoint, parámetro y body.
- Muestra ejemplos de request y response.
- Ayuda a acotar el contrato de la API.

**Actividades del alumnado**
- Redacta el documento de API del proyecto.
- Define cuerpo y respuesta para cada ruta principal.
- Relaciona cada endpoint con la necesidad funcional que resuelve.
- Propone posibles errores o validaciones esperables.

**Agrupamiento**
- Equipos.

**Espacio y recursos**
- Aula de informática.
- Documentación del backend.
- Plantilla de diseño de API.
- Proyector/PDI para ejemplos comunes.

**Software o herramientas**
- Visual Studio Code.
- Navegador.
- Editor Markdown.

**Producto o evidencia**
- Documento de API REST mínimo del proyecto.

**Instrumentos de evaluación**
- Revisión del documento de API.
- Comentario del profesorado.
- Observación del razonamiento técnico.

---

### Sesión 5. Preparación de la estructura del backend

**Finalidad de la sesión**  
Dejar preparado el entorno técnico del backend y comprender la arquitectura por capas del proyecto.

**Contenidos y foco de trabajo**
- Stack técnico real.
- Scripts del proyecto.
- Estructura de carpetas.
- Separación entre rutas, controladores, servicios, repositorios y validadores.
- Preparación del entorno local.

**Actividades del profesorado**
- Explica el stack real del backend.
- Muestra la función de cada carpeta.
- Guía la instalación y configuración básica.
- Resuelve incidencias de entorno.

**Actividades del alumnado**
- Clona o revisa el repositorio.
- Instala dependencias.
- Revisa `package.json`, `.env`, Prisma y scripts.
- Comprende la arquitectura por capas.
- Deja el entorno listo para ejecutar y modificar código.

**Agrupamiento**
- Equipos con apoyo individual cuando sea necesario.

**Espacio y recursos**
- Aula de informática.
- Ordenadores con terminal.
- Repositorio del proyecto.
- Acceso a Internet.

**Software o herramientas**
- Visual Studio Code.
- Terminal.
- Node.js y npm.
- Git y GitHub.

**Producto o evidencia**
- Entorno local preparado.
- Comprensión básica de la arquitectura del backend.

**Instrumentos de evaluación**
- Lista de control de entorno.
- Observación del montaje técnico.
- Comprobación funcional de arranque.

---

### Sesión 6. Persistencia y consulta del plan del día

**Finalidad de la sesión**  
Implementar o comprender la persistencia base y poner en marcha el endpoint de planificación diaria.

**Contenidos y foco de trabajo**
- Lectura del `schema.prisma`.
- Modo de trabajo con Prisma.
- Consulta de dosis programadas.
- Endpoint `schedule/today`.

**Actividades del profesorado**
- Explica el modelo de Prisma y su lectura.
- Muestra cómo se relaciona el dominio con la persistencia.
- Guía la implementación o revisión del endpoint.
- Revisa errores de consulta o tipado.

**Actividades del alumnado**
- Lee el schema y localiza las entidades necesarias.
- Revisa la consulta del plan del día.
- Comprueba la relación entre rutas, servicios y repositorios.
- Valida la respuesta JSON del endpoint.

**Agrupamiento**
- Equipos.

**Espacio y recursos**
- Aula de informática.
- Base de datos local del proyecto.
- Documentación técnica.
- Ejemplos de respuesta JSON.

**Software o herramientas**
- Visual Studio Code.
- Prisma.
- Terminal.
- Navegador o cliente HTTP.

**Producto o evidencia**
- Primer endpoint principal en funcionamiento.
- Persistencia básica comprendida y validada.

**Instrumentos de evaluación**
- Revisión del endpoint.
- Observación de la implementación.
- Primera comprobación funcional del backend.

---

### Sesión 7. Registro de eventos y flujo básico del sistema

**Finalidad de la sesión**  
Implementar o revisar la recepción de eventos enviados por el dispositivo o por la simulación y comprender su recorrido completo en el backend.

**Contenidos y foco de trabajo**
- Ruta de eventos.
- Validación del body.
- Tipos de eventos.
- Registro del evento en base de datos.
- Papel del controlador y del servicio.

**Actividades del profesorado**
- Explica la estructura de los eventos.
- Muestra cómo se valida el body.
- Revisa con el grupo el flujo ruta → controlador → servicio → repositorio.
- Ayuda a diferenciar entre eventos simples y eventos que modifican estado.

**Actividades del alumnado**
- Comprende y/o implementa la ruta `POST /api/devices/:deviceId/events`.
- Prueba eventos de tipo `box_opened` y `dose_confirmed`.
- Revisa la respuesta del backend.
- Comprueba qué datos quedan persistidos.

**Agrupamiento**
- Equipos.

**Espacio y recursos**
- Aula de informática.
- Backend en ejecución.
- Datos de prueba.
- Plantilla de eventos o ejemplos JSON.

**Software o herramientas**
- Visual Studio Code.
- Terminal.
- Postman o cliente equivalente.
- Prisma Studio, si se utiliza.

**Producto o evidencia**
- Registro funcional de eventos.
- Evidencia del flujo básico del sistema.

**Instrumentos de evaluación**
- Revisión práctica.
- Observación del trabajo en equipo.
- Lista de control funcional.

---

### Sesión 8. Lógica de negocio, alertas y dashboard

**Finalidad de la sesión**  
Aplicar la regla principal del sistema y construir la parte del backend que interpreta eventos, actualiza estados y genera alertas o consultas de seguimiento.

**Contenidos y foco de trabajo**
- Estados de toma.
- Ventana temporal de confirmación.
- Generación de alertas.
- Consulta de dashboard o de estado del paciente.

**Actividades del profesorado**
- Reexplica la regla de negocio principal.
- Ayuda a vincular eventos con cambios de estado.
- Orienta sobre la generación de alertas y la lógica asociada.
- Revisa la coherencia entre el modelo de datos y el comportamiento esperado.

**Actividades del alumnado**
- Implementa o revisa la lógica de cambio de estado.
- Comprueba cuándo una confirmación es válida o no.
- Genera alertas en casos de incumplimiento o incidencia.
- Prueba el endpoint de dashboard o de alertas.

**Agrupamiento**
- Equipos.

**Espacio y recursos**
- Aula de informática.
- Ordenadores.
- Proyector/PDI para puesta en común final.
- Casos de prueba preparados por el profesorado.

**Software o herramientas**
- Visual Studio Code.
- Postman.
- Terminal.
- Cliente Prisma o base de datos local.

**Producto o evidencia**
- Lógica funcional implementada o comprendida.
- Endpoint de alertas/dashboard operativo o parcialmente operativo.

**Instrumentos de evaluación**
- Revisión del comportamiento funcional.
- Comprobación de casos de prueba.
- Observación del razonamiento aplicado.

---

### Sesión 9. Integración con simulación o hardware y pruebas

**Finalidad de la sesión**  
Validar el sistema en un flujo de uso completo y comprobar que el backend responde correctamente ante eventos enviados desde simulación o desde el prototipo.

**Contenidos y foco de trabajo**
- Integración con simulación o dispositivo.
- Pruebas de flujo completo.
- Detección de errores.
- Registro de incidencias.

**Actividades del profesorado**
- Organiza la secuencia de pruebas.
- Facilita el acceso al prototipo o a la simulación.
- Supervisa la recogida de incidencias.
- Orienta sobre cómo documentar resultados de prueba.

**Actividades del alumnado**
- Ejecuta pruebas del flujo completo.
- Envía eventos desde la simulación o el hardware.
- Comprueba respuestas y cambios en la base de datos.
- Registra errores, incidencias y correcciones aplicadas.

**Agrupamiento**
- Equipos, con momentos de demostración compartida.

**Espacio y recursos**
- Aula de informática.
- Ordenadores.
- Prototipo o simulación.
- Conectividad local e Internet.
- Documentos de registro de incidencias.

**Software o herramientas**
- Postman.
- Terminal.
- Visual Studio Code.
- Si procede, Arduino IDE o entorno de carga del sketch.
- Herramientas del prototipo o simulación.

**Producto o evidencia**
- Prueba integral del sistema.
- Registro de incidencias y ajustes.

**Instrumentos de evaluación**
- Observación directa.
- Revisión de pruebas.
- Lista de control de validación funcional.

---

### Sesión 10. Documentación final y preparación de la defensa

**Finalidad de la sesión**  
Cerrar el proyecto como propuesta transferible, revisar el repositorio y organizar la defensa oral de forma coherente.

**Contenidos y foco de trabajo**
- Revisión final del repositorio.
- Documentación técnica.
- Materiales para profesorado y alumnado.
- Presentación oral y reparto de intervención.
- Ensayo final.

**Actividades del profesorado**
- Revisa la completitud del repositorio.
- Da feedback final sobre documentación, claridad y estructura.
- Orienta el guion oral y el reparto entre los miembros del grupo.
- Supervisa el ensayo de la defensa.

**Actividades del alumnado**
- Ordena y revisa el repositorio.
- Comprueba que la documentación está completa.
- Prepara el guion oral y la presentación.
- Ensaya la defensa del proyecto.

**Agrupamiento**
- Equipos.
- Puesta en común final en gran grupo si procede.

**Espacio y recursos**
- Aula de informática.
- Ordenadores.
- Proyector/PDI.
- Presentación.
- Repositorio final.

**Software o herramientas**
- Visual Studio Code.
- GitHub.
- Herramienta de presentación.
- Navegador.
- Recursos gráficos del proyecto.

**Producto o evidencia**
- Repositorio final revisado.
- Presentación preparada.
- Defensa estructurada y ensayada.

**Instrumentos de evaluación**
- Rúbrica de presentación oral.
- Lista de control de cierre.
- Revisión final de entregables.

## 5.8. Materiales comunes y recursos de aula

Con independencia de las necesidades específicas de cada sesión, la propuesta requiere una base común de recursos y materiales que se consideran realistas para el módulo:

### Espacios
- aula de informática;
- espacio ordinario del grupo, si se requiere para introducción o ensayo;
- zona de demostración para el prototipo o simulación, cuando proceda.

### Recursos materiales
- ordenadores del aula;
- proyector o PDI;
- red local e Internet;
- repositorio GitHub del proyecto;
- documentos y plantillas en formato digital;
- prototipo hardware o simulación del dispositivo.

### Software y herramientas generales
- sistema operativo del aula (Windows o Ubuntu, según disponibilidad);
- Visual Studio Code;
- navegador web;
- terminal;
- Git y GitHub;
- Node.js y npm;
- Postman;
- entorno del proyecto backend;
- herramientas de presentación;
- si procede, Arduino IDE o software de carga/monitorización del prototipo.

## 5.9. Sentido pedagógico de la secuencia

La secuenciación propuesta no responde a un reparto arbitrario del tiempo, sino a una lógica pedagógica progresiva:

1. primero se comprende el problema;
2. después se modela y se diseña;
3. a continuación se implementa y se valida técnicamente;
4. finalmente se documenta, se revisa y se defiende.

Este orden permite que el alumnado no trabaje “a ciegas”, sino que entienda por qué se desarrolla cada parte y cómo se conecta con el resultado final.

## 5.10. Observación final

La temporalización se considera viable porque:

- se inserta dentro de un módulo con una carga horaria suficiente;
- acota el proyecto a un bloque concreto del segundo trimestre;
- concreta qué se hace, qué se entrega y qué se evalúa en cada fase;
- detalla materiales, espacios, software y productos;
- y permite que la propuesta sea comprensible y reutilizable por otro docente.

En este sentido, la programación de aula no se limita a enumerar sesiones, sino que ofrece una secuencia de trabajo aplicable, evaluable y suficientemente detallada para su puesta en práctica.

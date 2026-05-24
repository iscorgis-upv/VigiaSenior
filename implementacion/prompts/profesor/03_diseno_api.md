# Prompt · Diseño de API

Diseña la API REST inicial del proyecto VigiaSenior.

Condiciones:
- el dispositivo consulta el plan del día
- el dispositivo envía eventos
- el frontend consulta dashboard, tomas y alertas

Diseña:
- GET /health
- GET /api/devices/:deviceId/schedule/today
- GET /api/devices/:deviceId/status
- POST /api/devices/:deviceId/events
- GET /api/patients/:patientId/dashboard
- GET /api/patients/:patientId/scheduled-doses
- GET /api/patients/:patientId/events
- GET /api/patients/:patientId/alerts
- PATCH /api/alerts/:alertId/resolve

Para cada endpoint quiero:
- objetivo
- parámetros
- body si aplica
- respuesta
- errores
- ejemplo JSON

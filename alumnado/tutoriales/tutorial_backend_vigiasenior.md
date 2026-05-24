# Tutorial básico del backend

## Stack recomendado
- Node.js
- TypeScript
- Express
- Prisma
- base de datos relacional

## Endpoints mínimos
- GET /health
- GET /api/devices/:deviceId/schedule/today
- POST /api/devices/:deviceId/events
- GET /api/patients/:patientId/dashboard
- GET /api/patients/:patientId/alerts

## Recomendación
No intentéis hacerlo todo de una vez. Empezad por:
1. modelo del dominio
2. esquema de datos
3. endpoint de salud
4. endpoint de planificación
5. registro de eventos

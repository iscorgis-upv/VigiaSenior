# Simulaciones explorables para VigiaSenior

## Qué contiene
- `wokwi_local_test/`: simulación local, sin backend
- `wokwi_backend_ready/`: simulación preparada para conectarse a backend

## Uso recomendado en clase
1. Abrir primero `wokwi_local_test`
2. Explorar sensores, LEDs, botón de confirmar y buzzer
3. Observar la salida por Serial
4. Después pasar a `wokwi_backend_ready` y adaptar WiFi / backend

## Importación rápida en Wokwi
1. Crear un proyecto nuevo ESP32
2. Sustituir el contenido de `diagram.json`
3. Sustituir el contenido de `sketch.ino`
4. Ejecutar la simulación

## Nota didáctica
La simulación usa una placa virtual **ESP32 DevKit**, no el Nano ESP32 exacto, porque Wokwi documenta soporte para ESP32 y sus proyectos se definen con ficheros como `diagram.json`. El objetivo aquí es explorar la lógica del sistema y la interacción hardware-backend.

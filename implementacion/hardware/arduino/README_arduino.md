# Scripts Arduino de VigiaSenior

## Archivos
- `VigiaSenior_backend_mode.ino`: conecta al Wi‑Fi y al backend
- `VigiaSenior_test_mode_sin_backend.ino`: pruebas locales sin backend

## Mapeo fijo
- D1..D6 -> sensores/pulsadores de cajitas
- D7..D12 -> LEDs
- A0 -> botón confirmar
- A1 -> buzzer con BC557B (PNP)

## Carpeta recomendada en el repositorio
Colócalos en:

```text
hardware/arduino/
├── VigiaSenior_backend_mode/
│   └── VigiaSenior_backend_mode.ino
├── VigiaSenior_test_mode_sin_backend/
│   └── VigiaSenior_test_mode_sin_backend.ino
└── README_arduino.md
```

## Nota
En Arduino IDE conviene que el nombre de la carpeta coincida con el nombre del `.ino`.

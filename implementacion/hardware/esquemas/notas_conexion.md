# Notas de conexión

## Sensores/pulsadores
- un terminal del pulsador al pin digital
- el otro a GND
- usar INPUT_PULLUP en código

## LEDs
- pin digital -> resistencia 220Ω -> ánodo LED
- cátodo LED -> GND

## Botón confirmar
- un lado a A0
- otro a GND

## Buzzer con BC557B
- emisor a 3.3V
- base a A1 a través de 1kΩ
- colector al positivo del buzzer
- negativo del buzzer a GND

/*
  VigiaSenior - Wokwi local test
  --------------------------------
  Simulación exploratoria para alumnado.
  Placa virtual: ESP32 DevKit (equivalente funcional para la simulación)
  Sensores S1..S6 : GPIO 13..18
  LEDs L1..L6     : GPIO 21,22,23,25,26,27
  Confirmar       : GPIO 33
  Buzzer          : GPIO 32
*/

const uint8_t SENSOR_PINS[6] = {13, 14, 15, 16, 17, 18};
const uint8_t LED_PINS[6]    = {21, 22, 23, 25, 26, 27};
const uint8_t CONFIRM_PIN    = 33;
const uint8_t BUZZER_PIN     = 32;

const unsigned long DEBOUNCE_MS = 50;
const unsigned long ALERT_INTERVAL_MS = 10000;
const unsigned long CONFIRM_WINDOW_MS = 12000;

bool sensorStable[6];
bool sensorRawLast[6];
unsigned long sensorLastChange[6];

bool confirmStable = HIGH;
bool confirmRawLast = HIGH;
unsigned long confirmLastChange = 0;

enum DemoState { IDLE, ALERTING, OPENED };
DemoState state = IDLE;

int activeSlot = 0;
int openedSlot = -1;
unsigned long stateStartedAt = 0;
unsigned long lastBlinkAt = 0;
bool blinkState = false;

void buzzerOn()  { digitalWrite(BUZZER_PIN, HIGH); }
void buzzerOff() { digitalWrite(BUZZER_PIN, LOW); }

void beep(unsigned int ms = 80) {
  buzzerOn();
  delay(ms);
  buzzerOff();
}

void allLedsOff() {
  for (int i = 0; i < 6; i++) digitalWrite(LED_PINS[i], LOW);
}

void flashLed(uint8_t idx, int times = 2, int onMs = 100, int offMs = 70) {
  if (idx >= 6) return;
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PINS[idx], HIGH);
    delay(onMs);
    digitalWrite(LED_PINS[idx], LOW);
    delay(offMs);
  }
}

void startAlertForCurrentSlot() {
  state = ALERTING;
  openedSlot = -1;
  stateStartedAt = millis();
  lastBlinkAt = 0;
  blinkState = false;

  allLedsOff();
  Serial.print("[DEMO] toma activa en cajita ");
  Serial.println(activeSlot + 1);
  beep(120);
}

void goToNextSlot() {
  allLedsOff();
  buzzerOff();
  activeSlot = (activeSlot + 1) % 6;
  state = IDLE;
  openedSlot = -1;
  stateStartedAt = millis();
}

void setup() {
  Serial.begin(115200);

  pinMode(BUZZER_PIN, OUTPUT);
  buzzerOff();

  pinMode(CONFIRM_PIN, INPUT_PULLUP);

  for (int i = 0; i < 6; i++) {
    pinMode(SENSOR_PINS[i], INPUT_PULLUP);
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);

    bool current = digitalRead(SENSOR_PINS[i]);
    sensorStable[i] = current;
    sensorRawLast[i] = current;
    sensorLastChange[i] = millis();
  }

  beep(80); delay(80); beep(80); delay(80); beep(80);
  stateStartedAt = millis();

  Serial.println("=== VigiaSenior Wokwi · modo local ===");
  Serial.println("Pulsa S1..S6 para simular apertura.");
  Serial.println("Pulsa CONFIRMAR para validar la toma abierta.");
}

void loop() {
  if (state == IDLE && millis() - stateStartedAt >= ALERT_INTERVAL_MS) {
    startAlertForCurrentSlot();
  }

  for (int i = 0; i < 6; i++) {
    bool raw = digitalRead(SENSOR_PINS[i]);

    if (raw != sensorRawLast[i]) {
      sensorRawLast[i] = raw;
      sensorLastChange[i] = millis();
    }

    if ((millis() - sensorLastChange[i]) > DEBOUNCE_MS && raw != sensorStable[i]) {
      sensorStable[i] = raw;
      if (sensorStable[i] == LOW) {
        Serial.print("[SENSOR] pulsada cajita ");
        Serial.println(i + 1);

        if (state == ALERTING && i == activeSlot) {
          state = OPENED;
          openedSlot = i;
          allLedsOff();
          digitalWrite(LED_PINS[i], HIGH);
          stateStartedAt = millis();
          beep(70);
          Serial.println("[DEMO] apertura válida");
        } else {
          Serial.println("[DEMO] cajita incorrecta o fuera de tiempo");
          beep(250);
        }
      }
    }
  }

  bool confirmRaw = digitalRead(CONFIRM_PIN);
  if (confirmRaw != confirmRawLast) {
    confirmRawLast = confirmRaw;
    confirmLastChange = millis();
  }

  if ((millis() - confirmLastChange) > DEBOUNCE_MS && confirmRaw != confirmStable) {
    confirmStable = confirmRaw;
    if (confirmStable == LOW) {
      Serial.println("[BTN] confirmación");
      if (state == OPENED && openedSlot == activeSlot) {
        Serial.println("[DEMO] toma confirmada correctamente");
        flashLed(activeSlot, 3, 70, 50);
        beep(140);
        goToNextSlot();
      } else {
        Serial.println("[DEMO] no hay apertura válida previa");
        beep(250);
      }
    }
  }

  if (state == ALERTING) {
    if (millis() - lastBlinkAt >= 350) {
      lastBlinkAt = millis();
      blinkState = !blinkState;
      digitalWrite(LED_PINS[activeSlot], blinkState ? HIGH : LOW);
      if (blinkState) buzzerOn();
      else buzzerOff();
    }

    if (millis() - stateStartedAt >= CONFIRM_WINDOW_MS) {
      buzzerOff();
      Serial.println("[DEMO] toma omitida por timeout");
      flashLed(activeSlot, 4, 40, 40);
      beep(300);
      goToNextSlot();
    }
  }

  if (state == OPENED) {
    if (millis() - stateStartedAt >= CONFIRM_WINDOW_MS) {
      Serial.println("[DEMO] apertura sin confirmación: timeout");
      allLedsOff();
      flashLed(activeSlot, 4, 40, 40);
      beep(300);
      goToNextSlot();
    }
  }

  delay(8);
}

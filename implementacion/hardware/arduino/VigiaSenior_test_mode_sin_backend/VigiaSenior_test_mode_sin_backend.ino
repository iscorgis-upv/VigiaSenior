// ==============================
// VigiaSenior - modo sin backend
// Pruebas locales en breadboard
// Arduino Nano ESP32
//
// Sensores: D1..D6   (pulsadores simulando apertura)
// LEDs:     D7..D12
// Confirm:  A0
// Buzzer:   A1
// ==============================

const uint8_t SENSOR_PINS[6] = {1, 2, 3, 4, 5, 6};     // D1..D6
const uint8_t LED_PINS[6]    = {7, 8, 9, 10, 11, 12};  // D7..D12
const uint8_t CONFIRM_PIN    = A0;
const uint8_t BUZZER_PIN     = A1;

const unsigned long DEBOUNCE_MS = 50;
const unsigned long ALERT_INTERVAL_MS = 10000;   // cada cuánto empieza una alerta nueva
const unsigned long CONFIRM_WINDOW_MS = 12000;   // tiempo para abrir + confirmar

bool sensorStable[6];
bool sensorRawLast[6];
unsigned long sensorLastChange[6];

bool confirmStable = HIGH;
bool confirmRawLast = HIGH;
unsigned long confirmLastChange = 0;

enum DemoState {
  IDLE,
  ALERTING,
  OPENED
};

DemoState state = IDLE;
int activeSlot = 0;          // 0..5
int openedSlot = -1;         // 0..5
unsigned long stateStartedAt = 0;
unsigned long lastBlinkAt = 0;
bool blinkState = false;

void beep(unsigned int durationMs = 80) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(durationMs);
  digitalWrite(BUZZER_PIN, LOW);
}

void allLedsOff() {
  for (int i = 0; i < 6; i++) {
    digitalWrite(LED_PINS[i], LOW);
  }
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
  activeSlot = (activeSlot + 1) % 6;
  state = IDLE;
  openedSlot = -1;
  stateStartedAt = millis();
}

void setup() {
  Serial.begin(115200);
  delay(600);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

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

  beep(80);
  delay(80);
  beep(80);
  delay(80);
  beep(80);

  stateStartedAt = millis();

  Serial.println("=== VigiaSenior modo pruebas sin backend ===");
  Serial.println("Funcionamiento:");
  Serial.println("- cada cierto tiempo se activa una cajita");
  Serial.println("- el LED de esa cajita parpadea");
  Serial.println("- pulsa su sensor para simular apertura");
  Serial.println("- pulsa confirmar (A0) para validar la toma");
}

void loop() {
  // Lanzar siguiente alerta si estamos en IDLE
  if (state == IDLE && millis() - stateStartedAt >= ALERT_INTERVAL_MS) {
    startAlertForCurrentSlot();
  }

  // Debounce sensores
  for (int i = 0; i < 6; i++) {
    bool raw = digitalRead(SENSOR_PINS[i]);

    if (raw != sensorRawLast[i]) {
      sensorRawLast[i] = raw;
      sensorLastChange[i] = millis();
    }

    if ((millis() - sensorLastChange[i]) > DEBOUNCE_MS && raw != sensorStable[i]) {
      sensorStable[i] = raw;

      // INPUT_PULLUP => LOW al pulsar
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

  // Debounce botón confirmar
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
        beep(150);
        goToNextSlot();
      } else {
        Serial.println("[DEMO] no hay apertura válida previa");
        beep(250);
      }
    }
  }

  // Parpadeo / alerta
  if (state == ALERTING) {
    if (millis() - lastBlinkAt >= 350) {
      lastBlinkAt = millis();
      blinkState = !blinkState;
      digitalWrite(LED_PINS[activeSlot], blinkState ? HIGH : LOW);

      if (blinkState) {
        digitalWrite(BUZZER_PIN, HIGH);
      } else {
        digitalWrite(BUZZER_PIN, LOW);
      }
    }

    if (millis() - stateStartedAt >= CONFIRM_WINDOW_MS) {
      digitalWrite(BUZZER_PIN, LOW);
      Serial.println("[DEMO] toma omitida por timeout");
      flashLed(activeSlot, 4, 40, 40);
      beep(300);
      goToNextSlot();
    }
  }

  // Timeout si abrió pero no confirmó
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

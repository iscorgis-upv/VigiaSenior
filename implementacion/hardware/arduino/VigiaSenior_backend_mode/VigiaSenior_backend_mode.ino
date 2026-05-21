#include <WiFi.h>
#include <HTTPClient.h>

// ==============================
// VigiaSenior - modo con backend
// Arduino Nano ESP32
// Sensores: D1..D6
// LEDs:     D7..D12
// Confirm:  A0
// Buzzer:   A1
// ==============================

// --- CONFIGURACIÓN WIFI / BACKEND ---
const char* WIFI_SSID = "TU_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";
const char* BACKEND_BASE_URL = "http://192.168.1.34:3000"; // cambia esto
const char* DEVICE_ID = "pillbox-001";

// --- MAPA DE PINES ---
const uint8_t SENSOR_PINS[6] = {1, 2, 3, 4, 5, 6};     // D1..D6
const uint8_t LED_PINS[6]    = {7, 8, 9, 10, 11, 12};  // D7..D12
const uint8_t CONFIRM_PIN    = A0;
const uint8_t BUZZER_PIN     = A1;

// --- TIEMPOS ---
const unsigned long DEBOUNCE_MS = 50;
const unsigned long HEARTBEAT_MS = 30000;

// --- ESTADO ---
bool sensorStable[6];
bool sensorRawLast[6];
unsigned long sensorLastChange[6];

bool confirmStable = HIGH;
bool confirmRawLast = HIGH;
unsigned long confirmLastChange = 0;

unsigned long lastHeartbeat = 0;
int lastOpenedSlot = -1;

// ==============================
// UTILIDADES
// ==============================
void beep(unsigned int durationMs = 80) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(durationMs);
  digitalWrite(BUZZER_PIN, LOW);
}

void blinkLed(uint8_t idx, int times = 2, int onMs = 100, int offMs = 70) {
  if (idx >= 6) return;
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PINS[idx], HIGH);
    delay(onMs);
    digitalWrite(LED_PINS[idx], LOW);
    delay(offMs);
  }
}

bool ensureWifi() {
  if (WiFi.status() == WL_CONNECTED) return true;

  Serial.println("[WiFi] reconectando...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
    delay(400);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[WiFi] conectada. IP: ");
    Serial.println(WiFi.localIP());
    return true;
  }

  Serial.println("[WiFi] no conectada");
  return false;
}

String makeEventBody(const char* eventType, int physicalSlot = -1) {
  String body = "{";
  body += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  body += "\"eventType\":\"" + String(eventType) + "\",";
  if (physicalSlot > 0) {
    body += "\"physicalSlot\":" + String(physicalSlot);
  } else {
    body += "\"physicalSlot\":null";
  }
  body += "}";
  return body;
}

bool postEvent(const char* eventType, int physicalSlot = -1) {
  if (!ensureWifi()) return false;

  HTTPClient http;
  String url = String(BACKEND_BASE_URL) + "/api/devices/" + DEVICE_ID + "/events";
  String body = makeEventBody(eventType, physicalSlot);

  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  Serial.print("[POST] ");
  Serial.println(url);
  Serial.print("[BODY] ");
  Serial.println(body);

  int code = http.POST(body);
  String response = http.getString();

  Serial.print("[HTTP] code: ");
  Serial.println(code);
  Serial.print("[HTTP] response: ");
  Serial.println(response);

  http.end();
  return code >= 200 && code < 300;
}

void getHealth() {
  if (!ensureWifi()) return;

  HTTPClient http;
  String url = String(BACKEND_BASE_URL) + "/health";
  http.begin(url);
  int code = http.GET();
  String response = http.getString();

  Serial.print("[GET /health] code: ");
  Serial.println(code);
  Serial.println(response);
  http.end();
}

void getTodaySchedule() {
  if (!ensureWifi()) return;

  HTTPClient http;
  String url = String(BACKEND_BASE_URL) + "/api/devices/" + DEVICE_ID + "/schedule/today";
  http.begin(url);
  int code = http.GET();
  String response = http.getString();

  Serial.print("[GET schedule] code: ");
  Serial.println(code);
  Serial.println(response);
  http.end();
}

// ==============================
// SETUP
// ==============================
void setup() {
  Serial.begin(115200);
  delay(800);

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

  WiFi.mode(WIFI_STA);
  ensureWifi();

  beep(90);
  delay(80);
  beep(90);

  getHealth();
  getTodaySchedule();
  postEvent("device_online");

  lastHeartbeat = millis();

  Serial.println("=== VigiaSenior backend mode listo ===");
}

// ==============================
// LOOP
// ==============================
void loop() {
  ensureWifi();

  // Heartbeat
  if (millis() - lastHeartbeat >= HEARTBEAT_MS) {
    postEvent("heartbeat");
    lastHeartbeat = millis();
  }

  // Sensores: INPUT_PULLUP => LOW al pulsar/abrir
  for (int i = 0; i < 6; i++) {
    bool raw = digitalRead(SENSOR_PINS[i]);

    if (raw != sensorRawLast[i]) {
      sensorRawLast[i] = raw;
      sensorLastChange[i] = millis();
    }

    if ((millis() - sensorLastChange[i]) > DEBOUNCE_MS && raw != sensorStable[i]) {
      sensorStable[i] = raw;

      if (sensorStable[i] == LOW) {
        lastOpenedSlot = i + 1;
        Serial.print("[SLOT] apertura en cajita ");
        Serial.println(lastOpenedSlot);

        digitalWrite(LED_PINS[i], HIGH);
        beep(70);
        postEvent("box_opened", lastOpenedSlot);
      } else {
        digitalWrite(LED_PINS[i], LOW);
      }
    }
  }

  // Botón de confirmación: INPUT_PULLUP => LOW al pulsar
  bool confirmRaw = digitalRead(CONFIRM_PIN);
  if (confirmRaw != confirmRawLast) {
    confirmRawLast = confirmRaw;
    confirmLastChange = millis();
  }

  if ((millis() - confirmLastChange) > DEBOUNCE_MS && confirmRaw != confirmStable) {
    confirmStable = confirmRaw;

    if (confirmStable == LOW) {
      Serial.println("[BTN] confirmación");

      if (lastOpenedSlot > 0) {
        postEvent("dose_confirmed", lastOpenedSlot);
        blinkLed(lastOpenedSlot - 1, 3, 70, 50);
        beep(140);
      } else {
        Serial.println("[WARN] no hay slot abierto previo");
        beep(250);
      }
    }
  }

  delay(8);
}

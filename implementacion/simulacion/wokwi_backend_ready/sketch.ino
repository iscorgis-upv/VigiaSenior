/*
  VigiaSenior - Wokwi backend-ready skeleton
  ------------------------------------------
  Requiere configurar:
  - WIFI_SSID
  - WIFI_PASSWORD
  - BACKEND_BASE_URL

  Sensores S1..S6 : GPIO 13..18
  LEDs L1..L6     : GPIO 21,22,23,25,26,27
  Confirmar       : GPIO 33
  Buzzer          : GPIO 32
*/

#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "TU_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";
const char* BACKEND_BASE_URL = "http://TU_BACKEND:3000";
const char* DEVICE_ID = "pillbox-sim-001";

const uint8_t SENSOR_PINS[6] = {13, 14, 15, 16, 17, 18};
const uint8_t LED_PINS[6]    = {21, 22, 23, 25, 26, 27};
const uint8_t CONFIRM_PIN    = 33;
const uint8_t BUZZER_PIN     = 32;

const unsigned long DEBOUNCE_MS = 50;
const unsigned long HEARTBEAT_MS = 30000;

bool sensorStable[6];
bool sensorRawLast[6];
unsigned long sensorLastChange[6];

bool confirmStable = HIGH;
bool confirmRawLast = HIGH;
unsigned long confirmLastChange = 0;

unsigned long lastHeartbeat = 0;
int lastOpenedSlot = -1;

void buzzerOn()  { digitalWrite(BUZZER_PIN, HIGH); }
void buzzerOff() { digitalWrite(BUZZER_PIN, LOW); }

void beep(unsigned int ms = 80) {
  buzzerOn();
  delay(ms);
  buzzerOff();
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

bool ensureWifiConnected() {
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
    Serial.print("[WiFi] conectada. IP local: ");
    Serial.println(WiFi.localIP());
    return true;
  }

  Serial.println("[WiFi] no se pudo conectar");
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
  if (!ensureWifiConnected()) return false;

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

  WiFi.mode(WIFI_STA);
  ensureWifiConnected();

  beep(90);
  delay(80);
  beep(90);

  postEvent("device_online");
  lastHeartbeat = millis();

  Serial.println("=== VigiaSenior Wokwi · backend skeleton ===");
}

void loop() {
  ensureWifiConnected();

  if (millis() - lastHeartbeat >= HEARTBEAT_MS) {
    postEvent("heartbeat");
    lastHeartbeat = millis();
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
        flashLed(lastOpenedSlot - 1, 3, 70, 50);
        beep(140);
      } else {
        Serial.println("[WARN] no hay slot abierto previo");
        beep(250);
      }
    }
  }

  delay(8);
}

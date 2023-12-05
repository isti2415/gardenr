#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino.h>
#include <ESP32_Supabase.h>
#include <ArduinoJson.h>

Supabase db;

String supabase_url = "https://aiuafwvpkxcewxkpsiyw.supabase.co";
String anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWFmd3Zwa3hjZXd4a3BzaXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NjE5OTYsImV4cCI6MjAxNDQzNzk5Nn0.Urnsw5pvePTPEJJpovap7xA6wYcXOWQC8dEUWvWwMvM";

const char *ssid = "Xiaomi 13 Lite";  // Your WiFi SSID
const char *password = "iubtepori";   // Your WiFi Password

const int ledPin = 5;  // Define the pin for the LED

String deviceID = "";

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  connectToWiFi();
  db.begin(supabase_url, anon_key);
  deviceID = createDeviceID();
  Serial.println(deviceID);
  checkRegisterDevice();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  if (WiFi.status() == WL_CONNECTED) {
  }
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.println("Connecting...");
  }

  Serial.println("Connected to WiFi");
}

String createDeviceID() {
  String macAddress = WiFi.macAddress();
  String deviceID = "";

  for (int i = 0; i < macAddress.length(); i++) {
    if (macAddress[i] != ':') {
      deviceID += macAddress[i];
    }
  }
  return deviceID;
}

void checkRegisterDevice() {
  String table = "Devices";

  String device = db.from(table).select("id").eq("id", deviceID).limit(1).doSelect();

  String id = device.substring(8, 20);

  if (id == deviceID) {
    Serial.println("Device already registered");
    String pword = db.from(table).select("password").eq("id", deviceID).eq("password", password).limit(1).doSelect();
    db.urlQuery_reset();
    if (pword) {
      String table = "Devices";
      DynamicJsonDocument device(1024);
      device["password"] = password;
      String JSON;
      serializeJson(device, JSON);
      int result = db.update(table).eq("id", deviceID).doUpdate(JSON);
      db.urlQuery_reset();
    }
  } else {
    while (registerDevice() == false) {
      Serial.println("Trying to register device...");
      delay(10000);
      registerDevice();
    }
    Serial.println("Device registered");
  }
}

bool registerDevice() {
  String table = "Devices";
  DynamicJsonDocument device(1024);
  device["id"] = deviceID;
  device["password"] = password;
  String JSON;
  serializeJson(device, JSON);

  bool upsert = true;

  int result = db.insert(table, JSON, upsert);
  db.urlQuery_reset();

  if (result > 199 && result < 300) {
    return true;
  } else {
    return false;
  }
}
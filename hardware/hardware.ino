#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino.h>
#include <ESP32_Supabase.h>
#include <ArduinoJson.h>
#include <WiFiManager.h>
#include <DHT11.h>

Supabase db;

struct DHTData {
  int humidity;
  int temperature;
};

String supabase_url = "https://aiuafwvpkxcewxkpsiyw.supabase.co";
String anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdWFmd3Zwa3hjZXd4a3BzaXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NjE5OTYsImV4cCI6MjAxNDQzNzk5Nn0.Urnsw5pvePTPEJJpovap7xA6wYcXOWQC8dEUWvWwMvM";

const int ledPin = 5;  // Define the pin for the LED
const int dhtPin = 4;
const int moisturePin = A0;

DHT11 dht11(dhtPin);

String password = "";

String deviceID = "";

const int humidityThresholdHigh = 70;  // Adjust based on your plants' needs
const int humidityThresholdLow = 30;   // Adjust based on your plants' needs

const int temperatureThresholdHigh = 30;  // Adjust based on your plants' needs
const int temperatureThresholdLow = 10;   // Adjust based on your plants' needs

const int soilMoistureThresholdHigh = 90;  // Adjust based on your plants' needs
const int soilMoistureThresholdLow = 55;   // Adjust based on your plants' needs

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(moisturePin, INPUT);
  deviceID = createDeviceID();
  const char* charDeviceID = deviceID.c_str();
  WiFiManager wifimanager;
  wifimanager.autoConnect(charDeviceID);
  password = wifimanager.getWiFiPass();
  db.begin(supabase_url, anon_key);
  Serial.println(deviceID);
  checkRegisterDevice();
}

void loop() {
  // Simulating sensor readings (replace with actual sensor readings)
  int simulatedHumidity = random(25, 75);
  int simulatedTemperature = random(20, 35);
  int simulatedSoilMoisture = random(50, 100);

  // Call the function with simulated sensor readings
  checkAndNotify(simulatedHumidity, simulatedTemperature, simulatedSoilMoisture, getPumpStatus(), deviceID);
  digitalWrite(ledPin, getPumpStatus());
  uploadSensorData();
  delay(60000);
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

void checkAndNotify(int humidity, int temperature, int soilMoisture, bool pumpStatus, String deviceID) {
  // Check Humidity
  if (humidity > humidityThresholdHigh) {
    logNotification(deviceID, "High Humidity", "Alert", "High humidity detected. Ensure proper ventilation.", "Humidity");
    // Trigger notification mechanism (e.g., LED, display, or communication module)
  } else if (humidity < humidityThresholdLow) {
    logNotification(deviceID, "Low Humidity", "Alert", "Low humidity detected. Consider misting your plants.","Humidity");
    // Trigger notification mechanism
  }

  // Check Temperature
  if (temperature > temperatureThresholdHigh) {
    logNotification(deviceID, "High Temperature", "Alert", "High temperature detected. Provide shade or extra watering.", "Temperature");
    // Trigger notification mechanism
  } else if (temperature < temperatureThresholdLow) {
    logNotification(deviceID, "Low Temperature", "Warning", "Low temperature detected. Protect plants from frost.", "Temperature");
    // Trigger notification mechanism
  }

  // Check Soil Moisture
  if (soilMoisture > soilMoistureThresholdHigh) {
    logNotification(deviceID, "High Soil Moisture", "Alert", "Soil moisture is high. Avoid overwatering.", "Soil Moisture");
    // Trigger notification mechanism
  } else if (soilMoisture < soilMoistureThresholdLow) {
    logNotification(deviceID, "Low Soil Moisture", "Warning", "Soil moisture is low. Time to water your plants.", "Soil Moisture");
    // Trigger notification mechanism
  }
}

void logNotification(String deviceID, String title, String priority, String description, String type) {
  String notificationsTable = "Notifications";
  DynamicJsonDocument notification(1024);
  notification["device"] = deviceID;
  notification["title"] = title;
  notification["priority"] = priority;
  notification["description"] = description;
  notification["type"] = type; // You can adjust the type based on your needs
  notification["read"] = false;
  String notificationJSON;
  serializeJson(notification, notificationJSON);

  bool upsert = false;

  int result = db.insert(notificationsTable, notificationJSON, upsert);
  db.urlQuery_reset();
}

bool getPumpStatus() {
  String pumpStatusJson = db.from("Current_Sensor_Values").select("pump").eq("device", deviceID).limit(1).doSelect();
  db.urlQuery_reset();

  // Parse the JSON array
  DynamicJsonDocument doc(1024);  // Adjust the size as needed

  // Check if parsing is successful
  DeserializationError error = deserializeJson(doc, pumpStatusJson);
  if (error) {
    Serial.print("Failed to parse JSON: ");
    Serial.println(error.c_str());
    return false;  // Return false on parsing error
  }

  // Check if the JSON array is not empty and the value is true
  if (!doc.isNull() && doc.is<JsonArray>() && doc.size() > 0) {
    JsonObject obj = doc[0].as<JsonObject>();
    if (obj.containsKey("pump") && obj["pump"].as<bool>()) {
      Serial.println("pump on");
      return true;
    }
  }

  Serial.println("pump off");
  return false;
}


DHTData dht() {
  DHTData data;

  data.humidity = dht11.readHumidity();
  data.temperature = dht11.readTemperature();

  if (data.humidity != DHT11::ERROR_CHECKSUM && data.humidity != DHT11::ERROR_TIMEOUT) {
    Serial.print("Humidity: ");
    Serial.print(data.humidity);
    Serial.println("%");
  } else {
    Serial.println(DHT11::getErrorString(data.humidity));
    data.humidity = random(25, 75);
  }

  if (data.temperature != DHT11::ERROR_CHECKSUM && data.temperature != DHT11::ERROR_TIMEOUT) {
    Serial.print("Temperature: ");
    Serial.print(data.temperature);
    Serial.println("°C");
  } else {
    Serial.println(DHT11::getErrorString(data.temperature));
    data.temperature = random(20,35);
  }

  return data;
}

float moisture() {
  float soilMoistureValue = analogRead(moisturePin);
  float soilMoisturePercent = map(soilMoistureValue, 790, 390, 0, 100);
  if(soilMoisturePercent>100){
    return random(50, 100);
  }
  else if(soilMoisturePercent<0){
    return random(50, 100);
  }
  else{
    return random(50, 100);
  }
}

bool uploadSensorData() {
  DHTData DHTData = dht();
  String table = "Sensors";
  DynamicJsonDocument sensor(1024);
  bool pump = digitalRead(ledPin);
  sensor["device"] = deviceID;
  sensor["humidity"] = DHTData.humidity;
  sensor["temperature"] = DHTData.temperature;
  sensor["moisture"] = moisture();
  sensor["pump"] = pump;
  String JSON;
  serializeJson(sensor, JSON);

  int currentValues = db.update("Current_Sensor_Values").eq("device", deviceID).doUpdate(JSON);

  bool upsert = false;

  int result = db.insert(table, JSON, upsert);
  db.urlQuery_reset();

  Serial.println(result);

  if (result > 199 && result < 300) {
    return true;
  } else {
    return false;
  }
}

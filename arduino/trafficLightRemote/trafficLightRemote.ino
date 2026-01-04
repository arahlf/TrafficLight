#include <IRremote.hpp>

constexpr uint16_t LIGHT_RED_KEY = 0x45;
constexpr uint16_t LIGHT_YELLOW_KEY = 0x46;
constexpr uint16_t LIGHT_GREEN_KEY = 0x47;
constexpr uint16_t FLASH_RED_KEY = 0x44;
constexpr uint16_t FLASH_YELLOW_KEY = 0x40;
constexpr uint16_t FLASH_GREEN_KEY = 0x43;
constexpr uint16_t LIGHTS_OFF_KEY = 0x7;

constexpr uint8_t IR_RECEIVE_PIN = 7;

constexpr uint8_t RED_PIN = 4;
constexpr uint8_t YELLOW_PIN = 3;
constexpr uint8_t GREEN_PIN = 2;

constexpr uint8_t VOID_PIN= UINT8_MAX;

constexpr uint8_t pins[] = { RED_PIN, YELLOW_PIN, GREEN_PIN };
constexpr uint8_t pinCount = sizeof(pins) / sizeof(pins[0]);

uint8_t flashingPin = VOID_PIN;
bool flashingHigh;
constexpr uint32_t flashDuration = 750;
uint32_t flashStartTime;
uint16_t lastKeyValue;

void setup(){
    Serial.begin(9600);
    IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
    
    pinMode(RED_PIN, OUTPUT);
    pinMode(YELLOW_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
}

void loop() {
  
    if (flashingPin != VOID_PIN) {
        if ((millis() - flashStartTime) >= flashDuration) {
            flashingHigh = !flashingHigh;
            flashStartTime = millis();
            
            digitalWrite(flashingPin, flashingHigh);
        }
    }

    if (IrReceiver.decode()) {
        Serial.println(IrReceiver.decodedIRData.command, HEX);

        uint16_t keyValue = IrReceiver.decodedIRData.command;
        bool isRepeat = (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT);
        
        if (keyValue == lastKeyValue || isRepeat) {
            IrReceiver.resume();
            return;
        }
        else {
            lastKeyValue = keyValue;
        }

        if (keyValue == LIGHT_RED_KEY) {
            lightPinExclusive(RED_PIN);
        }
        else if (keyValue == LIGHT_YELLOW_KEY) {
            lightPinExclusive(YELLOW_PIN);
        }
        else if (keyValue == LIGHT_GREEN_KEY) {
            lightPinExclusive(GREEN_PIN);
        }
        else if (keyValue == FLASH_RED_KEY) {
            flashPinExclusive(RED_PIN);
        }
        else if (keyValue == FLASH_YELLOW_KEY) {
            flashPinExclusive(YELLOW_PIN);
        }
        else if (keyValue == FLASH_GREEN_KEY) {
            flashPinExclusive(GREEN_PIN);
        }
        else if (keyValue == LIGHTS_OFF_KEY) {
            lightPinExclusive(VOID_PIN);
        }

        IrReceiver.resume();
    }
}

void lightPinExclusive(uint8_t pin) {
    flashingPin = VOID_PIN;
    
    for (uint8_t i = 0; i < pinCount; i++) {
        digitalWrite(pins[i], pins[i] == pin ? HIGH : LOW);
    }
}

void flashPinExclusive(uint8_t pin) {
    lightPinExclusive(pin);
    
    flashingPin = pin;
    flashingHigh = true;
    flashStartTime = millis();
}

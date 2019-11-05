#include <IRremote.h>

const unsigned long LIGHT_RED_KEY = 0xFFA25D;
const unsigned long LIGHT_YELLOW_KEY = 0xFF629D;
const unsigned long LIGHT_GREEN_KEY = 0xFFE21D;
const unsigned long FLASH_RED_KEY = 0xFF22DD;
const unsigned long FLASH_YELLOW_KEY = 0xFF02FD;
const unsigned long FLASH_GREEN_KEY = 0xFFC23D;
const unsigned long LIGHTS_OFF_KEY = 0xFFE01F;

const int IR_PIN = 7;
IRrecv irrecv(IR_PIN);
decode_results results;

const int RED_PIN = 4;
const int YELLOW_PIN = 3;
const int GREEN_PIN = 2;

const int VOID_PIN= -1;

const int pins[] = { RED_PIN, YELLOW_PIN, GREEN_PIN };
const int pinCount = sizeof(pins) / sizeof(int);

int flashingPin = VOID_PIN;
boolean flashingHigh;
const unsigned long flashDuration = 750;
unsigned long flashStartTime;
unsigned long lastKeyValue;

void setup(){
    Serial.begin(9600);
    irrecv.enableIRIn();
    
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

    if (irrecv.decode(&results)) {

        Serial.println(results.value, HEX);

        unsigned long keyValue = results.value;
        
        if (keyValue == lastKeyValue || keyValue == REPEAT) {
            irrecv.resume();
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

        irrecv.resume();
    }
}

void lightPinExclusive(int pin) {
    flashingPin = VOID_PIN;
    
    for (int i = 0; i < pinCount; i++) {
        digitalWrite(pins[i], pins[i] == pin ? HIGH : LOW);
    }
}

void flashPinExclusive(int pin) {
    lightPinExclusive(pin);
    
    flashingPin = pin;
    flashingHigh = true;
    flashStartTime = millis();
}


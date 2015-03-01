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

void setup() {
    Serial.begin(9600);
    Serial.setTimeout(10);

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

    if (Serial.available()) {

        String command = Serial.readStringUntil('$');

        if (command == "light red") {
            lightPinExclusive(RED_PIN);
        }
        else if (command == "light yellow") {
            lightPinExclusive(YELLOW_PIN);
        }
        else if (command == "light green") {
            lightPinExclusive(GREEN_PIN);
        }
        else if (command == "flash red") {
            flashPinExclusive(RED_PIN);
        }
        else if (command == "flash yellow") {
            flashPinExclusive(YELLOW_PIN);
        }
        else if (command == "flash green") {
            flashPinExclusive(GREEN_PIN);
        }
        else if (command == "lights off") {
            lightPinExclusive(VOID_PIN);
        }
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


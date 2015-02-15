const int RED_PIN = 4;
const int YELLOW_PIN = 3;
const int GREEN_PIN = 2;

const int pins[] = { RED_PIN, YELLOW_PIN, GREEN_PIN };
const int pinCount = sizeof(pins) / sizeof(int);

int flashingPin = -1;

void setup() {
    Serial.begin(9600);
    Serial.setTimeout(10);

    pinMode(RED_PIN, OUTPUT);
    pinMode(YELLOW_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
}

void loop() {
  
    if (flashingPin != -1) {
        // TODO use millis() to compare time instead of delays so that it's more responsive
        digitalWrite(flashingPin, HIGH);
        delay(750);
        digitalWrite(flashingPin, LOW);
        delay(750);
    }

    if (Serial.available()) {

        String command = Serial.readString();

        Serial.println(command);

        if (command == "light red") {
            lightPinExclusive(RED_PIN);
            flashingPin = -1;
        }
        else if (command == "light yellow") {
            lightPinExclusive(YELLOW_PIN);
            flashingPin = -1;
        }
        else if (command == "light green") {
            lightPinExclusive(GREEN_PIN);
            flashingPin = -1;
        }
        else if (command == "flash red") {
            lightPinExclusive(-1);
            flashingPin = RED_PIN;
        }
        else if (command == "flash yellow") {
            lightPinExclusive(-1);
            flashingPin = YELLOW_PIN;
        }
        else if (command == "flash green") {
            lightPinExclusive(-1);
            flashingPin = GREEN_PIN;
        }
        else if (command == "lights off") {
            lightPinExclusive(-1);
            flashingPin = -1;
        }
    }
}

void lightPinExclusive(int pin) {
    for (int i = 0; i < pinCount; i++) {
        digitalWrite(pins[i], pins[i] == pin ? HIGH : LOW);
    }
}

int RED_PIN = 4;
int YELLOW_PIN = 3;
int GREEN_PIN = 2;

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
            digitalWrite(RED_PIN, HIGH);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = -1;
        }
        else if (command == "light yellow") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, HIGH);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = -1;
        }
        else if (command == "light green") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, HIGH);
            flashingPin = -1;
        }
        else if (command == "flash red") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = RED_PIN;
        }
        else if (command == "flash yellow") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = YELLOW_PIN;
        }
        else if (command == "flash green") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = GREEN_PIN;
        }
        else if (command == "lights off") {
            digitalWrite(RED_PIN, LOW);
            digitalWrite(YELLOW_PIN, LOW);
            digitalWrite(GREEN_PIN, LOW);
            flashingPin = -1;
        }
    }
}

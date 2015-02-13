package com.arahlf;

import jssc.SerialPort;
import jssc.SerialPortList;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        String[] portNames = SerialPortList.getPortNames();

        Signal signal = Signal.RED;

        if (portNames.length == 0) {
            System.out.println("No ports found.");
            return;
        }

        String portName = portNames[0];

        System.out.println("Using SerialPort: " + portName);

        SerialPort serialPort = new SerialPort(portName);

        TrafficLightController trafficLightController = new SerialPortTrafficLightController(serialPort);

        Scanner scanner = new Scanner(System.in);

        try {
            serialPort.openPort();
            serialPort.setParams(SerialPort.BAUDRATE_9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);

            System.out.println("Enter commands:");

            String command = null;

            while (true) {
                command = scanner.nextLine();

                if (command.equals("exit")) {
                    System.out.println("Bye.");
                    break;
                }

                System.out.println("Received command: " + command);

                switch (command) {
                    case "light red":
                        trafficLightController.light(Signal.RED);
                        break;
                    case "light yellow":
                        trafficLightController.light(Signal.YELLOW);
                        break;
                    case "light green":
                        trafficLightController.light(Signal.GREEN);
                        break;
                    case "flash red":
                        trafficLightController.flash(Signal.RED);
                        break;
                    case "flash yellow":
                        trafficLightController.flash(Signal.YELLOW);
                        break;
                    case "flash green":
                        trafficLightController.flash(Signal.GREEN);
                        break;
                    case "lights off":
                        trafficLightController.turnLightsOff();
                        break;
                    default:
                        System.out.println("Unrecognized command.");
                }

                Thread.sleep(100);

                String read = serialPort.readString();

                if (read != null) {
                    System.out.println("Feedback from Arduino: " + read);
                }
            }

            serialPort.closePort();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

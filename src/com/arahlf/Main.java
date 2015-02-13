package com.arahlf;

import jssc.SerialPort;
import jssc.SerialPortList;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        String[] portNames = SerialPortList.getPortNames();

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
                        trafficLightController.light(Lamp.RED);
                        break;
                    case "light yellow":
                        trafficLightController.light(Lamp.YELLOW);
                        break;
                    case "light green":
                        trafficLightController.light(Lamp.GREEN);
                        break;
                    case "flash red":
                        trafficLightController.flash(Lamp.RED);
                        break;
                    case "flash yellow":
                        trafficLightController.flash(Lamp.YELLOW);
                        break;
                    case "flash green":
                        trafficLightController.flash(Lamp.GREEN);
                        break;
                    case "lights off":
                        trafficLightController.turnOff();
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

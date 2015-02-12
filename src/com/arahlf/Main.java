package com.arahlf;

import jssc.SerialPortList;

public class Main {

    public static void main(String[] args) {
        String[] portNames = SerialPortList.getPortNames();

        for (String portName : portNames) {
            System.out.println("Port found: " + portName);
        }

        System.out.println("Total ports found: " + portNames.length);
    }
}

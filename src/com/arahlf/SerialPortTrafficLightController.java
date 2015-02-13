package com.arahlf;

import jssc.SerialPort;
import jssc.SerialPortException;

/**
 * Created by arahlf on 2/12/15.
 */
public class SerialPortTrafficLightController implements TrafficLightController {

    public SerialPortTrafficLightController(SerialPort serialPort) {
        _serialPort = serialPort;
    }

    @Override
    public void light(Signal signal) {
        _writeCommand("light " + signal.toString().toLowerCase());
    }

    @Override
    public void flash(Signal signal) {
        _writeCommand("flash " + signal.toString().toLowerCase());
    }

    @Override
    public void turnLightsOff() {
        _writeCommand("lights off");
    }

    private void _writeCommand(String command) {
        try {
            _serialPort.writeString(command);
        } catch (SerialPortException e) {
            e.printStackTrace();
        }
    }

    private final SerialPort _serialPort;
}

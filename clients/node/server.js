var express = require('express');
var bodyParser = require('body-parser');
var SerialPort = require('serialport').SerialPort;

var app = express();
var portName = '/dev/tty.usbmodem1411';
var serialPort = new SerialPort(portName, { baudRate: 9600 });
var server;

app.use(bodyParser.json());

app.get('/trafficlight', function(req, res) {
    res.sendStatus(501);
});

app.put('/trafficlight', function(req, res) {
    var light = req.body.light;
    var lamp = req.body.lamp;
    var lamps = ['red', 'yellow', 'green'];

    if (light === 'on' || light === 'flashing') {
        if (!lamp || lamps.indexOf(lamp) === -1) {
            res.status(400).send('Invalid value specified for `lamp`.');
        }
        else {
            var command = light === 'on' ? 'light' : 'flash';

            console.log('Processing command: ' + command + ' ' + lamp);

            serialPort.write(command + ' ' + lamp + '$', function(writeError) {
                if (writeError) {
                    serialPort.status(500).send('Error writing command: ' + e);
                }
                else {
                    serialPort.drain(function(drainError) {
                        if (drainError) {
                            serialPort.status(500).send('Error draining serial port: ' + e);
                        }
                        else {
                            res.sendStatus(204);
                        }
                    });
                }
            });
        }
    }
    else if (light === 'off') {
        serialPort.write('lights off');
        
        res.sendStatus(204);
    }
    else {
        res.status(400).send('Invalid value specified for `light`.');
    }
});

serialPort.on('error', function(error) {
    console.log('Error opening serial port: ' + error);
});

serialPort.open(function(error) {
    if (!error) {
        console.log('Serial port opened, starting server.');

        server = app.listen(8080);
    }
});

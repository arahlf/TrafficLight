var express = require('express');
var bodyParser = require('body-parser');
var SerialPort = require('serialport').SerialPort;

var app = express();

app.use(bodyParser.json());

app.get('/trafficlight', function(req, res) {
    res.sendStatus(501);
});

app.put('/trafficlight', function(req, res) {
    // body can look like: { "light": "on|flashing|off", "lamp": "red|yellow|green" }

    var light = req.body.light;
    var lamp = req.body.lamp;
    var lamps = ['red', 'yellow', 'green'];

    if (light === 'on' || light === 'flashing') {
        if (!lamp || lamps.indexOf(lamp) === -1) {
            res.status(400).send('Invalid value specified for `lamp`.');
        }
        else {
            var command = light === 'on' ? 'light' : 'flash';

            serialPort.write(command + ' ' + lamp);

            console.log(command + ' ' + lamp);
            
            res.sendStatus(204);
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


var portName = '/dev/tty.usbmodem1421';
var serialPort = new SerialPort(portName, { baudRate: 9600 });

serialPort.open(function(error) {
    console.log('Serial port opened, starting server.');

    var server = app.listen(8080);
});

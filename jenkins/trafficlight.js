var SerialPort = require('serialport').SerialPort;

function TrafficLight(serialPortPath) {
    this._serialPort = new SerialPort(serialPortPath, { baudRate: 9600 });
}

TrafficLight.prototype.lightGreen = function() {
    this._sendCommand('light green');
};

TrafficLight.prototype.flashGreen = function() {
    this._sendCommand('flash green');
};

TrafficLight.prototype.lightYellow = function() {
    this._sendCommand('light yellow');
};
TrafficLight.prototype.flashYellow = function() {
    this._sendCommand('flash yellow');
};

TrafficLight.prototype.lightRed = function() {
    this._sendCommand('light red');
};

TrafficLight.prototype.flashRed = function() {
    this._sendCommand('flash red');
};

TrafficLight.prototype.lightsOff = function() {
    this._sendCommand('lights off');
};

TrafficLight.prototype._sendCommand = function(command) {
    var serialPort = this._serialPort;

    console.log('Writing: ' + command + '$');

    serialPort.write(command + '$', function(writeError) {
        if (writeError) {
            console.error('Error writing command: ' + e);
        }
        else {
            serialPort.drain(function(drainError) {
                if (drainError) {
                    console.error('Error draining serial port: ' + e);
                }
            });
        }
    });
}

module.exports = {

    TrafficLight: TrafficLight
};

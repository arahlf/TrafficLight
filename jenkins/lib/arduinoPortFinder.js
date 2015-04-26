var Promise = require('bluebird');
var listSerialPorts = Promise.promisify(require('serialport').list);

module.exports = {

    findConnectedArduino: function() {
        return listSerialPorts().then(function(ports) {
            var arduinoRegex = /arduino/gi;

            for (var i = 0; i < ports.length; i++) {
                var port = ports[i];

                if (arduinoRegex.test(port.manufacturer)) {
                    return port.comName;
                }
            }

            throw new Error('No connected Arduino found.');
        });
    }
};

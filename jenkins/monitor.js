var getJson = require('./get').json;

var MONITOR_INTERVAL = 1000 * 5;

var serialPortPath = '/dev/tty.usbmodem1421';
var jenkinsUrl = 'http://localhost:8080/api/json?pretty=true&tree=jobs[color,name]';

var states = [
    { color: 'blue', command: 'light green' },
    { color: 'blue_anime', command: 'flash green' },
    { color: 'yellow', command: 'light yellow' },
    { color: 'yellow_anime', command: 'flash yellow' },
    { color: 'red', command: 'light red' },
    { color: 'red_anime', command: 'flash red' },
];

var trafficLightSerialPort = new SerialPort(serialPortPath, { baudRate: 9600 });

function parseState(job) {
    for (var i = 0; i < states.length; i++) {
        var state = states[i];

        if (state.color === job.color) {
            return state;
        }
    }

    return states[0];
}

function writeSerialPortCommand(command) {
    console.log('Writing command: ' + command);

    trafficLightSerialPort.write(command + '$', function(writeError) {
        if (writeError) {
            console.error('Error writing command: ' + e);
        }
        else {
            trafficLightSerialPort.drain(function(drainError) {
                if (drainError) {
                    console.error('Error draining serial port: ' + e);
                }
            });
        }
    });
}

function monitorJenkins() {
    getJson(jenkinsUrl, function(json) {

        var newStateIndex = 0; 

        json.jobs.forEach(function(job) {
            var jobState = parseState(job);
            var jobStateIndex = states.indexOf(jobState);

            if (jobStateIndex > newStateIndex) {
                newStateIndex = jobStateIndex;
            }
        });

        var newJobState = states[newStateIndex];

        writeSerialPortCommand(newJobState.command);
    });

    setTimeout(monitorJenkins, MONITOR_INTERVAL);
}


trafficLightSerialPort.open(function(error) {
    if (error) {
        console.error('Error opening serial port: ' + error);
    }
    else {
        console.log('Serial port opened, starting monitor.');

        monitorJenkins();
    }
});

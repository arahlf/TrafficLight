var SerialPort = require('serialport').SerialPort;
var getJson = require('./get').json;

var args = process.argv;

if (args[2] === '-h' || args[2] === '--help') {
    showUsage(0);
}
else if (args.length !== 4) {
    showUsage(1);
}

var MONITOR_INTERVAL = 1000 * 10;

var jenkinsUrl = args[2].replace(/\/$/, '');
var serialPortPath = args[3];
var jenkinsApiUrl = jenkinsUrl + '/api/json?pretty=true&tree=jobs[color,name]';

var states = [
    { color: 'blue', command: 'light green' },
    { color: 'blue_anime', command: 'flash green' },
    { color: 'yellow', command: 'light yellow' },
    { color: 'yellow_anime', command: 'flash yellow' },
    { color: 'red', command: 'light red' },
    { color: 'red_anime', command: 'flash red' },
];

var trafficLightSerialPort = new SerialPort(serialPortPath, { baudRate: 9600 }, false);
var monitorIntervalId;

function showUsage(exitStatusCode) {
    console.log('usage: node monitor.js <jenkins_url> <serial_port_path>');
    process.exit(exitStatusCode);
}

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

    trafficLightSerialPort.write(command + '$', function(error) {
        if (error) {
            console.error('Error writing to serial port: ' + error.message);

            // Could try and re-open or poll for the connection again in the future
            clearInterval(monitorIntervalId);
        }
    });
}

function monitorJenkins() {
    getJson(jenkinsApiUrl, function(json) {

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
}

trafficLightSerialPort.open(function(error) {
    if (error) {
        console.error('Error opening serial port: ' + error.message);
    }
    else {
        console.log('Serial port opened, starting to monitor Jenkins.');

        monitorJenkins();

        monitorIntervalId = setInterval(monitorJenkins, MONITOR_INTERVAL);
    }
});

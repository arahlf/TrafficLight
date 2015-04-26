var Promise = require('bluebird');
var SerialPort = require('serialport').SerialPort;
var findConnectedArduino = require('./lib/arduinoPortFinder').findConnectedArduino;
var ArgumentsHandler = require('./lib/argumentsHandler');
var getJson = require('./lib/get').json;


var args = new ArgumentsHandler(process.argv);

if (args.hasSpecifiedArgument('-h') || args.hasSpecifiedArgument('--help')) {
    showUsage(0);
}

var MONITOR_INTERVAL = 1000 * 10;

var states = [
    { color: 'blue', command: 'light green' },
    { color: 'blue_anime', command: 'flash green' },
    { color: 'yellow', command: 'light yellow' },
    { color: 'yellow_anime', command: 'flash yellow' },
    { color: 'red', command: 'light red' },
    { color: 'red_anime', command: 'flash red' },
];

var monitorTimeoutId;

function showUsage(exitStatusCode) {
    var helpUsage = [
        'usage: node monitor.js [options] jenkins_url',
        '',
        '    -p    Name of the serial port to use.  If not specified, it will attempt to find a',
        '          connected Arduino to use.'
    ];

    console.log(helpUsage.join('\n'));

    process.exit(exitStatusCode);
}

function getJenkinsApiUrl() {
    return Promise.try(function() {
        var lastArgumentValue = args.getLastArgumentValue();

        if (!/^http[s]?:/.test(lastArgumentValue)) {
            throw new Error('Invalid URL for argument jenkins_url: ' + lastArgumentValue);
        }

        var jenkinsUrl = lastArgumentValue.replace(/\/$/, '');

        return jenkinsUrl + '/api/json?pretty=true&tree=jobs[color,name]';
    });
}

function getArduinoPortPath() {
    return Promise.try(function() {
        if (args.hasSpecifiedArgument('-p')) {
            return args.getArgumentValue('-p');
        }
        return findConnectedArduino();
    });
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

function writeSerialPortCommand(serialPort, command) {
    console.log('Writing command: ' + command);

    serialPort.write(command + '$', function(error) {
        if (error) {
            console.error('Error writing to serial port: ' + error.message);

            // Could try and re-open or poll for the connection again in the future
            clearTimeout(monitorTimeoutId);
        }
    });
}

function monitorJenkins(jenkinsApiUrl, serialPort) {
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

        writeSerialPortCommand(serialPort, newJobState.command);

        monitorTimeoutId = setTimeout(monitorJenkins.bind(undefined, jenkinsApiUrl, serialPort), MONITOR_INTERVAL);
    });
}

function start(jenkinsApiUrl, portPath) {
    var serialPort = new SerialPort(portPath, { baudRate: 9600 }, false);

    serialPort.open(function(error) {
        if (error) {
            console.error('Error opening serial port: ' + error.message);
        }
        else {
            console.log('Serial port opened, starting to monitor Jenkins.');

            monitorJenkins(jenkinsApiUrl, serialPort);
        }
    });
}

Promise.join(getJenkinsApiUrl(), getArduinoPortPath(), function(jenkinsApiUrl, arduinoPortPath) {

    start(jenkinsApiUrl, arduinoPortPath);
})
.catch(function(e) {
    console.error(e.message);

    process.exit(1);
});

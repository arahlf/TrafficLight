var Promise = require('bluebird');
var SerialPort = require('serialport').SerialPort;
var findConnectedArduino = require('./lib/arduinoPortFinder').findConnectedArduino;
var ArgumentsHandler = require('./lib/argumentsHandler');
var JenkinsApi = require('./lib/jenkinsApi');
var jenkinsResponseMapper = require('./lib/jenkinsResponseMapper');


Promise.promisifyAll(SerialPort.prototype);

var MONITOR_INTERVAL = 1000 * 10;
var args = new ArgumentsHandler(process.argv);

if (args.hasSpecifiedArgument('-h') || args.hasSpecifiedArgument('--help')) {
    showUsage(0);
}

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

function getJenkinsApi() {
    return Promise.try(function() {
        var jenkinsUrl = args.getLastArgumentValue();

        if (!/^http[s]?:/.test(jenkinsUrl)) {
            throw new Error('Invalid URL for argument jenkins_url: ' + jenkinsUrl);
        }
        return new JenkinsApi(jenkinsUrl);
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

function openSerialPort() {
    return getArduinoPortPath().then(function(arduinoPortPath) {
        var serialPort = new SerialPort(arduinoPortPath, { baudRate: 9600 }, false);

        return serialPort.openAsync().then(function() {
            return serialPort;
        });
    });
}

function monitorJenkins(jenkinsApi, serialPort) {

    jenkinsApi.getJson().then(function(json) {
        var command = jenkinsResponseMapper.getCommandFromResponse(json);

        return serialPort.writeAsync(command);
    }).then(function() {
        console.log('Successfully updated status.')

        setTimeout(monitorJenkins.bind(undefined, jenkinsApi, serialPort), MONITOR_INTERVAL);
    }).catch(function(e) {
        if (!serialPort.isOpen()) {
            console.log('Serial port no longer open, will attempt to reestablish.');

            attemptToReestablishMonitoring(jenkinsApi);
        }
        else {
            console.log('Unexpected error occurred while trying to update status: ' + e.message);

            setTimeout(monitorJenkins.bind(undefined, jenkinsApi, serialPort), MONITOR_INTERVAL);
        }
    });
}

function attemptToReestablishMonitoring(jenkinsApi) {
    console.log('Attempting to reestablish serial port.');

    openSerialPort().then(function(serialPort) {
        console.log('Serial port connection reestablished');

        monitorJenkins(jenkinsApi, serialPort);
    })
    .catch(function(e) {
        // just keep bangin' on it
        setTimeout(attemptToReestablishMonitoring.bind(undefined, jenkinsApi), MONITOR_INTERVAL);
    });
}

function start() {
    Promise.join(getJenkinsApi(), openSerialPort(), function(jenkinsApi, serialPort) {
        console.log('Serial port opened, starting to monitor Jenkins.');

        monitorJenkins(jenkinsApi, serialPort);
    })
    .catch(function(e) {
        console.error(e.message);

        process.exit(1);
    });
}

start();

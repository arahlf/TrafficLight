var getJson = require('./get').json;
var TrafficLight = require('./trafficlight').TrafficLight;

var MONITOR_INTERVAL = 1000 * 5;

var serialPortPath = '/dev/tty.usbmodem1421';
var jenkinsUrl = 'http://localhost:8080/api/json?pretty=true&tree=jobs[color,name]';

var states = [
    { color: 'blue', method: 'lightGreen' },
    { color: 'blue_anime', method: 'flashGreen' },
    { color: 'yellow', method: 'lightYellow' },
    { color: 'yellow_anime', method: 'flashYellow' },
    { color: 'red', method: 'lightRed' },
    { color: 'red_anime', method: 'flashRed' },
];

var trafficLight = new TrafficLight(serialPortPath);

function parseState(job) {
    for (var i = 0; i < states.length; i++) {
        var state = states[i];

        if (state.color === job.color) {
            return state;
        }
    }

    return states[0];
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

        console.log('New TrafficLight state: ' + newJobState.method);

        trafficLight[newJobState.method]();
    });

    setTimeout(monitorJenkins, MONITOR_INTERVAL);
}

monitorJenkins();

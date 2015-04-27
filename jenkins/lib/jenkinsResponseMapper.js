
var states = [
    { color: 'blue', command: 'light green' },
    { color: 'blue_anime', command: 'flash green' },
    { color: 'yellow', command: 'light yellow' },
    { color: 'yellow_anime', command: 'flash yellow' },
    { color: 'red', command: 'light red' },
    { color: 'red_anime', command: 'flash red' }
];

function parseState(job) {
    for (var i = 0; i < states.length; i++) {
        var state = states[i];

        if (state.color === job.color) {
            return state;
        }
    }
    return states[0];
}

module.exports = {
    
    getCommandFromResponse: function(responseJson) {
        var newStateIndex = 0; 

        responseJson.jobs.forEach(function(job) {
            var jobState = parseState(job);
            var jobStateIndex = states.indexOf(jobState);

            if (jobStateIndex > newStateIndex) {
                newStateIndex = jobStateIndex;
            }
        });

        var newJobState = states[newStateIndex];

        return newJobState.command + '$';
    }
};

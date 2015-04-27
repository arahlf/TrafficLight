var Promise = require('bluebird');
var getJson = require('./get').json;

function JenkinsApi(jenkinsUrl) {
    this._jenkinsUrl = jenkinsUrl.replace(/\/$/, '');

        return jenkinsUrl + '/api/json?pretty=true&tree=jobs[color,name]';
}

JenkinsApi.prototype.getJson = function() {
    return getJson(this._jenkinsUrl + '/api/json?pretty=true&tree=jobs[color,name]');
}

module.exports = JenkinsApi;

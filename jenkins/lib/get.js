var http = require('http');
var Promise = require('bluebird');

module.exports = {

    json: function(url) {
        return new Promise(function(resolve, reject) {
            var req = http.get(url, function(res) {
                var body = '';

                res.on('data', function(d) {
                    body += d;
                });

                res.on('end', function() {
                    try {
                        var json = JSON.parse(body);
                        
                        resolve(json);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', function(e) {
                reject(e);
            });
        });
    }
};

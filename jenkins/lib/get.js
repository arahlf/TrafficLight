var http = require('http');

module.exports = {

    json: function(url, success, failure) {
        
        var req = http.get(url, function(res) {
            var body = '';

            res.on('data', function(d) {
                body += d;
            });

            res.on('end', function() {
                var json = JSON.parse(body);

                success && success(json);
            });

        });

        req.on('error', function(e) {
            failure && failure(json);
        });
    }
}

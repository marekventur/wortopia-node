var request = require('request');
var Q = require('q');
module.exports = function(config, logger) {
    var that = this;

    this.send = function(template, user, fields) {
        fields.username = user.name;
        return user.loadEmail()
        .then(function(user) {
            var deferred = Q.defer();
            var ses = require('node-ses')
              , client = ses.createClient(config.email);

            var content = template(fields);
            client.sendEmail({
               to: user.email
             , from: config.email.from
             , subject: content.subject
             , message: content.html
             , altText: content.text
            }, function (error, data, res) {
                if (error) {
                    logger.error("caught ses error: %j %j %j", error, data, res)
                    return deferred.reject(new Error(error));
                }
                if (!data) {
                    logger.error("caught ses error: %j %j %j", error, data, res)
                    return deferred.reject(new Error("no response"));
                }
                deferred.resolve([res.statusCode, res]);
            });
            return deferred.promise;
        })
        .spread(function(statusCode, body) {
            if (statusCode !== 200 || (body && body.errors)) {
                var message = 'Unexpected response:' + JSON.stringify(body);
                if (body && body.errors) {
                    message = body.errors.join(', ');
                }
                throw new Error(message);
            }
        })
        .catch(function(error) {
            logger.error('Caught error from ses: %j', error)
            throw error
        });
    }
}

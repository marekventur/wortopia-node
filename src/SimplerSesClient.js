var request = require('request');
var Q = require('q');
module.exports = function(config, logger) {
    var that = this;

    this.send = function(campaign, user, fields) {
        fields.username = user.name;
        return user.loadEmail()
        .then(function(user) {
            var deferred = Q.defer();
            request({
                uri: 'https://api.simplerses.com/v1/email_jobs',
                method: 'POST',
                json: {
                    "auth_token": config.simplerSes.authToken,
                    "campaign_name": config.simplerSes.templatePrefix + campaign,
                    "to": user.email,
                    "from": config.simplerSes.from,
                    "custom_fields": fields
                }
            }, function (error, response, body) {
                if (error) {
                    deferred.reject(new Error(error));
                }
                deferred.resolve([response.statusCode, body]);
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
        .fail(function(error) {
            logger.error('Caught error from simplerses: %j', error)
            throw error
        });
    }
}
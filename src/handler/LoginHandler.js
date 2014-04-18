var _ = require('underscore');
var Q = require('q');

module.exports = function(expressWrapper, userDao, logger) {
    var that = this;

    that.start = function() {
        expressWrapper.app.post('/loginViaSessionToken', function(req, res) {
            var sessionToken = req.body.sessionToken;

            userDao.getBySessionToken(sessionToken)
            .then(function(user) {
                return user.resetSessionToken();
            },
            function(err) {
                logger.info('User not logged in - create guest');
                return userDao.createNewGuest()
                .then(function(user) {
                    return user.createSessionToken()
                });
            })
            .then(function(user) {
                logger.info("Logged in:", user.id);
                res.send({ user: user });
            })
            .fail(function(err) {
                logger.error('Error caught while trying to login in via session token:', err.stack);
                res.send(500, 'Error while trying to log in');
            });
        });
    }

}
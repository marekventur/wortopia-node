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
                logger.info('User not logged in - create guest:', err);
                return userDao.createNewGuest()
                .then(function(user) {
                    return user.createSessionToken()
                });
            })
            .then(function(user) {
                logger.info("Logged in user name: %s, id: %d", user.name, user.id);
                return user.getExternalPrivateRepresentation();
            })
            .then(function(externalPrivateRepresentation) {
                res.send({ user: externalPrivateRepresentation });
            })
            .fail(function(err) {
                logger.error('Error caught while trying to login in via session token:', err.stack);
                res.send(500, 'Error while trying to log in');
            });
        });

        expressWrapper.app.post('/loginWithCredentials', function(req, res) {
            var username = req.body.username;
            var password = req.body.password;

            userDao.getViaLogin(username, password)
            .then(function(user) {
                return user.createSessionToken();
            })
            .then(function(user) {
                logger.info("Logged in user name: %s, id: %d", user.name, user.id);
                return user.getExternalPrivateRepresentation();
            })
            .then(function(externalPrivateRepresentation) {
                res.send({ user: externalPrivateRepresentation });
            })
            .fail(function(err) {
                if (err.invalidUsernameOrPassword) {
                    logger.info('Can not log in user due to incorrect credentials: %s', username);
                    res.send({error: 'invalid_credentials'});
                } else {
                    logger.error('Error caught while trying to login in with credentials:', err.stack);
                    res.send(500, 'Error while trying to log in');
                }
            });
        });
    }

}
var _ = require('underscore');
var Q = require('q');

module.exports = function(expressWrapper, userDao, recoverLinkManager, simplerSesClient, logger, config) {
    var that = this;

    that.start = function() {
        expressWrapper.app.post('/recoverRequest', function(req, res) {
            var email = req.body.email;
            logger.info('Recovery request for email', email);
            userDao.getByEmail(email)
            .then(function(user) {
                var resetLink = recoverLinkManager.createUrl(user);
                return simplerSesClient.send('recover', user, {resetLink: resetLink, })
                .then(function() {
                    res.send({});
                })
                .fail(function(err) {
                    logger.error('Error caught while trying to send password reset link:', err.stack);
                    res.send(500, {error: 'unknown'});
                });
            })
            .fail(function(err) {
                if (err.userNotFound) {
                    logger.error('User for email not found:', email);
                    res.send(400, {error: 'invalid_email'});
                } else {
                    logger.error('Error caught while trying to fetch user for email:', err);
                    res.send(500, {error: 'unknown'});
                }

            });
        });

        // This is not actually reseting the password, but creating a sessin token.
        // It's the frontend's responsibility to open the password dialog.
        expressWrapper.app.get('/recover', function(req, res) {
            var token = req.query.t;
            recoverLinkManager.verifyUser(token)
            .then(function(user) {
                return user.createSessionToken();
            })
            .then(function(user) {
                res.redirect(config.rootUrl + '#pwr.' + user.sessionToken);
            })
            .fail(function(err) {
                logger.error('Error caught while trying to reset password:', err.stack);
                res.send(500, 'Error while trying to send password reset link');
            });
        });
    }

}
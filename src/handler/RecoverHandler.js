var _ = require('underscore');
var Q = require('q');
var recoveryTemplate = require('../../email/recover');

module.exports = function(expressWrapper, userDao, recoverLinkManager, sesClient, logger, config) {
    var that = this;

    that.start = function() {
        expressWrapper.app.post('/recoverRequest', function(req, res) {
            var email = req.body.email;
            logger.info('Recovery request for email', email);
            userDao.getByEmail(email)
            .then(function(user) {
                var resetLink = recoverLinkManager.createUrl(user);
                return sesClient.send(recoveryTemplate, user, {resetLink: resetLink, })
                .then(function() {
                    res.send({});
                })
                .catch(function(err) {
                    logger.error('Error caught while trying to send password reset link:', err.stack);
                    res.status(500).send({error: 'unknown'});
                });
            })
            .catch(function(err) {
                if (err.userNotFound) {
                    logger.error('User for email not found:', email);
                    res.status(400).send({error: 'invalid_email'});
                } else {
                    logger.error('Error caught while trying to fetch user for email:', err);
                    res.status(500).send({error: 'unknown'});
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
            .catch(function(err) {
                logger.error('Error caught while trying to reset password:', err.stack);
                res.status(500).send('Error while trying to send password reset link');
            });
        });
    }

}

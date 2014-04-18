var iz = require('iz');
var _ = require('underscore');

module.exports = function(expressWrapper, userDao, logger) {
    var that = this;

    that.start = function() {
        expressWrapper.app.post('/signUp', function(req, res) {
            var username = req.body.username;
            var email = req.body.email;
            var password1 = req.body.password1;
            var password2 = req.body.password2;

            var errors = {};

            // Do some superficial valiating
            if (!username || username.length < 5) {
                errors.username = 'too_short';
            } else if (username.length > 15) {
                errors.username = 'too_long';
            } else if (!username.match(/^[a-zA-Z0-9-_]*$/)) {
                errors.username = 'invalid';
            }

            if (!email || !iz.email(email)) {
                errors.email = 'invalid'
            }

            if (!password1 || password1.length < 6) {
                errors.password1 = 'too_short';
            }

            if (!password1 || password1 !== password2) {
                errors.password2 = 'not_identical';
            }

            // No error? Actually try to create the user then
            if (_.size(errors) == 0) {
                userDao.getByName(username)
                // Switch errors around: A user means an error, an error means we can move on.
                // Not that both handlers are called from the same "then" to avoid both happening
                .then(function(user) {
                    var error = new Error('User name already exists');
                    error.usernameAlreadyExists = true;
                    throw error;
                }, function(err) {
                    if (err.userNotFound) {
                        // This means we'll move on to the next "then"
                        return true;
                    } else {
                        // Not the error we're looking for. Jump to next error handler...
                        throw err;
                    }
                })
                .then(function() {
                    return userDao.create(username, email, password1)
                })
                .then(function(user) {
                    return user.createSessionToken();
                })
                .then(function(user) {
                    res.send({
                        success: true,
                        user: user.getExternalPrivateRepresentation()
                    });
                })
                .fail(function(err) {
                    if (err.usernameAlreadyExists) {
                        logger.info('Username already taken: %s', username);
                        errors.username = 'already_exists';
                    } else {
                        logger.error('Error while trying to create user account: ', err.stack);
                        errors.username = 'unknown';
                    }
                    res.send({ errors: errors });
                });
            } else {
                res.send({ errors: errors });
            }
        });
    }

}
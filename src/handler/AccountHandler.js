var iz = require('iz');
var _ = require('underscore');
var Q = require('q');

module.exports = function(expressWrapper, userDao, logger) {
    var that = this;

    that.start = function() {
        expressWrapper.app.post('/account', function(req, res) {
            var sessionToken = req.body.sessionToken;

            userDao.getBySessionToken(sessionToken)
            .then(function(user) {
                return user.loadEmail()
            })
            .then(function(user) {
                var errors = {};
                if (!user || user.guest) {
                    errors.username = 'unknown';
                    throw new errors;
                }

                var name = req.body.name;
                var team = req.body.team || null;
                var email = req.body.email;
                var password1 = req.body.password1;
                var password2 = req.body.password2;

                // Do some superficial valiating
                if (!name || name.length < 5) {
                    errors.name = 'too_short';
                } else if (name.length > 15) {
                    errors.name = 'too_long';
                } else if (!name.match(/^[a-zA-Z0-9-_äÄöÖüÜß]*$/)) {
                    errors.name = 'invalid';
                }

                if (team && team.length < 5) {
                    errors.team = 'too_short';
                } else if (team && team.length > 15) {
                    errors.team = 'too_long';
                } else if (team && !team.match(/^[a-zA-Z0-9-_äÄöÖüÜß]*$/)) {
                    errors.team = 'invalid';
                }

                if (!email || !iz.email(email)) {
                    errors.email = 'invalid'
                }

                if (password1) {
                    if (password1.length < 6) {
                        errors.password1 = 'too_short';
                    }

                    if (!password1 || password1 !== password2) {
                        errors.password2 = 'not_identical';
                    }
                }

                if (_.size(errors) > 0) {
                    var error = new Error('Validation error');
                    error.errors = errors;
                    throw error;
                }

                var newUser = {
                    name: name,
                    password: password1,
                    team: team,
                    email: email
                }

                return [user, newUser];
            })
            .spread(function(user, newUser) {
                // No error? Try updating the user object then

                // Special promise: Throws special error object in case of a problem
                Q.fcall(function() {
                    if (user.name != newUser.name) {
                        // Check if new name is available first
                        return userDao.getByName(newUser.name)
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
                            return user.setName(newUser.name)
                        })
                        .fail(function(err) {
                            if (err.usernameAlreadyExists) {
                                logger.info('Username already taken: %s', username);
                                throw {name: 'already_exists'};
                            } else {
                                logger.error('Error while trying to update username: ', err.stack);
                                throw {name: 'unknown'};
                            }
                        });
                    }
                })
                .then(function() {
                    if (user.team != newUser.team) {
                        return user.setTeam(newUser.team)
                        .fail(function(err) {
                            logger.error('Error while trying to update team: ', err.stack);
                            throw {team: 'unknown'};
                        });
                    }
                })
                .then(function() {
                    if (user.email != newUser.email) {
                        return user.setEmail(newUser.email)
                        .fail(function(err) {
                            logger.error('Error while trying to update email: ', err.stack);
                            throw {email: 'unknown'};
                        });
                    }
                })
                .then(function() {
                    if (newUser.password) {
                        return user.setPassword(newUser.password)
                        .fail(function(err) {
                            logger.error('Error while trying to update password: ', err.stack);
                            throw {password1: 'unknown'};
                        });
                    }
                })
                .then(function() {
                    // Load the user object again - It's most likely been changed
                    return userDao.getById(user.id);
                })
                .then(function(refreshedUser) {
                    refreshedUser.sessionToken = user.sessionToken;
                    return refreshedUser.getExternalPrivateRepresentation();
                })
                .then(function(externalPrivateRepresentation) {
                    logger.info("User account successfully updated for user %d", user.id);
                    res.send({
                        success: true,
                        user: externalPrivateRepresentation
                    });
                })
                .fail(function(errors) {
                    var error = new Error('Validation error');
                    error.errors = errors;
                    throw error;
                })
            })
            .fail(function(err) {
                if (err.errors) {
                    res.send({
                        errors: err.errors
                    });
                } else {
                    logger.error('Unexpected error occured in /account handler: ', err);
                    res.send({
                        errors: {
                            name: 'unknown'
                        }
                    });
                }

            });
        });
    }

}
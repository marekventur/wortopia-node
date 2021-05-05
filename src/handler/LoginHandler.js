import _ from "underscore";


export default function(expressWrapper, userDao, logger) {
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
            .catch(function(err) {
                logger.error('Error caught while trying to login in via session token:', err.stack);
                res.status(500).send('Error while trying to log in');
            });
        });

        expressWrapper.app.post('/loginWithCredentials', async function(req, res) {
            var username = req.body.username;
            var password = req.body.password;

            try {
                const user = await userDao.getViaLogin(username, password);
                await user.createSessionToken();
                logger.info("Logged in user name: %s, id: %d", user.name, user.id);
                const externalPrivateRepresentation = await user.getExternalPrivateRepresentation();
                res.send({ user: externalPrivateRepresentation });
            } catch (err) {
                if (err.invalidUsernameOrPassword) {
                    logger.info('Can not log in user due to incorrect credentials: %s', username);
                    res.send({error: 'invalid_credentials'});
                } else {
                    logger.error('Error caught while trying to login in with credentials:', err.stack);
                    res.status(500).send('Error while trying to log in');
                }
            }
        });
    }

}
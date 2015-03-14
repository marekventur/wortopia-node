var sockjs = require('sockjs');
var Q = require('q');
var EventEmitter = require('events').EventEmitter;
module.exports = function(config, logger, userDao) {
    var that = this;

    var socket;
    var internalEventEmitter;

    that.start = function() {
        socket = sockjs.createServer({log:log});
        socket.on('connection', handleConnection);
        internalEventEmitter = new EventEmitter();
        internalEventEmitter.setMaxListeners(0);
    }

    function log(severity, message) {
        // nop
    }

    function handleConnection(connection) {
        var user = null;
        var size = null;

        connection.once('data', function(payload) {
            Q.fcall(function() {
                payload = JSON.parse(payload);
                var sessionToken = payload.sessionToken;
                size = payload.size;
                if (!sessionToken || (size !== 4 && size !== 5)) {
                    logger.error('Invalid payload: %j', payload);
                    throw new Error("Payload invalid");
                }
                return sessionToken;
            })
            .then(function(sessionToken) {
                return userDao.getBySessionToken(sessionToken);
            })
            .then(function(setUser) {
                user = setUser;
                afterLogin(connection, user, size);
            })
            .fail(function(err) {
                logger.error('Could not connect user due to error: %s', err);
                logger.info('Closing connection');
                connection.close(101);
            });
        });

        connection.once('close', function() {
            if (user) {
                logger.info("Connection for user %s closed", user);
            }
            connection.removeAllListeners();
        });
    }

    function afterLogin(connection, user, size) {
        function send(type, data) {
            var payload = {
                type: type,
                data: data
            };
            connection.write(JSON.stringify(payload));
        }

        connection.on('data', function(payloadString) {
            try {
                var payload = JSON.parse(payloadString);
                if (!payload.type) {
                    throw new Error('Invalid payload type');
                }
                if (payload.type === 'changeSessionToken') {
                    var sessionToken = payload.data;
                    userDao.getBySessionToken(sessionToken)
                    .then(function(newUser) {
                        user = newUser;
                        sendUserOptions(user, send);
                    }, function(error) {
                        connection.close();
                    });
                } else {
                    that.emit('extern_' + payload.type, payload.data, user, size, send);
                }
            } catch (err) {
                logger.error('Error caught when trying to handle incoming data from websocket:', err, err.stack, payloadString);
            }
            that.emit()
        });
        internalEventEmitter.on('broadcast_' + size, send);

        sendUserOptions(user, send);

        connection.once('close', function() {
            internalEventEmitter.removeListener('broadcast_' + size, send)
        })

        that.emit('connected', user, size, send);
    }

    that.getSocket = function() {
        return socket;
    }

    that.broadcast = function(type, size, data) {
        internalEventEmitter.emit('broadcast_' + size, type, data);
    }

    function sendUserOptions(user, send) {
        if (!user.guest) {
            user.getOptions()
            .then(function(options) {
                send('userOptions', options);
            }, function(error) {
                logger.error('Could not retrieve options for user', user.id, error);
            });
        }
    }
}

require('util').inherits(module.exports, require('events').EventEmitter);
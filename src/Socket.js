var sockjs = require('sockjs');
var Q = require('q');
var EventEmitter = require('events').EventEmitter;
module.exports = function(config, logger, userDao) {
    var that = this;

    var socket;
    var internalEventEmitter;

    that.start = function() {
        socket = sockjs.createServer();
        socket.on('connection', handleConnection);
        internalEventEmitter = new EventEmitter();
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
                connection.close(1);
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
                that.emit('extern_' + payload.type, payload.data, user, size, send);
            } catch (err) {
                logger.error('Error caught when trying to handle incoming data from websocket:', err, payloadString);
            }
            that.emit()
        });
        internalEventEmitter.on('broadcast_' + size, send);

        that.emit('connected', user, size, send);
    }

    that.getSocket = function() {
        return socket;
    }

    that.broadcast = function(type, size, data) {
        internalEventEmitter.emit('broadcast_' + size, type, data);
    }
}

require('util').inherits(module.exports, require('events').EventEmitter);
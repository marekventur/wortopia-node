import sockjs from 'sockjs';
import { EventEmitter } from "events";

export default class Socket extends EventEmitter {
    constructor (config, logger, userDao) {
        super();
        this.config = config;
        this.logger = logger;
        this.userDao = userDao;
    }

    start = () => {
        this.socket = sockjs.createServer({log: () => {} });
        this.socket.on('connection', this.handleConnection.bind(this));
        this.internalEventEmitter = new EventEmitter();
        this.internalEventEmitter.setMaxListeners(0);
    };

    handleConnection = (connection) => {
        let user = null;
        let size = null;
        connection.once('data', async (payload) => {
            try {
                payload = JSON.parse(payload);
                var sessionToken = payload.sessionToken;
                size = payload.size;
                if (!sessionToken || (size !== 4 && size !== 5)) {
                    this.logger.error('Invalid payload: %j', payload);
                    throw new Error("Payload invalid");
                }
                user = await this.userDao.getBySessionToken(sessionToken);
                this.afterLogin(connection, user, size);
            } catch (err) {
                this.logger.error('Could not connect user due to error: %s', err);
                this.logger.info('Closing connection');
                connection.close(101);
            }
        });

        connection.once('close', () => {
            if (user) {
                this.logger.info("Connection for user %s closed", user);
            }
            connection.removeAllListeners();
        });
    }

    afterLogin = (connection, user, size) => {
        function send(type, data) {
            var payload = {
                type: type,
                data: data
            };
            connection.write(JSON.stringify(payload));
        }

        connection.on('data', (payloadString) => {
            try {
                var payload = JSON.parse(payloadString);
                if (!payload.type) {
                    throw new Error('Invalid payload type');
                }
                if (payload.type === 'changeSessionToken') {
                    var sessionToken = payload.data;
                    this.userDao.getBySessionToken(sessionToken)
                    .then(function(newUser) {
                        user = newUser;
                        this.sendUserOptions(user, send);
                    }, function(error) {
                        connection.close();
                    });
                } else {
                    this.emit('extern_' + payload.type, payload.data, user, size, send);
                }
            } catch (err) {
                this.logger.error('Error caught when trying to handle incoming data from websocket:', err, err.stack, payloadString);
            }
            this.emit()
        });
        this.internalEventEmitter.on('broadcast_' + size, send);
        this.internalEventEmitter.on('sendToUser_' + user.id, send);

        this.sendUserOptions(user, send);

        connection.once('close', () => {
            this.internalEventEmitter.removeListener('broadcast_' + size, send)
        })

        this.emit('connected', user, size, send);
    }

    getSocket = () => {
        return this.socket;
    }

    broadcast = (type, size, data) => {
        this.internalEventEmitter.emit('broadcast_' + size, type, data);
    }

    sendToUser = (type, user, data) => {
        this.internalEventEmitter.emit('sendToUser_' + user.id, type, data);
    }

    sendUserOptions = (user, send) => {
        if (!user.guest) {
            user.getOptions()
            .then(function(options) {
                send('userOptions', options);
            }, function(error) {
                this.logger.error('Could not retrieve options for user', user.id, error);
            });
        }
    }
}

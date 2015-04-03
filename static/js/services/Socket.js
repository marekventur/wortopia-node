function Socket(size, session) {
    var that = this;

    that.openSocket = function(reconnectDuration) {
        reconnectDuration = reconnectDuration || 1000;
        if (that.sock) {
            that.sock.close(3001);
        }
        var sock = new SockJS('/socket');
        function send(type, data) {
            sock.send(JSON.stringify({
                type: type,
                data: data
            }));
        }
        sock.onopen = function() {
            sock.send(JSON.stringify({
                sessionToken: session.user.sessionToken,
                size: size.size
            }));

            reconnectDuration = 1000;

            that.send = function(type, data) {
                sock.send(JSON.stringify({
                    type: type,
                    data: data
                }));
            }
        };
        sock.onmessage = function(event) {
            payload = JSON.parse(event.data);
            that.emit(payload.type, payload.data);
        };
        sock.onclose = function(data) {
            if (data.code === 101) {
                console.error('Invalid session token')
            } else if (data.code === 3001) {
                // Socket closed from client side
            } else {
                console.error('Connection closed due to unknown reason:', data);
                setTimeout(function() {
                    that.openSocket(reconnectDuration * 2);
                }, reconnectDuration)
            }
        };
        /* Defer to avoid being called instantly */
        _.defer(function() {
            session.on('update', function(user) {
                send('changeSessionToken', user.sessionToken);
            });
        });

        that.sock = sock;
    };

    session.once('update', function() {
        that.openSocket();
    });

    that.send = function() {
        console.error('Socket is not ready yet');
    }

    that.noWebsocketConnectionWarning = function() {
        if (that.sock && that.sock.protocol) {
            return that.sock.protocol !== 'websocket';
        }
        return false;
    }
}

Socket.prototype = new EventEmitter();
Socket.prototype.constructor = Socket;
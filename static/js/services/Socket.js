function Socket(size, session) {
    var that = this;

    session.once('update', function(user) {
        var sock = new SockJS('/socket');
        function send(type, data) {
            sock.send(JSON.stringify({
                type: type,
                data: data
            }));
        }
        sock.onopen = function() {
            sock.send(JSON.stringify({
                sessionToken: user.sessionToken,
                size: size.size
            }));

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
            } else {
                console.error('Connection closed due to unknown reason:', data);
            }
        };
    });

    that.send = function() {
        console.error('Socket is not ready yet');
    }

}

Socket.prototype = new EventEmitter();
Socket.prototype.constructor = Socket;
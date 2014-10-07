function Chat(socket, tracking) {
    var that = this;

    socket.on('chatBacklog', function(messages) {
        _.each(messages, function(message) {
            that.emit('message', message);
        });
        that.emit('scrollDown');
    });

    socket.on('chat', function(message) {
        that.emit('message', message);
    });

    that.sendMessage = function(text) {
        socket.send('chat', text);
        tracking.event('chat', 'send');
    }
}

Chat.prototype = new EventEmitter();
Chat.prototype.constructor = Chat;
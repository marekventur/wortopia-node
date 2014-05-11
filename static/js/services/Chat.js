function Chat(socket) {
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
    }
}

Chat.prototype = new EventEmitter();
Chat.prototype.constructor = Chat;
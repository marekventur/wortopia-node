function PlayersPerField(socket) {
    var that = this;

    that.playersPerField = {4: 0, 5: 0};
    
    socket.on('playersPerField', function(playersPerField) {
        that.playersPerField = playersPerField;
        that.emit('update');
    });
}

PlayersPerField.prototype = new EventEmitter();
PlayersPerField.prototype.constructor = PlayersPerField;
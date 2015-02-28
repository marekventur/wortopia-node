function UserOptions(session, socket) {
    var that = this;

    that.options = {};

    if (window.localStorage.getItem('userOptions')) {
        that.options = JSON.parse(window.localStorage.getItem('userOptions'));
    }

    that.persist = function() {
        console.log('persisting', that.options);
        if (session.user && !session.user.guest) {
            socket.send('setUserOptions', that.options);
        } else {
            window.localStorage.setItem('userOptions', JSON.stringify(that.options));
        } 
    }

    socket.on('userOptions', function(data) {
        that.options = data;
        that.emit('update');
    });

}

UserOptions.prototype = new EventEmitter();
UserOptions.prototype.constructor = UserOptions;
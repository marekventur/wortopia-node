function UserOptions(session, socket) {
    var that = this;

    var defaultOptions = {
        "boardStyle":"default",
        "highscoreInterval": 30,
        "boardScale": 100
    }

    that.options = {};

    if (window.localStorage.getItem('userOptions')) {
        that.options = _.defaults(JSON.parse(window.localStorage.getItem('userOptions')), defaultOptions);
    }

    that.persist = function() {
        if (session.user && !session.user.guest) {
            socket.send('setUserOptions', that.options);
        } else {
            window.localStorage.setItem('userOptions', JSON.stringify(that.options));
        }
    }

    socket.on('userOptions', function(data) {
        that.options = _.defaults(data, defaultOptions);
        that.emit('update');
    });

}

UserOptions.prototype = new EventEmitter();
UserOptions.prototype.constructor = UserOptions;
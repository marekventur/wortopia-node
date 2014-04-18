function Session() {
    var that = this;

    that.user = null;

    that.setUser = function(user) {
        that.user = user;
        window.localStorage.setItem('sessionToken', user.sessionToken);
        that.emit('update', that.user);
    }

    that.getSessionToken = function() {
        return window.localStorage.getItem('sessionToken');
    }

    that.loginViaSessionToken = function() {
        Q($.post('/loginViaSessionToken', {sessionToken: that.getSessionToken()}))
        .then(function(response) {
            that.setUser(response.user);
        })
        .fail(function(err) {
            console.error('Error caught while trying to sign up:', err);
        })
        .then(function() {
            that.emit('update', that.user);
        });
    }
}

Session.prototype = new EventEmitter();
Session.prototype.constructor = Session;
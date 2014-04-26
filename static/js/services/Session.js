function Session() {
    var that = this;

    that.user = null;

    that.setUser = function(user) {
        that.user = user;
        if (user.sessionToken) {
            window.localStorage.setItem('sessionToken', user.sessionToken);
        }
        that.emit('update', that.user);
    }

    that.getSessionToken = function() {
        return window.localStorage.getItem('sessionToken');
    }

    that.logout = function() {
        window.localStorage.removeItem('sessionToken');
        that.user = null;
        that.loginViaSessionToken();
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

    that.loginWithCredentials = function(username, password) {
        return Q($.post('/loginWithCredentials', {username: username, password: password}))
        .then(function(response) {
            if (response.error) {
                var error = new Error('Username or Password invalid');
                error.reason = 'invalid_credentials'
                throw error;
            } else {
                that.setUser(response.user);
            }
        },
        function(err) {
            var error = new Error(err);
            error.reason = 'unknown'
            throw error;
        });
    }
}

Session.prototype = new EventEmitter();
Session.prototype.constructor = Session;
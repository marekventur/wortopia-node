var Q = require('q');
module.exports = function(db, logger, userDecorator) {
    var that = this;

    that.create = function(username, email, password) {
        return db.queryOne("INSERT INTO users (name, pw_hash) VALUES ($1, crypt($2, gen_salt('bf'))) RETURNING id", [username, password])
        .then(function(result) {
            return db.query("INSERT INTO user_emails (user_id, email) VALUES ($1, $2)", [result.id, email])
            .then(function() {
                return that.getById(result.id);
            });
        })
        .then(function(user) {
            logger.info('User %s created', username);
            return user;
        });
    };

    that.getByName = function(name) {
        return db.queryOne("SELECT id FROM users WHERE name = $1", [name])
        .then(function(user) {
            if (!user) {
                var error = new Error('User not found');
                error.userNotFound = true;
                return Q.reject(error);
            }
            return that.getById(user.id);
        });
    }

    that.getById = function(id) {
        return db.queryOne("SELECT id, name, team, pw_hash FROM users WHERE id = $1", [id])
        .then(function(user) {
            if (!user) {
                var error = new Error('User not found');
                error.userNotFound = true;
                return Q.reject(error);
            }
            return decorateUser(user)
        });
    }

    that.getByEmail = function(email) {
        return db.queryOne("SELECT user_id FROM user_emails WHERE email = $1", [email])
        .then(function(row) {
            if (!row) {
                var error = new Error('User not found');
                error.userNotFound = true;
                return Q.reject(error);
            }
            return that.getById(row.user_id);
        });
    }

    that.createNewGuest = function() {
        return db.queryOne('SELECT COALESCE(MAX(guest_id), 0) as top FROM user_sessions')
        .then(function(row) {
            return that.createGuestById(row.top + 1);
        })
    }

    that.createGuestById = function(guestId) {
        return decorateUser({
            guest: true,
            guestId: guestId,
            id: -guestId
        });
    }

    that.getBySessionToken = function(sessionToken) {
        if (!sessionToken) {
            return Q.reject(new Error('No session token provided'));
        }
        return db.queryOne(
            "SELECT user_id, guest_id FROM user_sessions WHERE session_token = $1 AND valid_until > now()",
            [sessionToken]
        )
        .then(function(row) {
            if (row.user_id) {
                return that.getById(row.user_id);
            } if (row.guest_id) {
                return that.createGuestById(row.guest_id);
            } else {
                throw new Error('Session token invalid');
            }
        })
        .then(function(user) {
            if (!user) {
                throw new Error('Session token or user not found');
            }
            user.sessionToken = sessionToken;
            return user;
        });
    }

    that.getViaLogin = function(username, password) {
        return db.queryOne("SELECT pw_hash = crypt($1, pw_hash) as valid, id FROM users WHERE name = $2", [password, username])
        .then(function(user) {
            if (!user || !user.valid) {
                var error = new Error('Username or password incorrect');
                error.invalidUsernameOrPassword = true;
                return Q.reject(error);
            }
            delete user.valid;
            return that.getById(user.id);
        })
    }

    function decorateUser(rawUser) {
        return userDecorator.decorate(rawUser);
    }

}
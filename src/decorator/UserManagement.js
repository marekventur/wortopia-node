var Q = require('q');

module.exports = function(user, db, logger) {
    var that = user;

    // Returns user, not session token
    that.createSessionToken = function() {
        return Q.fcall(function() {
            if (user.guest) {
                return db.queryOne('INSERT INTO user_sessions (guest_id) VALUES ($1) RETURNING session_token;', [user.guestId]);
            } else {
                return db.queryOne('INSERT INTO user_sessions (user_id) VALUES ($1) RETURNING session_token;', [user.id]);
            }
        })
        .then(function(row) {
            user.sessionToken = row.session_token;
            if (user.guest) {
                logger.info('Session token for guest %d created: %s', user.guestId, user.sessionToken);
            } else {
                logger.info('Session token for %s created: %s', user.name, user.sessionToken);
            }
            return user;
        });
    }

    // Returns user
    that.resetSessionToken = function() {
        if (!user.sessionToken) {
            return Q.reject(new Error('no session token set'));
        }
        return db.query("UPDATE user_sessions SET valid_until = now() + INTERVAL '30 days' WHERE session_token = $1",
            [user.sessionToken])
        .then(function(){
            return user;
        })
    }

    // What a users see about themselves
    that.getExternalPrivateRepresentation = function() {
        return user.loadEmail()
    }

    that.loadEmail = function() {
        if (user.email) {
            return Q(user);
        }

        // Guests have no email address
        if (user.id < 0) {
            return Q(user);
        }

        return db.queryOne('SELECT email FROM user_emails WHERE user_id = $1', [user.id])
        .then(function(row) {
            if (!row) {
                throw new Error('No email address for user ' + user.id + ' found');
            }
            user.email = row.email;
            return user;
        });
    }

    // What users see about each other
    that.getExternalPublicRepresentation = function() {
        var copy = JSON.parse(JSON.stringify(user));
        delete copy.sessionToken;
        return copy;
    };

    that.setName = function(name) {
        return db.queryOne('UPDATE users SET name = $1 WHERE id = $2', [name, user.id])
        .then(function() {
            return user;
        });
    }

    that.setEmail = function(email) {
        return db.queryOne('UPDATE user_emails SET email = $1 WHERE user_id = $2', [email, user.id])
        .then(function() {
            return user;
        });
    }

    that.setTeam = function(team) {
        return db.queryOne('UPDATE users SET team = $1 WHERE id = $2', [team, user.id])
        .then(function() {
            return user;
        });
    }

    that.setPassword = function(password) {
        return db.queryOne("UPDATE users SET pw_hash = crypt($1, gen_salt('bf')) WHERE id = $2", [password, user.id])
        .then(function() {
            return user;
        });
    }

    that.toString = function() {
        if (user.name) {
            return user.name
        } else {
            return "Guest " + user.guestId;
        }
    }

    return user;
}
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
        return {
            id: user.id,
            name: user.name,
            team: user.team,
            sessionToken: user.sessionToken
        };

    }

    // What users see about each other
    that.getExternalPublicRepresentation = function() {
        return {
            id: user.id,
            name: user.name,
            team: user.team
        }
    };

    return user;
}
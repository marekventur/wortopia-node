import e from "express";


export default function(user, db, logger) {
    var that = user;

    // Returns user, not session token
    that.createSessionToken = async function() {
        const result = user.guest
            ? await db.queryOne('INSERT INTO user_sessions (guest_id) VALUES ($1) RETURNING session_token;', [user.guestId])
            : await db.queryOne('INSERT INTO user_sessions (user_id) VALUES ($1) RETURNING session_token;', [user.id]);

        user.sessionToken = result.session_token;
        if (user.guest) {
            logger.info('Session token for guest %d created: %s', user.guestId, user.sessionToken);
        } else {
            logger.info('Session token for %s created: %s', user.name, user.sessionToken);
        }
        return user;
    }

    // Returns user
    that.resetSessionToken = async function() {
        if (!user.sessionToken) {
            throw new Error('no session token set');
        }
        await db.query("UPDATE user_sessions SET valid_until = now() + INTERVAL '30 days' WHERE session_token = $1",
            [user.sessionToken])
        return user;
    }

    // What a users see about themselves
    that.getExternalPrivateRepresentation = function() {
        return user.loadEmail()
    }

    that.loadEmail = async function() {
        if (user.email) {
            return user;
        }

        // Guests have no email address
        if (user.id < 0) {
            return user;
        }

        const row = await db.queryOne('SELECT email FROM user_emails WHERE user_id = $1', [user.id])
    
        if (!row) {
            throw new Error('No email address for user ' + user.id + ' found');
        }
        user.email = row.email;
        return user;
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

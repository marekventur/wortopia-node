export default function(db, logger, userDecorator) {
    var that = this;

    that.create = async function(username, email, password) {
        const { id } = await db.queryOne("INSERT INTO users (name, pw_hash) VALUES ($1, crypt($2, gen_salt('bf'))) RETURNING id", [username, password])
        await db.query("INSERT INTO user_emails (user_id, email) VALUES ($1, $2)", [id, email])
        const user = await that.getById(id);
        logger.info('User %s created', username);
        return user;
    };

    that.getByName = async function(name) {
        const user = await db.queryOne("SELECT id FROM users WHERE name = $1", [name])
        if (!user) {
            var error = new Error('User not found');
            error.userNotFound = true;
            throw error;
        }
        return await that.getById(user.id);
    }

    that.getById = async function(id) {
        const user = await db.queryOne("SELECT id, name, team, pw_hash FROM users WHERE id = $1", [id])
        if (!user) {
            var error = new Error('User not found');
            error.userNotFound = true;
            throw error;
        }
        return decorateUser(user)
    }

    that.getByEmail = async function(email) {
        const row = await db.queryOne("SELECT user_id FROM user_emails WHERE email = $1", [email])
        if (!row) {
            var error = new Error('User not found');
            error.userNotFound = true;
            throw error;
        }
        return that.getById(row.user_id);
    }

    that.createNewGuest = function() {
        return db.queryOne('SELECT COALESCE(MAX(guest_id), 0) as top FROM user_sessions')
        .then(function(row) {
            return that.createGuestById(row ? (row.top + 1) : 1);
        })
    }

    that.createGuestById = function(guestId) {
        return decorateUser({
            guest: true,
            guestId: guestId,
            id: -guestId
        });
    }

    that.getBySessionToken = async function(sessionToken) {
        if (!sessionToken) {
            throw new Error('No session token provided');
        }
        const row = await db.queryOne(
            "SELECT user_id, guest_id FROM user_sessions WHERE session_token = $1 AND valid_until > now()",
            [sessionToken]
        );
       
        let user;
        if (row.user_id) {
            user = await that.getById(row.user_id);
        } else if (row.guest_id) {
            user = await that.createGuestById(row.guest_id);
        } else {
            throw new Error('Session token invalid');
        }

        if (!user) {
            throw new Error('Session token or user not found');
        }
        user.sessionToken = sessionToken;
        return user;
    }

    that.getViaLogin = async function(username, password) {
        let user = await db.queryOne("SELECT pw_hash = crypt($1, pw_hash) as valid, id FROM users WHERE name = $2", [password, username])
        if (!user) {
            // Allow login with email address
            user = await db.queryOne("SELECT u.pw_hash = crypt($1, u.pw_hash) as valid, u.id FROM users u LEFT JOIN user_emails e ON u.id = e.user_id WHERE e.email = $2", [password, username])
        }
    
        if (!user || !user.valid) {
            var error = new Error('Username or password incorrect');
            error.invalidUsernameOrPassword = true;
            throw error;
        }
        delete user.valid;
        return await that.getById(user.id);
    }

    function decorateUser(rawUser) {
        return userDecorator(rawUser);
    }
}
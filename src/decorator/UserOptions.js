var _ = require('underscore');

module.exports = function(user, db) {
    var that = user;

    that.setOptions = function(options) {
        return db.query('UPDATE users SET options = $1 WHERE id = $2', [options, user.id]);
    }

    that.getOptions = function() {
        return db.queryOne('SELECT options FROM users WHERE id = $1', [user.id])
        .then(function(row) {
            return row.options;
        });
    }
}
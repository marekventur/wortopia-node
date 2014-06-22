var Q = require('q');

module.exports = function(user) {
    var pwHash = user.pw_hash;
    delete user.pw_hash; // Don't let that field be public on the object

    user.getPasswordHash = function() {
        if (user.guest) {
            throw new Error('Can not return password hash for guest');
        }
        return pwHash;
    }
}
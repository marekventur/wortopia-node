module.exports = function(config, messageAuthenticationCodeManager, userDao) {
    var that = this;

    this.createUrl = function(user) {
        var payload = {u: user.id, t: 'pwr', h: user.getPasswordHash()};
        return config.rootUrl + '/recover?t=' + messageAuthenticationCodeManager.create(payload, user.getPasswordHash());
    }

    this.verifyUser = function(token) {
        var payload = messageAuthenticationCodeManager.verify(token);
        if (payload.t !== 'pwr') {
            throw new Error('This is not a valid recover token');
        }
        return userDao.getById(payload.u)
        .then(function(user) {
            if (!user || payload.h !== user.getPasswordHash()) {
                throw new Error('This is not a valid recover token');
            }
            return user;
        })
    }
}
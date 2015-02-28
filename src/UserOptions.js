module.exports = function(socket, logger) {
    var that = this;

    that.start = function() {
        socket.on('extern_setUserOptions', setUserOptions);
    };

    function setUserOptions(data, user, size, send) {
        user.setOptions(data)
        .fail(function(error) {
            logger.error('Saving options failed', error);
        });
    }
}
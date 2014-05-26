var _ = require('underscore');
var Q = require('q');

module.exports = function(gameServer, logger, socket) {
    var that = this;

    that.start = function() {
        socket.on('extern_guess', handleGuess);
    };

    function handleGuess(data, user, size, send) {
        var field = gameServer.getCurrentField(size);
        var word = data.word;
        var id = data.id;

        field.guessWord(user, word)
        .then(function(word) {
            send('guessResponse', {id: id, status: 'correct', points: word.points});
        })
        .fail(function(err) {
            if (err.code) {
                send('guessResponse', {id: id, status: err.code});
            } else {
                logger.error(err);
                send('guessResponse', {id: id, status: 'unexpected'});
            }
        });
    }
}

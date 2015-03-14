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

        if (field) {
            field.guessWord(user, word)
            .then(function(word) {
                send('guessResponse', {id: id, status: 'correct', points: word.points});
                if (!word.timesGuessed) {
                    word.timesGuessed = 1;
                } else {
                    ++word.timesGuessed;
                }
            })
            .fail(function(err) {
                if (err.code) {
                    send('guessResponse', {id: id, status: err.code});
                } else {
                    logger.error(err);
                    send('guessResponse', {id: id, status: 'unexpected'});
                }
            });
        } else {
            send('guessResponse', {id: id, status: 'tooLate'});
        }

    }
}

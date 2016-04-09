var _ = require('underscore');
var Q = require('q');
module.exports = function(field) {
    var checkedWords = {};

    field.guessWord = function(user, word) {
        return field.getWords()
        .then(function(words) {
            var foundWord = _.findWhere(words, {word: word});
            if (foundWord) {
                if (field.scoreForPlayer(user, foundWord)) {
                    return Q(foundWord);
                } else {
                    return Q.reject(newErrorWithCode('dublicated'));
                }
            } else {
                if (field.isFinished()) {
                    return Q.reject(newErrorWithCode('tooLate'));
                } else if (!field.allowed(word)) {
                    return Q.reject(newErrorWithCode('tooShort'));
                } else if (!field.contains(word)) {
                    return Q.reject(newErrorWithCode('notOnField'));
                } else {
                    return Q.reject(newErrorWithCode('notInDictionary'));
                }
            }
        });
    }

    function newErrorWithCode (code) {
        var error = new Error('Word is not accepted: ' + code);
        error.code = code;
        return error;
    }
}

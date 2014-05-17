var Q = require('q');
var _ = require('underscore');

module.exports = function(field, db, logger, config) {
    var that = field;
    var words = null;
    var size = field.length;

    that.getWords = function() {
        if (words === null) {
            var startingCombinations = field.getAllStartingCombinations();
            var inStatement = _.map(startingCombinations, function(letter) { return "'" + letter.toLowerCase() + "'"}).join(',');
            var sql = "SELECT word FROM words WHERE substring(replace(word, 'qu', 'q') for 2) IN (" + inStatement + ") AND word ~ '^[" + that.getAllLetters() + "]*$' AND char_length(word) >= $1 AND accepted = true;"
            var start = new Date().getTime();
            var afterQuery = null;
            var afterChecks = null;
            return db.query(sql, [config.language.minimumWordLengthPerFieldSize[size]])
            .then(function(rows) {
                afterQuery = new Date().getTime();
                words = _.chain(rows).pluck('word').filter(field.allowed).filter(field.contains).value();
                words = wrapWords(words);
                afterCheck = new Date().getTime();
                logger.info('Timing: Database %d ms; Node %d ms', afterQuery - start, afterCheck - afterQuery);
                return words;
            })


        } else {
            return Q.resolve(words);
        }
    }

    that.getWordsSync = function() {
        return words;
    }

    function wrapWords(words) {
        return _.map(words, function(word) {
            var length = word.replace('qu', 'q').length;
            var points = config.language.scores
            return {
                word: word,
                length: length,
                points: config.language.scores[length]
            };
        })
    }

}
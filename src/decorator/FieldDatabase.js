
import _ from "underscore";

export default function(field, db, logger, config) {
    var that = field;
    var words = null;
    var size = field.length;

    that.getWords = async function() {
        if (words === null) {
            var startingCombinations = field.getAllStartingCombinations();
            var inStatement = _.map(startingCombinations, function(letter) { return "'" + letter.toLowerCase() + "'"}).join(',');
            var sql = "SELECT word FROM words WHERE substring(replace(word, 'qu', 'q') for 2) IN (" + inStatement + ") AND word ~ '^[" + that.getAllLetters() + "]*$' AND char_length(word) >= $1 AND accepted = true;"
            var start = new Date().getTime();
            var afterQuery = null;
            var afterCheck = null;
            const rows = await db.query(sql, [config.language.minimumWordLengthPerFieldSize[size]])
            afterQuery = new Date().getTime();
            words = _.chain(rows).pluck('word').filter(field.allowed).filter(field.contains).value();
            words = wrapWords(words);
            afterCheck = new Date().getTime();
            logger.info('Timing: Database %d ms; Node %d ms', afterQuery - start, afterCheck - afterQuery);
        } 
        return words;
    }

    that.getWordsSync = function() {
        if (words === null) {
            throw new Error('Words are not loaded yet');
        }
        return words;
    }

    function wrapWords(words) {
        return _.map(words, function(word) {
            var length = word.replace('qu', 'q').length;
            return {
                word: word,
                length: length,
                points: config.language.scores[length]
            };
        })
    }

}
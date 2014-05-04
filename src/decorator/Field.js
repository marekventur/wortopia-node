var Q = require('q');
var _ = require('underscore');

module.exports = function(field, db, logger) {
    var that = field;
    var words = null;
    var size = field.length;

    // Returns user, not session token
    that.getSize = function() {
        return size;
    }

    that.getWords = function() {
        if (words === null) {
            var startingCombinations = field.getAllStartingCombinations();
            var inStatement = _.map(startingCombinations, function(letter) { return "'" + letter.toLowerCase() + "'"}).join(',');
            var sql = "SELECT word FROM words WHERE substring(replace(word, 'qu', 'q') for 2) IN (" + inStatement + ") AND word ~ '^[" + that.getAllLetters() + "]*$' AND accepted = true;"
            var start = new Date().getTime();
            var afterQuery = null;
            var afterChecks = null;
            return db.query(sql)
            .then(function(rows) {
                afterQuery = new Date().getTime();
                words = _.chain(rows).pluck('word').filter(field.allowed).filter(field.contains).value();
                afterCheck = new Date().getTime();
                logger.info('Timing: Database %d ms; Node %d ms', afterQuery - start, afterCheck - afterQuery);
                return words;
            })


        } else {
            return Q.resolve(words);
        }
    }

    that.getAllLetters = function() {
        return _.uniq(_.flatten(that)).join('');
    }

    that.allowed = function(word) {
        if (size == 4) {
            return word.length > 2;
        } else {
            return word.length > 3;
        }
    }

    that.contains = function(word) {
        word = word.toLowerCase();
        var found = false;

        for (var y = 0; y < size && !found; y++) {
            for (var x = 0; x < size && !found; x++) {
                found = recursiveCheck(field, word, 0, x, y, field.getSize());
            }
        }

        return found;
    }

    that.toString = function() {
        return _.map(that, function(row) {
            return row.join('')
        }).join('|');
    }

    function cloneField(field) {
        return _.map(field, function(row) {
            return row.slice(0);
        });
    }

    function recursiveCheck(restField, word, positionInWord, x, y) {
        if (restField[y][x] !== word.charAt(positionInWord)) {
            return false;
        }
        if (word.length === positionInWord + 1) {
            return true;
        }
        var clonedField = cloneField(restField);
        clonedField[y][x] = null;
        var found = false;
        for (var ny = y-1; ny <= y+1 && !found; ny++) {
            for (var nx = x-1; nx <= x+1 && !found; nx++) {
                if (nx >= 0 && ny >= 0 && ny < size && nx < size && (ny != y || nx != x)) {
                    found = recursiveCheck(clonedField, word, positionInWord + 1, nx, ny);
                }
            }
        }
        return found;
    }

    that.getAllStartingCombinations = function() {
        // Find all two-letter combinations
        var twoLetterStartings = [];
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var c1 = field[y][x];
                if (x > 0) {
                    twoLetterStartings.push(c1 + field[y][x - 1]);
                    if (y > 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x - 1]);
                    }
                    if (y < size - 1) {
                        twoLetterStartings.push(c1 + field[y + 1][x - 1]);
                    }
                }
                if (x < size - 1) {
                    twoLetterStartings.push(c1 + field[y][x + 1]);
                    if (y > 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x + 1]);
                    }
                    if (y < size - 1) {
                        twoLetterStartings.push(c1 + field[y + 1][x + 1]);
                    }
                }
                if (y > 0) {
                    twoLetterStartings.push(c1 + field[y - 1][x]);
                }
                if (y < size - 1) {
                    twoLetterStartings.push(c1 + field[y + 1][x]);
                }
            }
        }
        return _.uniq(twoLetterStartings);
    }



    return field;
}
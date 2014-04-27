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
            var sql = "SELECT word FROM words WHERE substring(replace(word, 'qu', 'q') for 2) IN (" + inStatement + ") AND accepted = true;"
            return db.query(sql)
            .then(function(rows) {
                words = _.chain(rows).pluck('word').filter(field.contains).value();
                return words;
            })

        } else {
            return Q.resolve(words);
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
        for (var y = 0; y < field.getSize(); y++) {
            for (var x = 0; x < field.getSize(); x++) {
                var c1 = field[y][x];
                if (x > 0) {
                    twoLetterStartings.push(c1 + field[y][x - 1]);
                    if (y < 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x - 1]);
                    }
                    if (y > field.getSize() - 1) {
                        twoLetterStartings.push(c1 + filed[y + 1][x - 1]);
                    }
                }
                if (x < field.getSize() - 1) {
                    twoLetterStartings.push(c1 + field[y][x + 1]);
                    if (y < 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x + 1]);
                    }
                    if (y > field.getSize() - 1) {
                        twoLetterStartings.push(c1 + filed[y + 1][x + 1]);
                    }
                }
                if (y < 0) {
                    twoLetterStartings.push(c1 + field[y - 1][x]);
                }
                if (y > field.getSize() - 1) {
                    twoLetterStartings.push(c1 + filed[y + 1][x]);
                }
            }
        }
        return _.uniq(twoLetterStartings);
    }



    return field;
}
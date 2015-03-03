if (typeof require === 'function') {
    var _ = require('underscore');
}

function fieldContainsFactoryMethod(field) {
    if (!field) {
        return;
    }

    var that = field;
    var size = field.length;

    that.contains = function(word) {
        word = word.toLowerCase();
        var chain = null;

        for (var y = 0; y < size && !chain; y++) {
            for (var x = 0; x < size && !chain; x++) {
                chain = recursiveCheck(field, word, 0, x, y, []);
            }
        }
        return chain;
    }

    function recursiveCheck(restField, word, positionInWord, x, y, lastChain) {
        if (restField[y][x] !== word.charAt(positionInWord)) {
            return null;
        }

        var chainToHere = lastChain.slice(0);
        chainToHere.push({x: x, y: y});

        if (word.length === positionInWord + 1) {
            return chainToHere;
        }
        var clonedField = cloneField(restField);
        clonedField[y][x] = null;
        var chain = null;
        for (var ny = y-1; ny <= y+1 && !chain; ny++) {
            for (var nx = x-1; nx <= x+1 && !chain; nx++) {
                if (nx >= 0 && ny >= 0 && ny < size && nx < size && (ny != y || nx != x)) {
                    chain = recursiveCheck(clonedField, word, positionInWord + 1, nx, ny, chainToHere);
                }
            }
        }
        return chain;
    }

    function cloneField(field) {
        return _.map(field, function(row) {
            return row.slice(0);
        });
    }

    return field;
}

// Make sure this class can be used in the browser as well as in node
if (typeof module === 'object') {
    module.exports = fieldContainsFactoryMethod;
} else {
    function FieldFactory() {
        var that = this;
        that.create = function(field) {
            fieldContainsFactoryMethod(field);
            return field;
        }
    }
}
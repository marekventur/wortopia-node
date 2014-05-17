var Q = require('q');
var _ = require('underscore');

module.exports = function(field) {
    var that = field;
    var words = null;
    var size = field.length;

    that.getSize = function() {
        return size;
    }

    that.getStatsSync = function() {
        if (words) {
            var points = 0;
            _.each(words, function(word) {
                points += word.points;
            });
            return {
                words: words.length,
                points: points
            };
        } else {
            return {};
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

    that.toString = function() {
        return _.map(that, function(row) {
            return row.join('')
        }).join('|');
    }
}
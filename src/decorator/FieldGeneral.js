
import _ from "underscore";

export default function(field) {
    var that = field;
    var size = field.length;

    that.getSize = function() {
        return size;
    }

    that.getStatsSync = function() {
        return {
            points: that.getTotalPointsSync(),
            words: that.getWordCountSync()
        };
    }

    that.getTotalPointsSync = function() {
        var points = 0;
        _.each(that.getWordsSync(), function(word) {
            points += word.points;
        });
        return points;
    }

    that.getWordCountSync = function() {
        return that.getWordsSync().length;
    }

    that.getAllLetters = function() {
        return _.uniq(_.flatten(that)).join('');
    }

    that.allowed = function(word) {
        if (size == 4) {
            return word.toLowerCase().replace('qu', 'q').length > 2;
        } else {
            return word.toLowerCase().replace('qu', 'q').length > 3;
        }
    }

    that.toString = function() {
        return _.map(that, function(row) {
            return row.join('')
        }).join('|');
    }
}
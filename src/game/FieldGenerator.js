var _ = require('underscore');

module.exports = function(config, fieldDecorator) {
    var that = this;

    that.createField = function(size) {
        var languageConfig = config.language;

        // Shuffle letters and arrange them on the board
        var distribution = JSON.parse(JSON.stringify(languageConfig.distribution));
        var distributionString = "";
        _.each(distribution, function(occurence, letter) {
            distributionString += Array(occurence + 1).join(letter.toLowerCase());
        });
        var randomLetters = _.sample(distributionString.split(''), size * size);
        var fieldAsString = randomLetters.join('');

        return that.createFieldFromString(fieldAsString);
    }

    that.createFieldFromString = function(fieldAsString) {
        var size;
        if (fieldAsString.length == 16) {
            size = 4;
        } else if (fieldAsString.length == 25) {
            size = 5;
        } else {
            throw new Error('Invalid field:' + string);
        }

        var field = [];
        for (var y = 0; y < size; y++) {
            var row = [];
            field.push(row);
            for (var x = 0; x < size; x++) {
                row.push(fieldAsString.charAt(y * size + x));
            }
        }
        field.size = size;

        return fieldDecorator.decorate(field);
    }

}

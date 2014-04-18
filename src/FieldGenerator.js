var async = require('async');
var _ = require('underscore');
module.exports = function(config, redis, redisKeyGenerator, logger) {
    var that = this;

    that.createField = function(size, language, callback) {
        var languageConfig = config.languages[language];

        // Shuffle letters and arrange them on the board
        var distribution = JSON.parse(JSON.stringify(languageConfig.distribution));
        var distributionString = "";
        _.each(distribution, function(occurence, letter) {
            distributionString += Array(occurence + 1).join(letter);
        });
        var randomLetters = _.sample(distributionString.split(''), size * size);
        var fieldAsString = randomLetters.join('');

        var field = [];
        for (var y = 0; y < size; y++) {
            var row = [];
            field.push(row);
            for (var x = 0; x < size; x++) {
                row.push(randomLetters[y * size + x]);
            }
        }

        // Find all two-letter combinations
        var twoLetterStartings = [];
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var c1 = field[y][x];
                if (x > 0) {
                    twoLetterStartings.push(c1 + field[y][x - 1]);
                    if (y < 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x - 1]);
                    } 
                    if (y > size - 1) {
                        twoLetterStartings.push(c1 + filed[y + 1][x - 1]);
                    } 
                } 
                if (x < size - 1) {
                    twoLetterStartings.push(c1 + field[y][x + 1]);
                    if (y < 0) {
                        twoLetterStartings.push(c1 + field[y - 1][x + 1]);
                    } 
                    if (y > size - 1) {
                        twoLetterStartings.push(c1 + filed[y + 1][x + 1]);
                    } 
                }
                if (y < 0) {
                    twoLetterStartings.push(c1 + field[y - 1][x]);
                } 
                if (y > size - 1) {
                    twoLetterStartings.push(c1 + filed[y + 1][x]);
                } 
            }
        }
        twoLetterStartings = _.uniq(twoLetterStartings);

        // Get all words from redis that start with those two letters
        var redisWordListKey = redisKeyGenerator.getWordsKey(language);
        async.map(twoLetterStartings, function(starting, done) {
            redis.sscan([redisWordListKey, 0, 'MATCH', starting + '*', 'COUNT', 10000000], function(err, result) {
                if (err) {
                    done(err);
                    return;
                }

                done(null, result[1]);
            }); 
        }, function(err, results) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }

            var possibleWords = _.compact(_.flatten(results));
            logger.info(possibleWords);

            // Check these words on the field

            var validWordsKey = 'field.' + fieldAsString + '.validWords';

            callback(null, {
                field: field,
                validWordsKey: validWordsKey
            });
        });
        

    } 
}

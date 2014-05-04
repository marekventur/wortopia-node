var _ = require('underscore');
var Q = require('q');

module.exports = function(config, fieldGenerator, logger) {
    var that = this;
    var currentFields, nextFields;

    that.start = function() {
        return calculateNextFields()
        .then(function() {
            startRound();
        });
    };

    function calculateNextFields() {
        nextFields = {4: null, 5: null};
        var start = new Date().getTime();
        var promises = _.map(nextFields, function(currentField, size) {
            nextFields[size] = fieldGenerator.createField(size);
            return nextFields[size].getWords();
        });

        return Q.all(promises).then(function() {
            logger.info('Finding words took %d ms', new Date().getTime() - start);
        });
    }

    function startRound() {
        currentFields = nextFields;

        var promises = _.map(nextFields, function(currentField, size) {
            return nextFields[size].getWords();
        });

        Q.all(promises)
        .then(function(words) {
            logger.info('Starting round with field %s (%d words) and %s (%d words)', currentFields[4], words[0].length, currentFields[5], words[1].length);
        })
        .then(function() {
            setTimeout(startPause, 3 * 1  * 1000);
        })
        .fail(function(err) {
            logger.error('Error while trying to start round:', err);
            // ToDo Try again?
        })
    }

    function startPause() {
        logger.info('Round over, calculating points...');
        Q.all([
            calculateNextFields(),
            Q.delay(3 * 1000)
        ])
        .then(function() {
            startRound();
        })
        .fail(function(err) {
            logger.error('Error while trying to calculate next fields:', err);
            // ToDo Try again?
        });
    }

}

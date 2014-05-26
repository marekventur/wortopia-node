var _ = require('underscore');
var Q = require('q');

module.exports = function(config, fieldGenerator, logger, socket) {
    var that = this;
    var currentFields, nextFields, lastFields;
    var nextEventTimestamp;

    that.start = function() {
        return calculateNextFields()
        .then(function() {
            socket.on('connected', function(user, size, send) {
                send('fields', getFieldsPayload(size));
                var playerResult = getPlayerResult(size, user);
                if (playerResult) {
                    send('playerResult', playerResult);
                }
            });

            startRound();
        });
    };

    that.getCurrentField = function(size) {
        return currentFields[size];
    }

    function getFieldsPayload(size) {
        return {
            currentField: currentFields ? currentFields[size] : null,
            lastField: lastFields ? lastFields[size] : null,
            lastWords: lastFields ? lastFields[size].getWordsSync() : null,
            lastStats: lastFields ? lastFields[size].getStatsSync() : null,
            remaining: (nextEventTimestamp - now())
        };
    }

    function getPlayerResult(size, user) {
        if (currentFields) {
            return currentFields[size].getResultForPlayer(user);
        }
        return null;
    }

    function broadcastFields() {
        [4, 5].forEach(function(size) {
            socket.broadcast('fields', size, getFieldsPayload(size));
        });
    }

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
        nextEventTimestamp = now() + config.gameTime;
        setTimeout(startPause, config.gameTime);
        broadcastFields();

        logger.info('Starting round with field %s (%d words) and %s (%d words)',
            currentFields[4], currentFields[4].getWordsSync().length,
            currentFields[5], currentFields[5].getWordsSync().length);
    }

    function startPause() {
        lastFields = currentFields;
        currentFields = null;
        nextEventTimestamp = now() + config.pauseTime;
        broadcastFields();
        logger.info('Round over, calculating points...');

        // Onlys start next round when both 30 seconds have passed
        // and the next field has been calculated
        Q.all([
            calculateNextFields(),
            Q.delay(config.pauseTime)
        ])
        .then(function() {
            startRound();
        })
        .fail(function(err) {
            logger.error('Error while trying to calculate next fields:', err);
            // ToDo Try again?
        });
    }

    function now() {
        return Date.now();
    }

}

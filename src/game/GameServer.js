import _ from "underscore";


export default function(config, fieldGenerator, logger, socket) {
    var that = this;
    var currentFields, nextFields, lastFields;
    var nextEventTimestamp;

    that.start = function() {
        return calculateNextFields()
        .then(function() {
            socket.on('connected', function(user, size, send) {
                send('fields', getFieldsPayload(size));

                send('playersPerField', getPlayersPerField());

                var playerResult = getPlayerResult(size, user);
                if (playerResult) {
                    send('playerResult', playerResult);
                }
            });

            startRound();
        });
    };

    that.getCurrentField = function(size) {
        if (!currentFields) {
            return null;
        }
        return currentFields[size];
    }

    function getFieldsPayload(size) {
        return {
            currentField: currentFields ? currentFields[size] : null,
            lastField: lastFields ? lastFields[size] : null,
            lastWords: lastFields ? lastFields[size].getWordsSync() : null,
            lastStats: lastFields ? lastFields[size].getStatsSync() : null,
            lastResults: lastFields ? lastFields[size].getResult() : [],
            remaining: (nextEventTimestamp - now())
        };
    }

    function getPlayersPerField() {
        if (lastFields) {
            return {
                4: lastFields[4].getPlayersCount(),
                5: lastFields[5].getPlayersCount()
            };
        } else {
            return {4: 0, 5: 0};
        }
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
            socket.broadcast('playersPerField', size, getPlayersPerField());
        });
    }

    async function calculateNextFields() {
        nextFields = {4: null, 5: null};
        var start = new Date().getTime();
        await Promise.all(_.map(nextFields, function(currentField, size) {
            nextFields[size] = fieldGenerator.createField(size);
            return nextFields[size].getWords();
        }));

        logger.info('Finding words took %d ms', new Date().getTime() - start);
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

    async function startPause() {
        lastFields = currentFields;
        currentFields = null;
        nextEventTimestamp = now() + config.pauseTime;
        logger.info('Round over, calculating points...');
        if (lastFields) {
            _.each(lastFields, function(lastField) {
                lastField.finishGame();
                lastField.saveToDb()
                .catch(function(error) {
                    logger.error("Error saving result: %s", error);
                });
            });
        }
        broadcastFields();

        try {
            // Onlys start next round when both 30 seconds have passed
            // and the next field has been calculated
            await Promise.all([
                calculateNextFields(),
                new Promise(resolve => setTimeout(resolve, config.pauseTime))
            ])
            startRound();
        } catch (err) {
            logger.error('Error while trying to calculate next fields:', err);
            // ToDo Try again?
        }
    }

    function now() {
        return Date.now();
    }
}

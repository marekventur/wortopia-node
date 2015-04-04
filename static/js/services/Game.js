function Game(socket, fieldFactory, tracking) {
    var that = this;

    var currentField = null;
    var lastField = null;
    var lastWords = null;
    var lastStats = null;
    var nextEvent = null;
    var guesses = [];
    var lastResults = [];
    var lastPlayers = [];
    var points = 0;
    var lastGuessingMethod = 'unknown'; // keyboard, mouseSingle, mouseSwipe, touchSingle, touchSwipe
    that.ready = false;

    // ToDo: Do a ping/pong to get a better value for this
    var latencyAllowance = 300;

    socket.on('fields', function(data) {
        currentField = fieldFactory.create(data.currentField);
        lastField = fieldFactory.create(data.lastField);
        lastWords = data.lastWords;
        lastStats = data.lastStats;
        nextEvent = now() + data.remaining;
        setLastResults(data.lastResults);

        that.ready = true;

        that.emit('updateCurrentField');
        that.emit('updateLastField');
        that.emit('switchBetweenPauseAndGame');
        if (currentField) {
            that.emit('gameOngoing');
            points = 0;
        } else {
            that.emit('gamePaused');
            guesses = [];
        }
    });

    function setLastResults(results) {
        lastResults = results;
        lastPlayers = [];
        _.each(results, function(playerOrTeam) {
            if (playerOrTeam.team) {
                _.each(playerOrTeam.players, function(player) {
                    lastPlayers.push(player);
                });
            } else {
                lastPlayers.push(playerOrTeam);
            }
        });
    }


    socket.on('playerResult', function(result) {
        points = 0;
        guesses = _.map(result.words, function(word) {
            points += word.points;
            return {word: word.word, points: word.points, status: 'correct'};
        }).reverse();
        that.emit('guessesUpdated');
    });

    that.getCurrentField = function() {
        return currentField;
    }

    that.getLastField = function() {
        return lastField;
    }

    that.getLastWords = function() {
        return lastWords;
    }

    that.getLastStats = function() {
        return lastStats;
    }

    that.getRemaining = function() {
        return Math.max(0, nextEvent - now() - latencyAllowance);
    }

    that.getLastResults = function() {
        return lastResults;
    }

    that.getLastPlayers = function() {
        return lastPlayers;
    }

    var guessId = 0;
    that.guess = function(word) {
        guesses.unshift({
            word: word,
            status: 'waiting',
            id: guessId
        });
        socket.send('guess', {word: word, id: guessId});
    }

    socket.on('guessResponse', function(data) {
        var guessId = data.id;
        var guess = _.findWhere(guesses, {id: guessId});
        if (guess) {
            guess.status = data.status;
            if (guess.status === 'correct') {
                guess.points = data.points;
                points += data.points;
                that.emit('guessCorrect');
            } else {
                that.emit('guessIncorrect');
            }
            that.emit('guessesUpdated');

            tracking.event('guess', guess.status, lastGuessingMethod);
        }
    });

    that.getPoints = function() {
        return points;
    }

    that.getGuesses = function() {
        return guesses;
    }

    function now() {
        return new Date().getTime();
    }

    that.setLastGuessingMethod = function(method) {
        lastGuessingMethod = method;
    }
}

Game.prototype = new EventEmitter();
Game.prototype.constructor = Game;
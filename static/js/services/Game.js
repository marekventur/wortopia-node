function Game(socket, fieldFactory) {
    var that = this;

    var currentField = null;
    var lastField = null;
    var lastWords = null;
    var lastStats = null;
    var nextEvent = null;
    var guesses = [];
    var lastResults = [{"user":{"id":2,"name":"Jill"},"words":[{"word":"teapot","points":3},{"word":"tea","points":1}],"points":4,"percent":33},{"team":true,"name":"team1","words":[{"word":"bloom","points":2},{"word":"tea","points":1}],"players":[{"user":{"id":4,"name":"Lee"},"words":[{"word":"bloom","points":2},{"word":"tea","points":1}],"points":3,"teamName":"team1","percent":25},{"user":{"id":3,"name":"Sue"},"words":[{"word":"tea","points":1}],"points":1,"teamName":"team1","percent":8}],"points":3,"percent":25},{"user":{"id":1,"name":"John"},"words":[{"word":"tea","points":1}],"points":1,"percent":8}];
    var lastPlayers = [1, 2, 3];
    var points = 0;
    that.ready = false;

    // ToDo: Do a ping/pong to get a better value for this
    var latencyAllowance = 300;

    socket.on('fields', function(data) {
        currentField = fieldFactory.create(data.currentField);
        lastField = fieldFactory.create(data.lastField);
        lastWords = data.lastWords;
        lastStats = data.lastStats;
        nextEvent = now() + data.remaining;

        that.ready = true;

        that.emit('updateCurrentField');
        that.emit('updateLastField');
        that.emit('switchBetweenPauseAndGame');
        if (currentField) {
            that.emit('gameOngoing');
        } else {
            that.emit('gamePaused');
            guesses = [];
        }
    });


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
        console.log(data);
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
}

Game.prototype = new EventEmitter();
Game.prototype.constructor = Game;
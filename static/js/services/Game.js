function Game(socket, fieldFactory) {
    var that = this;

    var currentField = null;
    var lastField = null;
    var lastWords = null;
    var lastStats = null;
    var nextEvent = null;
    var guesses = [
        {word: 'wait', status: 'waiting'},
        {word: 'yep', status: 'correct', points: 2},
        {word: 'twice', status: 'dublicated'},
        {word: 'notonfield', status: 'notOnField'},
        {word: 'notindic', status: 'notInDictionary'},
        {word: 'late', status: 'tooLate'},
    ];
    that.ready = false;

    // ToDo: Do a ping/pong to get a better value for this
    var latencyAllowance = 300;

    socket.on('fields', function(data) {
        currentField = fieldFactory.create(data.currentField);
        lastField = fieldFactory.create(data.lastField);
        lastWords = data.lastWords;
        lastStats = data.lastStats;
        nextEvent = now() + data.remaining;

        // todo: pass guesses through
        //guesses = [];

        that.ready = true;

        that.emit('updateCurrentField');
        that.emit('updateLastField');
        that.emit('switchBetweenPauseAndGame');
        if (currentField) {
            that.emit('gameOngoing');
        } else {
            that.emit('gamePaused');
        }
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

    that.guess = function(word) {
        guesses.unshift({
            word: word,
            status: 'waiting'
        });
        console.log(guesses);
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
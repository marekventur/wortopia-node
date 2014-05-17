function Game(socket, fieldFactory) {
    var that = this;

    var currentField = null;
    var lastField = null;
    var lastWords = null;
    var lastStats = null;
    var nextEvent = null;
    that.ready = false;

    // ToDo: Do a ping/pong to get a better value for this
    var latencyAllowance = 300;

    socket.on('fields', function(data) {
        currentField = fieldFactory.create(data.currentField);
        lastField = fieldFactory.create(data.lastField);
        lastWords = data.lastWords;
        lastStats = data.lastStats;
        console.log(currentField, lastField);
        nextEvent = now() + data.remaining;

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

    function now() {
        return new Date().getTime();
    }
}

Game.prototype = new EventEmitter();
Game.prototype.constructor = Game;
function Timer(game) {
    var that = this;

    game.on('updateCurrentField', function() {
        updateOnNextSecondBarrier();
    });

    var tickerTimeout;
    function updateOnNextSecondBarrier() {
        clearTimeout(tickerTimeout);
        tickerTimeout = setTimeout(function() {
            updateOnNextSecondBarrier();
            that.emit('tick', getFormatedRemainingTime());
        }, game.getRemaining() % 1000 - 500);
    }

    function getFormatedRemainingTime() {
        var remainingSeconds = Math.floor(game.getRemaining() / 1000);
        var seconds = remainingSeconds % 60;
        var minutes = Math.floor(remainingSeconds / 60);
        return minutes + ':' + ('0' + seconds).slice(-2);
    }
}

Timer.prototype = new EventEmitter();
Timer.prototype.constructor = Timer;
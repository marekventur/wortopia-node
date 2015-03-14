module.exports = function(expressWrapper, highscoreQuery, logger) {
    var that = this;

    that.start = function() {
        expressWrapper.app.get('/highscore', function(req, res) {
            var size = parseInt(req.query.size, 10);
            var interval = Math.max(Math.min(parseInt(req.query.interval, 10), 356), 1);
            if (size !== 4 && size !== 5) {
                res.send(400, {error: 'invalidSize'});
            } else {
                highscoreQuery.query(size, interval)
                .then(function(highscore) {
                    res.send(highscore);
                }, function(err) {
                    logger.error('Error caught while trying to fetch highscore:', err);
                    res.send(500, {error: 'unknown'});
                });
            }
        });
    }

}
module.exports = function(expressWrapper, highscoreQuery) {
    var that = this;

    that.start = function() {
        expressWrapper.app.get('/highscore', function(req, res) {
            var size = parseInt(req.query.size, 10);
            if (size !== 4 && size !== 5) {
                res.send(400, {error: 'invalidSize'});
            } else {
                highscoreQuery.query(size)
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
module.exports = function(expressWrapper, socket, config, logger) {
    var that = this;

    that.start = function() {
        var httpServer = require('http').createServer(expressWrapper.app);
        //socket.sockjs().installHandlers(httpServer , {prefix:'/sockjs'});
        httpServer.listen(config.port);
        logger.info('Listening on port %d', config.port);
    }
    
}
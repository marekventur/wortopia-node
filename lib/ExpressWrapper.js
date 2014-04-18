var express = require('express');
var serveStatic = require('serve-static');

module.exports = function(config, logger) {
    var that = this;

    that.app = express();

    that.start = function() {
        that.app.use(serveStatic(__dirname + '/../static-build'));
    }

}
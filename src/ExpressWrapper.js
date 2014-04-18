var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

module.exports = function(config, logger) {
    var that = this;

    that.app = express();

    that.start = function() {
        that.app.use(serveStatic(__dirname + '/../static-build'));
        that.app.use(bodyParser());
    }

}
var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(config, logger) {
    var that = this;

    that.app = express();

    that.start = function() {
        that.app.get("/", function(req, res) {
        	res.redirect('/4');
        });
        that.app.get(/\/[45]/, function(req, res) {
        	res.sendfile(path.normalize(__dirname + '/../static-build/index.html'));
        });
        that.app.use(serveStatic(__dirname + '/../static-build'));
        that.app.use(bodyParser());
    }

}
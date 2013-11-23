var express = require('express');

module.exports = function(config, logger) {
    var that = this;

    that.app = express();

    that.start = function() {
        that.app.use(express.static(__dirname + '/../static'));
    }    

}
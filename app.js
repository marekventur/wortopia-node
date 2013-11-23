var ExpressWrapper = require('./lib/ExpressWrapper');
var HttpServer = require('./lib/HttpServer');
var Socket = require('./lib/Socket');

var config = require('./config.json');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "main"});

var expressWrapper = new ExpressWrapper(config, logger);
var socket = new Socket(config, logger);
var httpServer = new HttpServer(expressWrapper, socket, config, logger);

expressWrapper.start();
httpServer.start();
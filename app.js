var ExpressWrapper = require('./lib/ExpressWrapper');
var HttpServer = require('./lib/HttpServer');
var Socket = require('./lib/Socket');
var WordListUpdater = require('./lib/WordListUpdater');
var RedisKeyGenerator = require('./lib/RedisKeyGenerator');
var FieldGenerator = require('./lib/FieldGenerator');
var WordChecker = require('./lib/WordChecker');

var config = require('./config.json');
var redis = require('redis').createClient(config.redis.port, config.redis.host);
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "main"});

var redisKeyGenerator = new RedisKeyGenerator();
var wordChecker = new WordChecker();
var fieldGenerator = new FieldGenerator(config, redis, redisKeyGenerator, logger);
var expressWrapper = new ExpressWrapper(config, logger);
var socket = new Socket(config, logger);
var httpServer = new HttpServer(expressWrapper, socket, config, logger);
var wordListUpdater = new WordListUpdater(redis, config, logger, redisKeyGenerator)

//wordListUpdater.start();
expressWrapper.start();
httpServer.start();
/*
fieldGenerator.createField(5, 'de', function(err, data) {
    if (err) {
        throw err;
    }

    logger.info(data);
});
*/


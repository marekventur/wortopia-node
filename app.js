var ExpressWrapper = require('./src/ExpressWrapper');
var HttpServer = require('./src/HttpServer');
var Socket = require('./src/Socket');
var WordListUpdater = require('./src/WordListUpdater');
var RedisKeyGenerator = require('./src/RedisKeyGenerator');
var FieldGenerator = require('./src/FieldGenerator');
var WordChecker = require('./src/WordChecker');
var Db = require('./src/Db');
var UserDao = require('./src/UserDao');
var SignupHandler = require('./src/handler/SignupHandler');
var LoginHandler = require('./src/handler/LoginHandler');
var AccountHandler = require('./src/handler/AccountHandler');

var config = require('./config.json');
var databaseConfig = require('./database.json');
var redis = require('redis').createClient(config.redis.port, config.redis.host);
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "main"});

var db = new Db(databaseConfig);
var userDao = new UserDao(db, logger);
var redisKeyGenerator = new RedisKeyGenerator();
var wordChecker = new WordChecker();
var fieldGenerator = new FieldGenerator(config, redis, redisKeyGenerator, logger);
var expressWrapper = new ExpressWrapper(config, logger);
var socket = new Socket(config, logger);
var httpServer = new HttpServer(expressWrapper, socket, config, logger);
var wordListUpdater = new WordListUpdater(redis, config, logger, redisKeyGenerator);
var signupHandler = new SignupHandler(expressWrapper, userDao, logger);
var loginHandler = new LoginHandler(expressWrapper, userDao, logger);
var accountHandler = new AccountHandler(expressWrapper, userDao, logger);

//wordListUpdater.start();
expressWrapper.start();
httpServer.start();
signupHandler.start();
loginHandler.start();
accountHandler.start();
/*
fieldGenerator.createField(5, 'de', function(err, data) {
    if (err) {
        throw err;
    }

    logger.info(data);
});
*/


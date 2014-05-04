module.exports = function() {
    var Di = require('no-configuration-di');
    var di = new Di(__dirname + '/src');

    di.add('config', require('./config.json'));
    di.add('databaseConfig', require('./database.json'));
    di.add('logger', require('bunyan').createLogger({name: "main"}));

    di.load('Db');
    di.load('UserDao');
    di.loadDecorator('decorator/Field');
    di.loadDecorator('decorator/User');
    di.load('game/FieldGenerator');
    di.load('ExpressWrapper');
    di.load('Socket');
    di.load('HttpServer');
    di.load('game/GameServer')
    di.load('handler/SignupHandler');
    di.load('handler/LoginHandler');
    di.load('handler/AccountHandler');

    return di;
}


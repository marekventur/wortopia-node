module.exports = function() {
    var Di = require('no-configuration-di');
    var di = new Di(__dirname + '/src');

    di.add('config', require('./config.js'));
    di.add('logger', require('bunyan').createLogger({name: "main"}));

    di.load('Clock');
    di.load('Db');
    di.loadDecorator('decorator/UserManagement', 'userDecorator');
    di.loadDecorator('decorator/UserPasswordHash', 'userDecorator');
    di.loadDecorator('decorator/UserOptions', 'userDecorator');
    di.load('UserDao');
    di.loadDecorator('decorator/FieldGeneral', 'fieldDecorator');
    di.loadDecorator('decorator/FieldContains', 'fieldDecorator');
    di.loadDecorator('decorator/FieldStartingCombinations', 'fieldDecorator');
    di.loadDecorator('decorator/FieldDatabase', 'fieldDecorator');
    di.loadDecorator('decorator/FieldPlayers', 'fieldDecorator');
    di.loadDecorator('decorator/FieldGuess', 'fieldDecorator');
    di.load('game/FieldGenerator');
    di.load('ExpressWrapper');
    di.load('Socket');
    di.load('Chat');
    di.load('HighscoreQuery');
    di.load('HttpServer');
    di.load('MessageAuthenticationCodeManager');
    di.load('RecoverLinkManager');
    di.load('UserOptions');
    di.load('SesClient');
    di.load('game/GameServer')
    di.load('game/GuessHandler')
    di.load('handler/SignupHandler');
    di.load('handler/LoginHandler');
    di.load('handler/AccountHandler');
    di.load('handler/RecoverHandler');
    di.load('handler/HighscoreHandler');

    return di;
}


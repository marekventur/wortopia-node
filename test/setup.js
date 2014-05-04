GLOBAL.assert = require('chai').assert;
GLOBAL.Q = require('q');
GLOBAL._ = require('underscore');
GLOBAL.sinon = require('sinon');

var Di = require('no-configuration-di');

process.env.NODE_ENV = 'test';

GLOBAL.setUpDi = function() {
    var di = require('../di')();

    var logger = di.get('logger');
    logger.info = sinon.spy();

    GLOBAL.di = di;
    return di;
}

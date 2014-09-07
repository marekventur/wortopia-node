var di = require('./di')();

di.runAll('start')
.done(function() {
    di.get('logger').info('Server has successfully started');
});
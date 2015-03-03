function initWortopia(start) {

    if (start) {
        var hashHandler = new HashHandler();
        hashHandler.handleHashs();
    }

    angular.module('wortopia', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({ prefix: 'languages/', suffix: '.json' });
        $translateProvider.preferredLanguage('de');
    })
    .value('hashHandler', hashHandler)
    .service('session', Session)
    .service('socket', Socket)
    .service('size', Size)
    .service('game', Game)
    .service('timer', Timer)
    .service('chat', Chat)
    .service('tracking', Tracking)
    .service('fieldFactory', FieldFactory)
    .service('recoverService', RecoverService)
    .service('userOptions', UserOptions)
    .run(function($templateCache) {
        if (templateCache) {
            templateCache($templateCache);
        }
    })
    .run(function(session, tracking, size) {
        if (start) {
            size.start();
            tracking.start();
            session.loginViaSessionToken();
        }
    });
}

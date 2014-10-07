function initWortopia() {

    var hashHandler = new HashHandler();
    hashHandler.handleHashs();

    angular.module('wortopia', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({ prefix: 'languages/', suffix: '.json' });
        $translateProvider.preferredLanguage('de');
    })
    .value('hashHandler', hashHandler)
    .service('session', Session)
    .service('socket', Socket)
    .service('socket', Socket)
    .service('size', Size)
    .service('game', Game)
    .service('timer', Timer)
    .service('chat', Chat)
    .service('tracking', Tracking)
    .service('fieldFactory', FieldFactory)
    .service('recoverService', RecoverService)
    .run(function($templateCache) {
        if (templateCache) {
            templateCache($templateCache);
        }
    });
}
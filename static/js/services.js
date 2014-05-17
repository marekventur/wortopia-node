function initWortopia() {
    angular.module('wortopia', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({ prefix: 'languages/', suffix: '.json' });
        $translateProvider.preferredLanguage('en');
    })
    .service('session', Session)
    .service('socket', Socket)
    .service('size', Size)
    .service('game', Game)
    .service('timer', Timer)
    .service('chat', Chat)
    .service('fieldFactory', FieldFactory)
    .run(function($templateCache) {
        if (templateCache) {
            templateCache($templateCache);
        }
    });
}
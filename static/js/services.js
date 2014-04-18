function initWortopia() {
    angular.module('wortopia', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({ prefix: 'languages/', suffix: '.json' });
        $translateProvider.preferredLanguage('en');
    })
    .service('session', Session)
    .value('SOCKJS_URL', '/sockjs')

    ;
}
function RulesController($scope, $element) {
    $element.on('hidden.bs.modal', function() {
        window.location.hash = '';
    });
}
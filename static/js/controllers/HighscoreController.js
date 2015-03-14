function HighscoreController($scope, $element, size, userOptions) {
    $element.on('shown.bs.modal', function() {
        $scope.interval = userOptions.options.highscoreInterval || 30;
        load();
    });

    $scope.$watch('interval', function(interval) {
        load();
        userOptions.options.highscoreInterval = interval;
        userOptions.persist();
    });

    function load() {
        $scope.highscores = null;
        $.get('/highscore', {size: size.size, interval: $scope.interval}, function(data) {
            $scope.highscores = data;
            $scope.$apply();
        });
    }

    $element.on('hidden.bs.modal', function() {
        window.location.hash = '';
    });

    $scope.asPercent = function(f) {
        return (f * 100).toFixed(1);
    }

    $scope.twoDecimals = function(f) {
        return f.toFixed(2);
    }
}
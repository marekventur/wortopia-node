function HighscoreController($scope, $element, size) {
    $scope.highscores = null;

    $element.on('shown.bs.modal', function() {
        $.get('/highscore', {size: size.size}, function(data) {
            $scope.highscores = data;
            $scope.$apply();
        });
    });

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
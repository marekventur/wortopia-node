function CurrentFieldController($scope, game, size, $element) {
    var $input = $element.find('#word-input');
    $scope.getCurrentField = function() {
        return game.getCurrentField();
    }

    $scope.getCell = function(x, y) {
        var field = game.getCurrentField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    $scope.getSize = function() {
        return size.size;
    }

    game.on('gameOngoing', function() {
        setTimeout(function() {
            $input.focus();
        }, 250);
    });
};
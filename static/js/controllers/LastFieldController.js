function LastFieldController($scope, game, size) {
    $scope.getLastField = function() {
        return game.getLastField();
    }

    $scope.getCell = function(x, y) {
        var field = game.getLastField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    $scope.getSize = function() {
        return size.size;
    }

    $scope.getStats = function() {
        return game.getLastStats();
    }

    $scope.getWords = function() {
        return game.getLastWords();
    }
};
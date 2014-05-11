function CurrentFieldController($scope, game, size) {
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
};
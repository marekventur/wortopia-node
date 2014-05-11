function MainController($scope, $element, session, size, game) {
    $scope.getUser = function() {
        return session.user;
    }

    $scope.getSize = function() {
        return size.size;
    }

    $scope.isGameOngoing = function() {
        return !!game.getCurrentField();
    }

    $scope.isGameReady = function() {
        return game.ready;
    }
};
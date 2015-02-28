function MainController($scope, $element, session, size, game, socket) {
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

    $scope.getCurrentField = function() {
        return game.getCurrentField();
    }

    $scope.getLastField = function() {
        return game.getLastField();
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

    $scope.isGuest = function() {
        return session.user && session.user.guest;
    }

    $scope.noWebsocketConnectionWarning = function() {
        return socket.noWebsocketConnectionWarning();
    }
};
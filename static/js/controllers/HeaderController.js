function HeaderController($scope, $element, session, size, playersPerField) {
    $scope.login = function() {
        return session.user;
    }

    $scope.isLoading = function() {
        return !session.user;
    }

    $scope.logout = function() {
        session.logout();
    }

    $scope.isActiveSize = function(sizeToTest) {
        return size.size === sizeToTest;
    }

    $scope.getPlayersPerField = function(size) {
        return playersPerField.playersPerField[size];
    }

    session.on('update', function() {
        $scope.$apply();
    });

    playersPerField.on('update', function() {
        $scope.$apply();
    });
}
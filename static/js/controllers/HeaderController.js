function HeaderController($scope, $element, session) {
    $scope.login = function() {
        return session.user;
    }

    $scope.isLoading = function() {
        return !session.user;
    }

    $scope.isGuest = function() {
        return session.user && session.user.guest;
    }

    $scope.logout = function() {
        session.logout();
    }

    session.on('update', function() {
        $scope.$apply();
    })

    session.loginViaSessionToken();
}
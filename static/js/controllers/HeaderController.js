function HeaderController($scope, $element, session) {
    $scope.login = function() {
        return session.user;
    }

    $scope.isLoading = function() {
        return !session.user;
    }

    $scope.logout = function() {
        session.logout();
    }

    session.on('update', function() {
        $scope.$apply();
    })

    session.loginViaSessionToken();
}
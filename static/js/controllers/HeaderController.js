function HeaderController($scope, $element, session) {

    $scope.getUser = function() {
        return session.user;
    }

    $scope.isLoading = function() {
        return !session.user;
    }

    session.on('update', function() {
        $scope.$apply();
    })

    session.loginViaSessionToken();
}
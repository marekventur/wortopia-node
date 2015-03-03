function HeaderController($scope, $element, session, size) {
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

    session.on('update', function() {
        $scope.$apply();
    })
}
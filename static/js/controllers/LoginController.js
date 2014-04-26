function LoginController($scope, session, $element) {

    $scope.input = {};
    $scope.error = null;
    $scope.loading = false;

    $scope.login = function() {
        $scope.loading = true;
        $scope.error = null;
        session.loginWithCredentials($scope.input.username, $scope.input.password)
        .then(function() {
            $element.modal('hide');
        })
        .fail(function(err) {
            $scope.error = err.reason;
            console.error('Error caught while trying to sign up:', err);
        })
        .then(function() {
            $scope.loading = false;
            $scope.$apply();
        })
    }
}
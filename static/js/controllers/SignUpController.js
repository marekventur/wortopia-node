function SignUpController($scope, $element, session) {

    $scope.input = {};
    $scope.errors = {};
    $scope.loading = false;

    $scope.signup = function() {
        $scope.loading = true;
        $scope.errors = {};
        Q($.post('/signup', $scope.input))
        .then(function(response) {
            if (response.errors) {
                $scope.errors = response.errors;
            } else {
                session.setUser(response.user);
                $element.modal('hide');
            }
        })
        .fail(function(err) {
            $scope.errors = { username: 'unknown' };
            console.error('Error caught while trying to sign up:', err);
        })
        .then(function() {
            $scope.loading = false;
            $scope.$apply();
        })
    }
}
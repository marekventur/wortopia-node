function AccountController($scope, session, $element) {
    $scope.input = {};
    $scope.errors = {};
    $scope.loading = false;

    session.on('update', function() {
        $scope.input = JSON.parse(JSON.stringify(session.user));
        $scope.errors = {};
        $scope.$apply();
    })

    $scope.save = function() {
        $scope.loading = true;
        $scope.errors = {};
        Q($.post('/account', $scope.input))
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
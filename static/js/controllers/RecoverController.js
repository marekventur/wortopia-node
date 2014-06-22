function RecoverController($scope, $element, recoverService) {
    $scope.input = {};
    $scope.error = null;
    $scope.loading = false;
    $scope.success = false;

    $scope.recover = function() {
        $scope.loading = true;
        $scope.error = null;
        recoverService.recover($scope.input.email)
        .then(function() {
            $scope.success = true;
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

    $scope.closeModal = function() {
        $element.modal('hide');
    }
}
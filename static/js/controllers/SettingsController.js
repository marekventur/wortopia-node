function SettingsController($scope, userOptions) {

    // Throttle to avoid update-flooding for text fields
    $scope.persistUserOptions = _.throttle(userOptions.persist, 1000);
};
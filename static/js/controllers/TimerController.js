function TimerController($scope, game, timer) {
    timer.on('tick', function(remainingTime) {
        $scope.remainingTime = remainingTime;
        $scope.$apply();
    });
}
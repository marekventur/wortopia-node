function ResultController($scope, game) {
    $scope.getPlayerCountTranslationInformation = function() {
        return {count: game.getLastPlayers().length};
    }

    $scope.getPlayerCountTranslationKey = function() {
        // This will only work for languages like English and German where "1" is the only edge case.
        return game.getLastPlayers().length === 1 ? "results.count.one" : "results.count.other";
    }

    $scope.getResults = function() {
        return game.getLastResults();
    }

    $scope.mouseOver = function(player) {
        _.each(player.words, function(word) {
            $('.word--word-' + word.word).addClass('word--highlight');
        });
    }

    $scope.mouseLeave = function() {
        $('.word').removeClass('word--highlight');
    }

    $scope.playerClasses = function(player) {
        if (!player || player.team) {
            return [];
        }

        var classes = _.map(player.words, function(word) {
            return 'player--word-' + word.word;
        });
        return classes;
    }
}   
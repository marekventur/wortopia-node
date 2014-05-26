function CurrentFieldController($scope, game, size, $element, socket) {
    var $input = $element.find('#word-input');

    $scope.getCell = function(x, y) {
        var field = game.getCurrentField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    $scope.getSize = function() {
        return size.size;
    }

    game.on('gameOngoing', function() {
        setTimeout(function() {
            $input.focus();
        }, 250);
    });

    $scope.submitWord = function(word) {
        game.guess(word);
        $scope.wordEntered = "";
        $scope.dehighlightWord();
    }

    // Hightlighting
    $scope.wordEnteredClass = [];
    var cells = [];
    $scope.$watch('getCurrentField()', function(field) {
        _.defer(function() {
            cells = _.map(field, function(row, y) {
                return _.map(row, function(cell, x) {
                    return $element.find('.field .cell--' + x + '-' + y);
                });
            });
        });
    })

    $scope.highlightWord = function(word) {
        $scope.dehighlightWord();
        var chain = $scope.getCurrentField().contains(word);
        if (chain) {
            _.each(chain, function(element, index) {
                var $cell = cells[element.y][element.x];
                $cell.css('background', 'rgba(0, 0, 0, ' + (0.5 - 0.4 / chain.length * index) + ')');
            });
        } else if (word.length > 0) {
            $scope.wordEnteredClass = ['has-error'];
        }
    }

    $scope.dehighlightWord = function() {
        $scope.wordEnteredClass = [];
        _.each(cells, function(row) {
            _.each(row, function(cell) {
                cell.css('background', 'white');
            });
        });
    }
};
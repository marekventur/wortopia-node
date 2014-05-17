function LastFieldController($scope, size, $element) {
    $scope.getCell = function(x, y) {
        var field = $scope.getLastField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    // Hightlighting
    var cells = [];
    $scope.$watch('getLastField()', function(field) {
        _.defer(function() {
            cells = _.map(field, function(row, y) {
                return _.map(row, function(cell, x) {
                    return $element.find('.field .cell--' + x + '-' + y);
                });
            });
            console.log(cells);
        });
    })

    $scope.highlightWord = function(word) {
        $scope.dehighlightWord();
        var chain = $scope.getLastField().contains(word.word)
        _.each(chain, function(element, index) {
            var $cell = cells[element.y][element.x];
            console.log($cell);
            $cell.css('background', 'rgba(0, 0, 0, ' + (0.5 - 0.4 / chain.length * index) + ')');
        });
    }

    $scope.dehighlightWord = function() {
        _.each(cells, function(row) {
            _.each(row, function(cell) {
                cell.css('background', 'white');
            });
        });
    }

};
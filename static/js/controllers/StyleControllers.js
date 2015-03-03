function FieldStyleController4($scope) {
    $scope.field = fieldContainsFactoryMethod([
        ['a', 'b', 'c', 'd'],
        ['e', 'f', 'g', 'h'],
        ['i', 'j', 'k', 'l'],
        ['m', 'n', 'o', 'p']
    ]);
    $scope.getSize = function() {   
        return $scope.field.length;
    }

    $scope.getCurrentField = function() {
        return $scope.field;
    }
};

function FieldStyleController5($scope) {
    $scope.field = fieldContainsFactoryMethod([
        ['a', 'b', 'c', 'd', 'e'],
        ['f', 'g', 'h', 'i', 'j'],
        ['k', 'l', 'm', 'n', 'o'],
        ['p', 'q', 'r', 's', 't'],
        ['u', 'v', 'w', 'x', 'y']
    ]);
    $scope.getSize = function() {   
        return $scope.field.length;
    }

    $scope.getCurrentField = function() {
        return $scope.field;
    }
};
function GuessesController($scope, game) {
    $scope.getGuesses = function() {
        return game.getGuesses();
    }

    $scope.isVisible = function() {
        return !!game.getGuesses();
    }

    $scope.getClassFor = function(guess) {
        var result = ['guess'];
        if (guess.status === 'waiting') {
            result.push('guess--waiting');
        } else if (guess.status === 'dublicated') {
            result.push('guess--dublicated');
            result.push('warning');
        } else if (guess.status === 'correct') {
            result.push('guess--correct');
            result.push('success');
        } else if (guess.status === 'notOnField') {
            result.push('guess--not-on-field');
            result.push('danger');
        } else if (guess.status === 'notInDictionary') {
            result.push('guess--not-in-dictionary');
            result.push('danger');
        } else if (guess.status === 'tooLate') {
            result.push('guess--too-late');
            result.push('warning');
        }
        return result;
    }

    $scope.getTextClassFor = function(guess) {
        if (guess.status === 'dublicated') {
            return 'text-warning';
        } else if (guess.status === 'correct') {
            return 'text-success';
        } else if (guess.status === 'notOnField') {
            return 'text-danger';
        } else if (guess.status === 'notInDictionary') {
            return 'text-danger';
        } else if (guess.status === 'tooLate') {
            return 'text-warning';
        }
        return '';
    }

    $scope.getCurrentPoints = function(){
        return {
            points: 14
        };
    }

}
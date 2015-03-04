function CurrentFieldController($scope, game, size, $element, socket) {
    var $input = $element.find('#word-input');

    $scope.getCell = function(x, y) {
        var field = game.getCurrentField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    // Marks
    var $correctSymbol = $element.find('.giant-tick');
    var $incorrectSymbol = $element.find('.giant-cross');

    game.on('guessCorrect', function() {
        $correctSymbol.addClass('highlight');
        setTimeout(function() {
            $correctSymbol.removeClass('highlight');
        }, 600);
    })

    game.on('guessIncorrect', function() {
        $incorrectSymbol.addClass('highlight');
        setTimeout(function() {
            $incorrectSymbol.removeClass('highlight');
        }, 600);
    })

    // Clicking/Swiping
    var $canvas = $element.find('canvas');
    var dimension = $scope.getSize() === 4 ? 280 : 280;
    var cellDimension = dimension / $scope.getSize();
    var chain = [];
    $canvas.click(function(e) {
        var offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
        var offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
        var x = Math.floor(offX / cellDimension);
        var y = Math.floor(offY / cellDimension);
        
        if (chain.length > 0) {
            var last = chain[chain.length - 1];

            if (Math.abs(last.x - x) > 1 || Math.abs(last.y - y) > 1) {
                $scope.clearChain();
                return;
            }
        }

        if (!_.findWhere(chain, {x: x, y: y})) {
            chain.push({x: x, y: y});
            drawChain(chain);
        } else {
            submitChain();
        }

        $scope.$apply();
    });

    function submitChain() {
        var word = '';
        _.each(chain, function(element) {
            word += $scope.getCell(element.x, element.y);
        });
        if (word.length > 2) {
            $scope.submitWord(word);
        } else {
            $scope.clearChain();
        }
    }

    $canvas.dblclick(submitChain);

    $canvas.mousedown(function(){ return false; })

    // Submit
    $scope.submitWord = function(word) {
        game.guess(word);
        $scope.wordEntered = "";
        $scope.wordEnteredClass = [];
        chain = [];
        drawChain(chain);
    }

    $scope.clearChain = function() {
        $scope.wordEntered = "";
        $scope.wordEnteredClass = [];
        chain = [];
        drawChain(chain);
    }

    // Hightlighting
    $scope.typeWord = function(word) {
        if (word === '') {
            var newChain = [];
        } else {
            var newChain = $scope.getCurrentField().contains(word);
        }

         if (newChain) {
            chain = newChain;
            $scope.wordEnteredClass = [];
        } else if (word.length > 0) {
            $scope.wordEnteredClass = ['has-error'];
            chain = [];
        }
        drawChain(chain);
    }

    $scope.isPartOfChain = function(x, y) {
        return !!_.find(chain, function(element) {
            return element.x === x && element.y === y;
        });
    }

    $canvas.attr('width', dimension + 'px').attr('height', dimension + 'px');
    var context = $canvas[0].getContext('2d');

    function drawChain(chain) {
        context.clearRect(0 , 0 , dimension , dimension);

        context.beginPath();
        context.strokeStyle = '#888';
        context.lineWidth = 2;

        var first = true;
        var radius = cellDimension * 0.40;
        _.each(chain, function(element) {
            var x = Math.round((element.x + 0.5) * cellDimension);
            var y = Math.round((element.y + 0.5) * cellDimension);
            if (first) {
                context.moveTo(x, y);
                first = false;
            } else {
                context.lineTo(x, y);
            }

        });
        context.stroke();

        _.each(chain, function(element) {
            var x = Math.round((element.x + 0.5) * cellDimension);
            var y = Math.round((element.y + 0.5) * cellDimension);

            // We could save this by doing some maths further up.
            // Can't be bothered right now.
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();

            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.stroke();
        });
    }

    /*
     Arrow's
     function drawChain(chain) {
        context.clearRect(0 , 0 , dimension , dimension);

        //context.beginPath();
        context.strokeStyle = '#888';
        context.lineWidth = 4;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        var first = true;
        var lastX, lastY;
        var radius = cellDimension * 0.3;
        _.each(chain, function(element) {
            var x = Math.round((element.x + 0.5) * cellDimension);
            var y = Math.round((element.y + 0.5) * cellDimension);
            if (lastX) {
                drawArrow(lastX, lastY, x, y, radius)
            }
            lastX = x;
            lastY = y;
        });


        _.each(chain, function(element) {
            var x = Math.round((element.x + 0.5) * cellDimension);
            var y = Math.round((element.y + 0.5) * cellDimension);
        });
    }

    function drawArrow(fromX, fromY, toX, toY, distance){
        var headLen = 15;   // length of head in pixels
        var angle = Math.atan2(toY-fromY,toX-fromX);
        var endX = toX-distance*Math.cos(angle);
        var endY = toY-distance*Math.sin(angle);
        context.beginPath();
        context.moveTo(fromX+distance*Math.cos(angle),fromY+distance*Math.sin(angle));
        context.lineTo(endX, endY);
        context.lineTo(endX-headLen*Math.cos(angle-Math.PI/6),endY-headLen*Math.sin(angle-Math.PI/6));
        context.moveTo(endX, endY);
        context.lineTo(endX-headLen*Math.cos(angle+Math.PI/6),endY-headLen*Math.sin(angle+Math.PI/6));
        context.stroke();
    }
    */


    /*$scope.wordEnteredClass = [];
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
    }*/
};
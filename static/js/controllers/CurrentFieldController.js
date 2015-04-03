function CurrentFieldController($scope, game, size, $element, socket, userOptions) {
    var $input = $element.find('#word-input');

    $scope.getCell = function(x, y) {
        var field = game.getCurrentField();
        if (!field || !field[y]) {
            return null;
        }
        return field[y][x];
    }

    $scope.getContainerStyle = function() {
        if (userOptions.options.boardScale === 100) {
            return {};
        }
        var scale = userOptions.options.boardScale / 100;

        // never allow the field to be bigger than the screen width
        var usableWidth = $(window).width() - 10;
        if (281 * scale > usableWidth) {
            scale = usableWidth / 281;
        }

        var style = {
            "transform": "scale(" + scale + ")",
            "height": (scale * 281) + "px"
        };
        style['-webkit-transform'] = style.transform;
        style['-ms-transform'] = style.transform;
        return style;
    }

    // Keyboard
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

    game.on('gamePaused', function() {
        // only re-focus to the input field when the game was paused that way
        if ($input.is(":focus")) {
            game.once('gameOngoing', function() {
                _.defer(function() {
                    $input.focus();
                });
            });
        }

        // clear input field anyway
        $input.val('');
        chain = [];
        drawChain(chain);
    });

    /* All clicking and swiping */
    var $canvas = $element.find('canvas');
    var dimension = $scope.getSize() === 4 ? 280 : 280;
    var cellDimension = dimension / $scope.getSize();
    var chain = [];
    var startSwipingField = null;

    function swipeStart(posX, posY) {
        var x = Math.floor(posX / cellDimension);
        var y = Math.floor(posY / cellDimension);

        var result = addCellToFrame(x, y);
        if (result === 'a') {
            startSwipingField = {x:x, y:y};
            drawChain(chain);
        } else if (result === 'd') {
            submitChain();
        }

    }

    function swipeMove(posX, posY, tolerance) {
        tolerance = tolerance || 0.4;

        var x = Math.floor(posX / cellDimension);
        var y = Math.floor(posY / cellDimension);

        if (startSwipingField && (x !== startSwipingField.x || y !== startSwipingField.y)) { // outside of original cell
            var centerPosX = (x + 0.5) * cellDimension;
            var centerPosY = (y + 0.5) * cellDimension;
            var distToCenterX = posX - centerPosX;
            var distToCenterY = posY - centerPosY;
            var distance = Math.sqrt(distToCenterX * distToCenterX + distToCenterY * distToCenterY);

            if (distance < tolerance * cellDimension) {
                var result = addCellToFrame(x, y);
                if (result === 'a') {
                    //added
                    drawChain(chain);
                    $scope.$apply();
                    return;
                }
            }

            drawChain(chain, {x: posX, y: posY});
        }
    }

    function swipeEnd(posX, posY) {
        var x = Math.floor(posX / cellDimension);
        var y = Math.floor(posY / cellDimension);

        if(startSwipingField && (x !== startSwipingField.x || y !== startSwipingField.y)) { // only end when the mouse has been moved
            submitChain();
        }

        startSwipingField = null;
    }

    /* Mobile phones */
    var canvasOffset = $canvas.offset();
    $canvas
    .on('touchstart', function(e) {
        var touch = e.originalEvent.touches[0];
        var x = touch.pageX - canvasOffset.left;
        var y = touch.pageY - canvasOffset.top;
        swipeStart(x, y);
        e.stopPropagation();
        e.preventDefault();
    })
    .on('touchmove', function(e) {
        console.log('touchmove');
        var touch = e.originalEvent.touches[0];
        var x = touch.pageX - canvasOffset.left;
        var y = touch.pageY - canvasOffset.top;
        swipeMove(x, y);
        e.stopPropagation();
        e.preventDefault();
    })
    .on('touchend', function(e) {
        var touch = e.originalEvent.changedTouches[e.originalEvent.changedTouches.length-1];
        var x = touch.pageX - canvasOffset.left;
        var y = touch.pageY - canvasOffset.top;
        swipeEnd(x, y);
        e.stopPropagation();
        e.preventDefault();
    });

    /* Screen swipe */
    var leftButtonDown = false;
    $canvas
    .on('mousedown', function(e) {
        if(e.which === 1) {
            leftButtonDown = true;
            var x  = (e.offsetX || e.clientX - $(e.target).offset().left);
            var y  = (e.offsetY || e.clientY - $(e.target).offset().top);
            swipeStart(x, y);
            e.stopPropagation();
            e.preventDefault();
        }
    })
    .on('mousemove', function(e) {
        if (leftButtonDown) {
            var x  = (e.offsetX || e.clientX - $(e.target).offset().left);
            var y  = (e.offsetY || e.clientY - $(e.target).offset().top);
            swipeMove(x, y);
            e.stopPropagation();
            e.preventDefault();
        }
    })
    .on('mouseup', function(e) {
        if(e.which === 1) {
            leftButtonDown = false;
            var x  = (e.offsetX || e.clientX - $(e.target).offset().left);
            var y  = (e.offsetY || e.clientY - $(e.target).offset().top);
            swipeEnd(x, y);
            e.stopPropagation();
            e.preventDefault();
        }
    });
    /*.dblclick(function() {
        submitChain()
    });*/

    // Chains, submits and clear
    function addCellToFrame(x, y) {
        if (chain.length > 0) {
            var last = chain[chain.length - 1];

            if (Math.abs(last.x - x) > 1 || Math.abs(last.y - y) > 1) {
                $scope.clearChain();
                return 'i'; // invalid
            }
        }

        if (!_.findWhere(chain, {x: x, y: y})) {
            chain.push({x: x, y: y});
            return 'a'; // added
        } else {
            return 'd'; // duplicated
        }
    }

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

    $scope.isPartOfChain = function(x, y) {
        return !!_.find(chain, function(element) {
            return element.x === x && element.y === y;
        });
    }

    // Canvas logic - Draw the chain

    $canvas.attr('width', dimension + 'px').attr('height', dimension + 'px');
    var context = $canvas[0].getContext('2d');

    function drawChain(chain, drawToPoint) {
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

        // For swiping
        if (drawToPoint) {
            context.lineTo(drawToPoint.x, drawToPoint.y);
        }

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


    // Marks - giant tick or cross to indicate failure or success
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
    });

};
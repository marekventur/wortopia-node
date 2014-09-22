require('./setup');

describe('Field', function() {
    var field;
    context('(functional)', function() {
        beforeEach(function() {
            setUpDi();

            field = [
                ['a', 'a', 'l', 'e'],
                ['e', 't', 'e' ,'m'],
                ['a', 's', 'e', 'n'],
                ['m', 'r', 't', 'n']
            ];
            di.get('fieldDecorator').decorate(field);
        });

        it('return size', function() {
            assert.equal(field.getSize(), 4);
        });

        it('calculates all starting positions', function() {
            assert.deepEqual(field.getAllStartingCombinations(), ["aa","at","ae","al","la","lt","le","lm","el","ee","em","et","ea","es","te","ta","tl","ts","en","me","ml","mn","as","ar","am","sa","se","sm","st","sr","er","ne","nt","nm","nn","mr","ms","ma","rm","ra","rt","re","rs","tr","tn"]);
        });

        it('fetches all words', function(done) {
            field.getWords()
            .done(function(words) {
                assert.deepEqual(_.pluck(words, 'word'), ["aal", "aale", "aalen"]);
                done();
            });
        });

        it('#contains finds words', function() {
            assert.deepEqual(field.contains('AA'), [ { x: 0, y: 0 }, { x: 1, y: 0 } ]);
            assert.deepEqual(field.contains('Al'), [ { x: 1, y: 0 }, { x: 2, y: 0 } ]);
            assert.deepEqual(field.contains('alen'), [ { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 } ]);
            assert.equal(field.contains('nrudt'), null);
            assert.equal(field.contains('nenees'), null);
            assert.equal(field.contains('ss'), null);
        });
    });

});

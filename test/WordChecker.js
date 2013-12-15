var assert = require('chai').assert;
var WordChecker = require('../lib/WordChecker');

describe('WordChecker', function() {

    var field = [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
    ];

    var wordChecker = new WordChecker();

    it('first letter can not be found', function() {
        assert.notOk(wordChecker.check(field, 'XEN'));
    });

    it('it is only one  letter that can be found', function() {
        assert.ok(wordChecker.check(field, 'F'));
    });
});

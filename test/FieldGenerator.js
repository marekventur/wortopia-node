var assert = require('chai').assert;
var FieldGenerator = require('../src/game/FieldGenerator');

describe('FieldGenerator', function() {

    var mockLogger = require('./helpers/mockLogger');
    var testDb = require('./helpers/testDb');
    var config = require('../config.json');
    var fieldGenerator = new FieldGenerator(config, testDb, mockLogger);

    it('creates 4 letter field', function() {
        var field = fieldGenerator.createField(4);
        assert.equal(field.length, 4);
        assert.equal(field[0].length, 4);
    });

    it('creates from string', function() {
        var field = fieldGenerator.createFieldFromString('abcdefghijklmnop');
        assert.equal(field.length, 4);
        assert.equal(field[0].length, 4);
        assert.equal(field[0][0], 'a');
        assert.equal(field[0][1], 'b');
        assert.equal(field[1][0], 'e');
        assert.equal(field[3][3], 'p');
    });
});

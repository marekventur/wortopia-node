require('./setup')

describe('FieldGenerator', function() {
    var fieldGenerator;

    beforeEach(function() {
        setUpDi();
        fieldGenerator = di.get('fieldGenerator');
    });

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

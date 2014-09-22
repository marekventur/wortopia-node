require('./setup');

describe('MessageAuthenticationCodeManager', function() {
    var messageAuthenticationCodeManager;

    beforeEach(function() {
        setUpDi();
        di.get('config').tokenSalt = 'abc';
        messageAuthenticationCodeManager = di.get('messageAuthenticationCodeManager');
    });

    it('works with string' , function() {
        var value = 'asdf';
        var token = messageAuthenticationCodeManager.create(value);
        var result = messageAuthenticationCodeManager.verify(token);
        assert.strictEqual(result, value);
    });

    it('works with integer as input', function() {
        var value = 134213;
        var token = messageAuthenticationCodeManager.create(value);
        var result = messageAuthenticationCodeManager.verify(token);
        assert.strictEqual(result, value);
    });

    it('works with boolean as input', function() {
        var value = false;
        var token = messageAuthenticationCodeManager.create(value);
        var result = messageAuthenticationCodeManager.verify(token);
        assert.strictEqual(result, value);
    });

    it('works with object as input', function() {
        var value = {foo: 'bar'};
        var token = messageAuthenticationCodeManager.create(value);
        var result = messageAuthenticationCodeManager.verify(token);
        assert.deepEqual(result, value);
    });

    it('fails with broken hash', function() {
        var value = 'asdf';
        var token = messageAuthenticationCodeManager.create(value);
        var tokenChanged = token.substr(0, 20) + 'Y' + token.substr(21);
        try {
            messageAuthenticationCodeManager.verify(tokenChanged)
            assert.fail('Error expected');
        } catch(e) {
            assert.match(e.message, /Could not verify/);
        }
    });

    it('fails if salt changes', function() {
        var value = 'asdf';
        var token = messageAuthenticationCodeManager.create(value);
        di.get('config').tokenSalt = 'abcd';
        try {
            messageAuthenticationCodeManager.verify(token)
            assert.fail('Error expected');
        } catch(e) {
            assert.match(e.message, /Could not verify/);
        }
    });


});

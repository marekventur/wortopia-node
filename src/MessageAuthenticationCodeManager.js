var crypto = require("crypto");

// This class creates and validates tokens for arbitrary "values" that can
// be safely passed to the user. Any tinkering can be detected during
// verify.
module.exports = function(config) {
    var that = this;

    this.create = function(value) {
        var valueBuffer = new Buffer(JSON.stringify(value), 'utf8');
        var valueBase64 = valueBuffer.toString('base64');
        var hmac = crypto.createHmac('sha256', config.tokenSalt);
        hmac.update(valueBuffer);
        return valueBase64 + '.' + hmac.digest('base64');
    }

    this.verify = function(token, additionalSalt) {
        var tokenBits = token.split('.');
        var valueBase64 = tokenBits[0];
        var givenHash = tokenBits[1];
        var valueBuffer = new Buffer(valueBase64, 'base64');
        var value = valueBuffer.toString('utf8');
        var hmac = crypto.createHmac('sha256', config.tokenSalt);
        hmac.update(valueBuffer);
        var expectedHash = hmac.digest('base64');
        if (expectedHash !== givenHash) {
            throw new Error('Could not verify message');
        }
        return JSON.parse(value);
    }
}
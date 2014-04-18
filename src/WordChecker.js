var _ = require('underscore');
module.exports = function(config, redis, redisKeyGenerator, logger) {
    var that = this;

    that.check = function(field, word) {

    };

    function checkRestWord(field, word) {
        if (word == '') {
            return true;
        }

        var nextChar = word.charAt(0);    
        var nextWord = word.substring(1);

    }

    function cloneField(field) {
        var result = [];
        _.each(field, function(row) {
            result.push(row.slice(0));
        });
        return result;
    }
}
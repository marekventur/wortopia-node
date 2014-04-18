module.exports = function() {
    var that = this;

    that.getWordsKey = function(language) {
        return 'language.' + language + '.words';
    }
}
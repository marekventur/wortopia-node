import _ from "underscore";

export default function(field) {
    field.guessWord = async function(user, word) {
        const words = await field.getWords();
        const foundWord = _.findWhere(words, {word: word});
        if (foundWord) {
            if (field.scoreForPlayer(user, foundWord)) {
                return foundWord;
            } else {
                throw newErrorWithCode('dublicated');
            }
        } 
        if (field.isFinished()) {
            throw newErrorWithCode('tooLate');
        } else if (!field.allowed(word)) {
            throw newErrorWithCode('tooShort');
        } else if (!field.contains(word)) {
            throw newErrorWithCode('notOnField');
        } else {
            throw newErrorWithCode('notInDictionary');
        }
    }

    function newErrorWithCode (code) {
        var error = new Error('Word is not accepted: ' + code);
        error.code = code;
        return error;
    }
}

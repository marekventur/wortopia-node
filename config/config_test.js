module.exports = {
	"dbConnectionString": 'postgres://wortopia:wortopia@localhost/wortopia_test',
	"port": 36001,
	"gameTime": 180000,
    "pauseTime": 30000,
    "chatRetentionTime": 3600000,
    "language": {
        "quReplacement": true,
        "longestWord": 16,
        "distribution": {
            "A": 7 * 3,
            "B": 2 * 3,
            "C": 4 * 3,
            "D": 6 * 3,
            "E": 16 * 3,
            "F": 2 * 3,
            "G": 3 * 3,
            "H": 5 * 3,
            "I": 9 * 3,
            "J": 1 * 3,
            "K": 2 * 3,
            "L": 4 * 3,
            "M": 4 * 3,
            "N": 10 * 3,
            "O": 5 * 3,
            "P": 1 * 3,
            "R": 7 * 3,
            "S": 8 * 3,
            "T": 5 * 3,
            "U": 7 * 3,
            "V": 2,
            "W": 2,
            "X": 2,
            "Y": 1,
            "Q": 0,
            "Z": 2
        },
        "scores": {
            "3": 1,
            "4": 1,
            "5": 2,
            "6": 3,
            "7": 5,
            "8": 11,
            "9": 17,
            "10": 25,
            "11": 35,
            "12": 45,
            "13": 55,
            "14": 65,
            "15": 75,
            "16": 85
        },
        "minimumWordLengthPerFieldSize": {
            "4": 3,
            "5": 4
        }
    },
    "chatMessages": {
        "started": "Der Server wurde neu gestartet. Wir entschuldigen uns für die Unterbrechung.", // Server has been (re-)started. Sorry for any inconvenience caused.
    },
    "chatPostHook": "http://xyz.com/internal-http-post-endpoint",
    "simplerSes": {
        "authToken": 'abc',
        "from": "mail@wortopia.de",
        "templatePrefix":"wortopia_en_"
    },
    "tokenSalt": "cde",
    "rootUrl": "http://wortopia.de"
};
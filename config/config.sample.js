module.exports = {
	"dbConnectionString": 'postgres://wortopia:wortopia@localhost/wortopia_dev',
	"port": 36001,
	"gameTime": 180000,
    "pauseTime": 30000,
    "chatRetentionTime": 3600000,
    "language": {
        "quReplacement": true,
        "longestWord": 16,
        "distribution": {
            "A": 5,
            "B": 2,
            "C": 2,
            "D": 4,
            "E": 15,
            "F": 2,
            "G": 3,
            "H": 4,
            "I": 6,
            "J": 1,
            "K": 2,
            "L": 3,
            "M": 4,
            "N": 9,
            "O": 3,
            "P": 1,
            "Q": 1,
            "R": 6,
            "S": 7,
            "T": 6,
            "U": 6,
            "V": 1,
            "W": 1,
            "X": 1,
            "Y": 1,
            "Z": 1
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
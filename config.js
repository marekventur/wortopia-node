if (process.env.NODE_ENV === 'test') {
    process.env.SIMPLER_SES_AUTH_TOKEN = 'abc';
    process.env.TOKEN_SALT = 'abc';
}

if (!process.env.SIMPLER_SES_AUTH_TOKEN) {
    console.error("Error: Please define SIMPLER_SES_AUTH_TOKEN");
    process.exit(1);
}

if (!process.env.TOKEN_SALT) {
    console.error("Error: Please define TOKEN_SALT");
    process.exit(1);
}

module.exports = {
    "port": process.env.PORT || 3000,
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
        "alphaWarning": "Dies ist eine Alpha Version - Nicht alle Funktionen sind implementiert und es sind noch einige Fehler zu finden. Bitte schick uns euere Meinung/Fehlermeldungen an mail@wortopia.de. Danke!" // This is alpha software. Please report all errors to mail@wortopia.de
    },
    "chatPostHook": process.env.CHAT_POST_HOOK || null,
    "simplerSes": {
        "authToken": process.env.SIMPLER_SES_AUTH_TOKEN,
        "from": process.env.FROM_EMAIL_ADDRESS || "mail@wortopia.de",
        "templatePrefix": process.env.SIMPLER_SES_TEMPLATE_PREFIX || "wortopia_en_"
    },
    "tokenSalt": process.env.TOKEN_SALT,
    "rootUrl": process.env.ROOT_URL || "http://wortopia.de"
};
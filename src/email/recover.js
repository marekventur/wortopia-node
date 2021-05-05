export default function (c) {
    var text = "Hallo " + c.username + ", \n\n" +
        "es sieht so aus als hättest du dich aus Wortopia.de ausgesperrt. Kein Problem, dieser Link erlaubt dir dich wieder als \"" + c.username + "\" einzuloggen sodass du deinen Benutzernamen oder Passwort ändern kannst: " + c.resetLink + "\n" +
        "\n" +
        "Falls du diese Email nicht angefordert hast kannst du sie einfach ignorieren. Deinem Account wird nichts passieren!\n" +
        "\n" +
        "Dein Wortopia.de Team\n";
    return {
        subject: "Wortopia Passwort zurücksetzen",
        text: text,
        html: text.replace("\n", "<br>")
    };
}

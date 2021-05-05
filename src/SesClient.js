import ses from "node-ses";

export default function(config, logger) {
    var that = this;

    this.send = async function(template, user, fields) {
        fields.username = user.name;
        await user.loadEmail();
        var client = ses.createClient(config.email);

        var content = template(fields);
        const body = await new Promise((resolve, reject) => 
            client.sendEmail({
                to: user.email
                , from: config.email.from
                , subject: content.subject
                , message: content.html
                , altText: content.text
            }, (error, data, res) => {
                if (error) {
                    logger.error("caught ses error: %j %j %j", error, data, res)
                    return reject(new Error(error));
                }
                if (!data) {
                    logger.error("caught ses error: %j %j %j", error, data, res)
                    return reject(new Error("no response"));
                }
                resolve(res)
            }
        ));
        const { statusCode } = body;
        if (statusCode !== 200 || (body && body.errors)) {
            var message = 'Unexpected response:' + JSON.stringify(body);
            if (body && body.errors) {
                message = body.errors.join(', ');
            }
            throw new Error(message);
        }
    }
}

var _ = require('underscore');
var util = require('util');
var request = require('request');
module.exports = function(socket, logger, config, clock) {
    var that = this;

    var messages = {4: [], 5: []};

    that.start = function(chat) {
        setInterval(that.cleanUp, 60 * 1000);
        that.addGlobalSystemMessage('started');

        socket.on('connected', function(user, size, send) {
            send('chatBacklog', that.getMessages(size));
        });

        socket.on('extern_chat', function(text, user, size) {
            that.addMessage(user, size, text);
        });

        setInterval(function() {
            that.addGlobalSystemMessage('alphaWarning');
        }, 30 * 60 * 1000);
        that.addGlobalSystemMessage('alphaWarning');
    }

    that.addMessage = function(user, size, text) {
        addMessage({
            text: text,
            user: user.getExternalPublicRepresentation(),
            time: clock.now()
        }, size);

        if (config.chatPostHook) {
            request({
                uri: config.chatPostHook,
                method: 'POST',
                body: "<" + user.getExternalPublicRepresentation().name + "> " + text
            }, function (error, response, body) {
                // Silent
            });
        }
    }

    that.addSystemMessage = function(size, key, args) {
        args = args || [];
        addMessage({
            text: format(config.chatMessages[key], args),
            system: true,
            time: clock.now()
        }, size);
    }

    that.addGlobalSystemMessage = function(key, args) {
        _.each(_.keys(messages), function(size) {
            that.addSystemMessage(size, key, args);
        });
    }

    that.getMessages = function(size) {
        return messages[size];
    }

    that.cleanUp = function() {
        var cutOffTime = clock.now() - config.chatRetentionTime;
        _.each(messages, function(messageSize, size) {
            messages[size] = _.filter(messageSize, function(message) {
                return message.time > cutOffTime;
            });
        });
    }

    function addMessage(message, size) {
        messages[size].push(message);
        socket.broadcast('chat', size, message);
    }

    function format(format, args) {
        return util.format.apply(this, _.union([format], args));
    }
}
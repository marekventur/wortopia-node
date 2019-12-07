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
            send('chatBacklog', that.getMessages(size, user));
        });

        socket.on('extern_chat', function(text, user, size) {
            that.addMessage(user, size, text);
        });
    }

    that.addMessage = function(user, size, text) {
        return user.isMuted().then(function(isMuted) {
            addMessage({
                text: text,
                user: user.getExternalPublicRepresentation(),
                time: clock.now(),
                isMuted: isMuted
            }, size, user, isMuted);

        if (config.chatPostHook) {
            var name = user.getExternalPublicRepresentation().guest ? "Guest " + user.getExternalPublicRepresentation().guestId : user.getExternalPublicRepresentation().name
            request({
                uri: config.chatPostHook,
                method: 'POST',
                body: "<" + name + "> " + (isMuted ? "[MUTED] " : "") + text
            }, function (error, response, body) {
                // Silent
            });
        }
        }, console.log);

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

    that.getMessages = function(size, user) {
        return messages[size].filter(function(message) {
            return (!message.isMuted) || (user.id === message.user.id);
        });
    }

    that.cleanUp = function() {
        var cutOffTime = clock.now() - config.chatRetentionTime;
        _.each(messages, function(messageSize, size) {
            messages[size] = _.filter(messageSize, function(message) {
                return message.time > cutOffTime;
            });
        });
    }

    function addMessage(message, size, user, isMuted) {
        messages[size].push(message);
        if (isMuted) {
            socket.sendToUser('chat', user, message);
        } else {
            socket.broadcast('chat', size, message);
        }
    }

    function format(format, args) {
        return util.format.apply(this, _.union([format], args));
    }
}

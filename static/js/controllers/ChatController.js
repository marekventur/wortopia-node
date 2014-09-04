/**
 * This class is doing stuff the un-angular way. I'm just not trusting angular performance
 * enough and there's no need to re-check lines every time -- they simply never change.
 */
function ChatController($scope, $element, chat, game) {
    var $input = $element.find('.chat-input');
    var $chatContent = $element.find('.chat-content');

    var $userMessageTemplate = $('<div class="chat-line"><div class="chat-time"></div><div class="chat-text"><span class="chat-name"></span> <span class="chat-inner-text"></span></div></div>');
    var $systemMessageTemplate = $('<div class="chat-line chat-line--sys"><div class="chat-time"></div><div class="chat-text"><span class="chat-inner-text"></span></div></div>');


    $input.keypress(function(e) {
        if(e.which === 13) {
            chat.sendMessage($input.val());
            $input.val('');
        }
    });

    chat.on('message', function(message) {
        var isScrolledDown = ($chatContent.scrollTop() + $chatContent.innerHeight() == $chatContent[0].scrollHeight);

        var $el;
        if (message.system) {
            $el = $systemMessageTemplate.clone();
        } else {
            $el = $userMessageTemplate.clone();
            if (message.user.guest) {
                $el.find('.chat-name').text($('#translation-guest-prefix').text() + message.user.guestId);
            } else {
                $el.find('.chat-name').text(message.user.name);
            }
        }

        $el.find('.chat-inner-text').html(linkify(message.text));
        $('.chat-time', $el).text(getTimeString(message.time));

        $chatContent.append($el);

        if (isScrolledDown) {
            scrollDown();
        }
    });

    chat.on('scrollDown', function() {
        setTimeout(function() {
            scrollDown();
        }, 1000);
    });

    game.on('switchBetweenPauseAndGame', function() {
        setTimeout(function() {
            scrollDown();
        }, 1000);
    })

    function getTimeString(timestamp) {

        var currentTime = new Date(timestamp)
        var hours = currentTime.getHours()
        var minutes = currentTime.getMinutes()

        if (minutes < 10) {
            minutes = "0" + minutes
        }
        return hours + ":" + minutes;
    }

    function scrollDown() {
        $chatContent.scrollTop($chatContent[0].scrollHeight);
    }


    /**
     * Taken from http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
     */
    function linkify(inputText) {
        // Escape first
        inputText = $('<div/>').text(inputText).html();

        var replacedText, replacePattern1, replacePattern2, replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a target="_blank" href="$1" target="_blank">$1</a>');

        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a target="_blank" href="http://$2" target="_blank">$2</a>');

        return replacedText;
    }
};
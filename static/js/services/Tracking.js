function Tracking(session, size) {
    var that = this;

    that.event = function(category, action, label) {
        if (label) {
            ga('send', 'event', category, action, label);
        } else {
            ga('send', 'event', category, action);
        }
    }

    var setUserId = null;
    that.setUserId = function(userId) {
        if (userId != setUserId) {
            ga('set', '&uid', userId);
            setUserId = userId;
        }
    } 

    that.page = function(url) {
        ga('send', 'pageview', url);
    }

    session.on('update', function(user) {
        if (user.guest) {
            return;
        }
        that.setUserId(user.id);
    });

    that.start = function() {
        setTimeout(function() {
            that.page('/' + size.size);
        }, 10);
    };    
}
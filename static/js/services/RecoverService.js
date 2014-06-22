function RecoverService() {
    var that = this;

    that.recover = function(email) {
        return Q($.post('/recoverRequest', {email: email}))
        .fail(function(response) {
            var body = response.responseJSON;
            var error = new Error('Error while trying to request recovery');
            error.reason = body.error || 'unknown';
            throw error;
        });
    }
}
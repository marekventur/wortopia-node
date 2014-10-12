function HashHandler() {
    var toOpen = null;

    this.handleHashs = function() {
        var hash = window.location.hash

        if(hash) {
            var elements = hash.split('.');
            if (elements[0] === '#pwr') {
                window.localStorage.setItem('sessionToken', elements[1]);
                window.location.hash = '';
                toOpen = 'account';
            }
            if (elements[0] === '#rules' || elements[0] === '#highscore') {
                $(function() {
                    $('#modal--' + elements[0].slice(1)).modal('toggle');
                });
            }
        }
    }

    this.needsOpening = function(name) {
        return name === toOpen;
    }
}
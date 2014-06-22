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
        }
    }

    this.needsOpening = function(name) {
        return name === toOpen;
    }
}
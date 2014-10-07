function Size() {
    var that = this;

    // Hashs are already handled at this point
    that.size = parseInt(window.location.pathname.slice(1), 10);
    if (that.size != 4 && that.size != 5) {
    	window.location.replace("/4");
    }

}

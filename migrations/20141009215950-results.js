var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
	db.runSql(fs.readFileSync(__dirname + '/20141009215950-results.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {
    // no.
};

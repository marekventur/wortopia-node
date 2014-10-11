var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
	db.runSql(fs.readFileSync(__dirname + '/20141011204553-size-in-results.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {

};

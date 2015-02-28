var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
	db.runSql(fs.readFileSync(__dirname + '/20152802000000-store-user-options.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {

};

var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
   db.runSql(fs.readFileSync(__dirname + '/20140426163418-add-words.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {
    // no.
};

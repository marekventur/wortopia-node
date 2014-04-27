var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
   db.runSql(fs.readFileSync(__dirname + '/20140426174917-first-two-letter-index.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {
    // no.
};

var async = require('async');
var fs = require('fs');

exports.up = function(db, callback) {
    db.runSql(fs.readFileSync(__dirname + '/99900000000001-allow-4-char-user-names.sql', {encoding: 'utf8'}), callback);
};

exports.down = function(db, callback) {

};

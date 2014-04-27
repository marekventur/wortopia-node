var Db = require('../../src/Db');
var dbConfig = require('../../database.json');
module.exports = new Db(dbConfig.test);
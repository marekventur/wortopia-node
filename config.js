var fs = require('fs');

var configPath = './config/config.js';

if(process.argv[2]) {
    configPath = process.argv[2];
}
if (!fs.existsSync(configPath)) {
    console.error("Couldn't load config from %s", configPath)
    process.exit(1);
}
module.exports = require(configPath);
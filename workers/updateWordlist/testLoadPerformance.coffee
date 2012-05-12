Wordlist = require "../../lib/Wordlist.class"
config   = require "../../config"

start = new Date().getTime()
wordlist = new Wordlist(config)
processingTime = new Date().getTime() - start;
console.log 'Time :', processingTime, 'ms'
console.log 'Words:',wordlist.count()

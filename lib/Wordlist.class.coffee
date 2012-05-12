fs = require 'fs'

class Wordlist
	constructor: (@config) ->
		plain = fs.readFileSync @config.wordlist
		@list = JSON.parse plain

	count: =>
		return @list.length

	isWord: (word) =>
		return @list.indexOf(word.toUpperCase()) != -1
	
module.exports = Wordlist
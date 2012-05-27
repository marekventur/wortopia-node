fs = require 'fs'
Word = require './Word.class'

class WordList
	constructor: (@config) ->
		@listPlain = []
		@list = []
		if @config?
			plain = fs.readFileSync @config.wordlist
			parsedList = JSON.parse plain
			for word in parsedList
				@add word
			

	count: =>
		return @list.length

	add: (word) =>
		@listPlain.push word
		@list.push(new Word(word))

	isWord: (word) =>
		return @list.indexOf(word.toUpperCase()) != -1
	
module.exports = WordList
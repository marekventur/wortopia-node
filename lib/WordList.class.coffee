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
		if word instanceof Word
			@listPlain.push word.word
			@list.push word
		else
			@listPlain.push word
			@list.push(new Word(word))

	includes: (word) =>
		return @listPlain.indexOf(word.toUpperCase()) != -1
	
module.exports = WordList
Helpers = require './Helpers'
WordList = require './WordList.class'
Word = require './Word.class'

class Field
	
	constructor: (@field) ->
		switch @field.length
			when 16 then @size = 4
			when 25 then @size = 5
			else throw "Invalid size for field #{@field}"

	getArray: () =>
		i = 0
		result = []
		for y in [0...@size]
			row = []
			for x in [0...@size]
				row.push @field.charAt y * @size + x
			result.push row
		return result

	findWords: (wordList, minLength=0) =>
		result = new WordList()
		for word in wordList.list
			if word.getLength() >= minLength 
				if @isOnField word
					result.add word
		return result

	isOnField: (word) =>
		if word instanceof Word
			word = word.word

		# I don't want to use the fatarrow here
		size = @size;

		# Set up function for recursion. x and y are 0 based
		checkOnField = (restWord, field, x, y) ->

			# Is there still something to check?
			if restWord == '' 
				return true

			# Out of bounds?
			if (x < 0) or (y < 0) or (x >= size) or (y >= size)
				return false
			
			# Next character 
			nextChar = restWord.charAt 0

			# If the character is not at this postion we can stop right here
			unless field[y][x] == nextChar
				return false

			# Clone the array, we don't want to mess with the original reference
			newField = Helpers.clone2DArray field

			# Mark character as used
			newField[y][x] = '#';

			# Remove first char from restWord
			restWord = restWord.substr 1

			# Use recursion to check the rest of the word
			return checkOnField(restWord, newField, x - 1, y - 1) ||
				checkOnField(restWord, newField, x + 1, y - 1) ||
				checkOnField(restWord, newField, x - 1, y + 1) ||
				checkOnField(restWord, newField, x + 1, y + 1) ||
				checkOnField(restWord, newField, x - 1, y    ) ||
				checkOnField(restWord, newField, x + 1, y    ) ||
				checkOnField(restWord, newField, x    , y - 1) ||
				checkOnField(restWord, newField, x    , y + 1)

		fieldArray = @getArray()
		# Try every starting point
		for y in [0...@size]
			for x in [0...@size]
				if checkOnField word, fieldArray, x, y
					return true

		return false


		
module.exports = Field
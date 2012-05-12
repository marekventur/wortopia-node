class Field
	###
	@param field String
	@param wordList Array of String
	###
	constructor: (@field, wordList) ->
		switch @field.length
			when 16 then @size = 4
			when 25 then @size = 5
			else throw "Invalid size for field #{@field}"
		

class Word
	constructor: (@word) ->
		@internal = @word.replace 'QU', 'Q'

	getLength: () =>
		return @word.length

	getPoints: () =>
		switch @getLength()
			when 0,1,2 then 0
			when 3,4 then 1
			when 5 then 2
			when 6 then 3
			when 7 then 5
			else 11

module.exports = Word
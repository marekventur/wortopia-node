Field = require '../lib/Field.class'
WordList = require '../lib/WordList.class'
Word = require '../lib/Word.class'

describe 'Testing Fields', () ->
	
	it 'should be createable with strings of the right length', () ->
		new Field 'ABCDEFGHIJKLMNOP'
		new Field 'ABCDEFGHIJKLMNOPQRSTUVWXY'

	it 'should create correct arrays', () ->
		field = new Field 'ABCDEFGHIJKLMNOP'
		out = [ [ 'A', 'B', 'C', 'D' ], [ 'E', 'F', 'G', 'H' ], [ 'I', 'J', 'K', 'L' ], [ 'M', 'N', 'O', 'P' ] ]
		expect(field.getArray()).toEqual out

	###
	RFRA
	RESU
	WKII
	KEBE
	###

	it 'should find those words', () ->
		field = new Field 'RFRARESUWKIIKEBE'
		expect(field.isOnField 'KEBE').toBe(true)
		expect(field.isOnField 'FRKBE').toBe(true)
		expect(field.isOnField 'ASKK').toBe(true)
		expect(field.isOnField 'EIEBKWK').toBe(true)
		expect(field.isOnField 'RFRAUSERWKIIEBEK').toBe(true)

	it 'should not find those words', () ->
		field = new Field 'RFRARESUWKIIKEBE'
		expect(field.isOnField 'KEEBE').toBe(false)
		expect(field.isOnField 'BIIIE').toBe(false)
		expect(field.isOnField 'FEF').toBe(false)
		expect(field.isOnField 'RSUAR').toBe(false)



	###it 'should find all right words', () ->
		field = new Field 'RFRARESUWKIIKEBE'
		wordList = new WordList()
		wordList.add 'FOO'
		wordList.add 'BAR'
		wordList.add 'TEST'###


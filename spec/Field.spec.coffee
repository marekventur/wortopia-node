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
		expect(field.isOnField 'KEBE').toBe true
		expect(field.isOnField 'FRKBE').toBe true
		expect(field.isOnField 'ASKK').toBe true
		expect(field.isOnField 'EIEBKWK').toBe true
		expect(field.isOnField 'RFRAUSERWKIIEBEK').toBe true

	it 'should not find those words', () ->
		field = new Field 'RFRARESUWKIIKEBE'
		expect(field.isOnField 'KEEBE').toBe false
		expect(field.isOnField 'BIIIE').toBe false
		expect(field.isOnField 'FEF').toBe false
		expect(field.isOnField 'RSUAR').toBe false

	it 'should not find those words', () ->
		field = new Field 'RFRARESUWKIIKEBE'
		wordList = new WordList()
		wordList.add(new Word 'KEBE')
		wordList.add(new Word 'FRKBE')
		wordList.add(new Word 'ASKK')
		wordList.add(new Word 'EIEBKWK')
		wordList.add(new Word 'RFRAUSERWKIIEBEK')
		wordList.add(new Word 'KEEBE')
		wordList.add(new Word 'BIIIE')
		wordList.add(new Word 'FEF')
		wordList.add(new Word 'RSUAR')
		output = field.findWords wordList
		expect(output.includes 'KEBE').toBe true
		expect(output.includes 'FRKBE').toBe true
		expect(output.includes 'ASKK').toBe true
		expect(output.includes 'EIEBKWK').toBe true
		expect(output.includes 'RFRAUSERWKIIEBEK').toBe true
		expect(output.count()).toBe(5)
		



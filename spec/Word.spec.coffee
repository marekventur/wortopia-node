Word = require '../lib/Word.class'

describe 'Testing Words', () ->
	
	it 'should create an internal representation', () ->
		word = new Word 'TEST'
		expect(word.internal).toEqual 'TEST'
		expect(word.word).toEqual 'TEST'

	it 'should handel QU correctly', () ->
		word = new Word 'QUEUE'
		expect(word.internal).toEqual 'QEUE'
		expect(word.word).toEqual 'QUEUE'

	it 'should count length correctly', () ->
		expect(new Word('QUEUE').getLength()).toEqual 5
		expect(new Word('TEST').getLength()).toEqual 4

	it 'should calculate points correctly', () ->
		expect(new Word('A').getPoints()).toEqual 0
		expect(new Word('AA').getPoints()).toEqual 0
		expect(new Word('AAA').getPoints()).toEqual 1
		expect(new Word('AAAA').getPoints()).toEqual 1
		expect(new Word('AAAAA').getPoints()).toEqual 2
		expect(new Word('AAAAAA').getPoints()).toEqual 3
		expect(new Word('AAAAAAA').getPoints()).toEqual 5
		expect(new Word('AAAAAAAA').getPoints()).toEqual 11





Helpers = require '../lib/Helpers'

describe 'Testing Helpers', () ->

	it 'should correctly clone an array', () ->
		input  = [[1,2],[3,4]]
		output = Helpers.clone2DArray input
		expect(output).toEqual input

	it 'should be a real clone', () ->
		input  = [[1,2],[3,4]]
		output = Helpers.clone2DArray input
		input[0][0] = 'test'
		input[1] = 'test2'
		expect(output[0][0]).toEqual 1
		expect(input[0][0]).toEqual 'test'		
		expect(output[1]).toEqual [3,4]
		expect(input[1]).toEqual 'test2'
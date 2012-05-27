
###
	Deep-clones a 2D array.
###
module.exports.clone2DArray = (input) =>
	
	result = []
	for row in input
		resultRow = []
		for element in row
			resultRow.push element
		result.push resultRow
	return result


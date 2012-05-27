
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

### 
	Use Fisher-Yates for shuffeling. See http://stackoverflow.com/a/3943985
###
module.exports.shuffle = (input) ->
	a = input.split ""
	n = a.length

	for i in [n-1..0]
		j = Math.floor(Math.random() * (i + 1))
		tmp = a[i]
		a[i] = a[j]
		a[j] = tmp

	return a.join ""

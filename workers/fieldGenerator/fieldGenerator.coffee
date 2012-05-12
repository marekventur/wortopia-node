Field    = require '../../lib/Field.class'
Language = require '../../lib/Language.class'

languageCode = 'de'
size     = 4

minLength = size - 1

language = new Language languageCode

# Get a string with all the right letters
letterDistributionString = language.getLetterDistributionString()

# Use Fisher-Yates for shuffeling. See http://stackoverflow.com/a/3943985
shuffle = (input) ->
	a = input.split ""
	n = a.length

	for i in [n-1..0]
		j = Math.floor(Math.random() * (i + 1))
		tmp = a[i]
		a[i] = a[j]
		a[j] = tmp

	return a.join ""

field = shuffle letterDistributionString
field = field.substring 0, size * size
console.log field
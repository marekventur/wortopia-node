Field    = require '../../lib/Field.class'
Language = require '../../lib/Language.class'
WordList = require "../../lib/WordList.class"
config   = require "../../config"

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

# Everyday I'm shuffelin'
field = shuffle letterDistributionString
field = field.substring 0, size * size

# First line in the output is the field
console.log field

# Load Wordlist
wordlist = new WordList config

#for word in wordlist.list


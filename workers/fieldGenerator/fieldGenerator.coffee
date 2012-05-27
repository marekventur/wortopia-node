Field    = require '../../lib/Field.class'
Language = require '../../lib/Language.class'
WordList = require "../../lib/WordList.class"
Helpers  = require "../../lib/Helpers"
config   = require "../../config"

if process.argv.length < 4
	console.log "Please define size and language code like this: 'coffee fieldGenerator de 4'"
	process.exit(1);

languageCode = process.argv[2]
size     = process.argv[3]

unless size in ['4','5'] 
	console.log "Invalid size '#{size}'. Please use 4 or 5"
	process.exit(1);

size = size*1;

minLength = size - 1

language = new Language languageCode

# Get a string with all the right letters
letterDistributionString = language.getLetterDistributionString()

# Everyday I'm shuffelin'
fieldString = Helpers.shuffle letterDistributionString
fieldString = fieldString.substring 0, size * size

# First line in the output is the field
console.log fieldString

# Create field object
field = new Field fieldString

# Load Wordlist
wordlist = new WordList config

# Find all valid words on this field. This might take longer
wordsOnField = field.findWords wordlist, minLength

for word in wordsOnField.list
	console.log word.word


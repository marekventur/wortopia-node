Database = require '../../lib/WortopiaDatabase'
config   = require '../../config'
fs       = require 'fs' 

database = new Database config
database.getAllWords (list) =>
	stream = fs.createWriteStream '../../'+config.wordlist
	stream.once 'open', (fd) =>

		stream.write "["
		i = 0;
		first = true
		for row in list
			word = row.word.toUpperCase()
			unless first
				stream.write ", "
			else
				first = false
			
			i = (i + 1) % 5
			if i == 0
				stream.write "\n"

			stream.write "\"#{word}\""
		stream.write "]"

		console.log 'done'

		database.end()
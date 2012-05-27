###
    Wrappers the database
###
winston = require 'winston'
mysql   = require 'mysql'

client = null

module.exports = 

	initiate: (config) ->
		client = mysql.createClient config.mysql
		winston.info 'Database successfuly instantiated'

	getPlayerForId: (id) ->
		return false

	getAllWords: (callback) ->
		client.query 'SELECT word FROM words;',
			(err, results, fields) =>
				if err
					throw err

				callback results

	end: ->
		client.end()


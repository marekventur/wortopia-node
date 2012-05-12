###
    Wrappers the database

    This is a singleton
###
winston = require 'winston'
mysql   = require 'mysql'

class WortopiaDatabase
	constructor: (@config) ->
		@mysql = mysql.createClient @config.mysql

		winston.info 'Database successfuly instantiated'

	getPlayerForId: (id) =>
		return false

	getAllWords: (callback) =>
		
		@mysql.query 'SELECT word FROM words;',
			(err, results, fields) =>
				if err
					throw err

				callback results

	end: =>
		@mysql.end()

module.exports = WortopiaDatabase

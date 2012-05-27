events = require 'events'

GAME_LENGTH  = 60 * 3
PAUSE_LENGTH = 30
LENGTH       = GAME_LENGTH + PAUSE_LENGTH

class GameTimer extends events.EventEmitter
	constructor: ->
		@setMaxListeners 0

	getTimestamp: ->
		Math.round(new Date().getTime() / 1000)

	getGameID: ->
		Math.floor(@getTimestamp() / LENGTH)	

	getGameTime: ->
		Math.floor(@getTimestamp() % LENGTH)

	gameRunning: ->
		return @getGameTime <= GAME_LENGTH

module.exports = GameTimer
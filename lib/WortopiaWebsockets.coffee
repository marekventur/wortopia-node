###
    This class handles the websocket bits
###

SocketIO = require 'socket.io'
events   = require 'events'

class WortopiaWebsockets extends events.EventEmitter 

	constructor: (@config, express, gameTimer) ->
		@numberOfConnections = 0
		@setMaxListeners 0

		@io = SocketIO.listen express
		@io.sockets.on 'connection', (socket) =>
			++@numberOfConnections


			# Inform client about game time
			socket.emit	'gameTime', gameTimer.getGameID(), gameTimer.getGameTime() 

			# Wait for the client to identify himself
			socket.on 'identify', (sessionID) =>
				user = {name: 'Max Musermann', id: 123}

				socket.on 'chat', (message) ->
					socket.broadcast.emit 'chat', user, message
					socket.emit 'chat', user, message

			@on 'broadcast', socket.emit

			# Clean up when the client disconnects
			socket.on 'disconnect', () =>
				--@numberOfConnections
				@removeListener 'broadcast', socket.emit



module.exports = WortopiaWebsockets
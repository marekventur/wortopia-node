###
	Requires socket.io and jQuery
###

htmlEntities = (str) -> 
    String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')


$ ->
	socket = io.connect 'http://localhost:8080'

	socket.on 'gameTime', (gameID, gameTime)->
		console.log gameID, gameTime
	
	# identify via sessionid
	socket.emit 'identify', 'sessionid'

	###
	Chat
	###
    # outgoing chat messages
	$('#chat_input').keypress (e) ->
		code = e.keyCode ? e.which
		if code == 13 
        	socket.emit 'chat', $('#chat_input').val()
        	$('#chat_input').val ''

	# incoming chat messages
	socket.on 'chat', (user, message) ->
		username = htmlEntities user.name
		message = htmlEntities message
		$('#chat_display').append "<div><b>#{username} :</b>#{message}</div>"

###
    This is the wortopia main file. 
    Start it via `coffee app`
###

winston = require 'winston'

config             = require '../config'
WortopiaHttp       = require '../lib/WortopiaHttp'
WortopiaWebsockets = require '../lib/WortopiaWebsockets'
db                 = require '../lib/WortopiaDatabase'
GameTimer          = require '../lib/GameTimer.class'

winston.info 'Starting wortopia...'

# GameTimer
gameTimer = new GameTimer()

# Make sure the database is initiated
db.initiate config

# This handles all our HTTP traffic (or at least the bit we want to serve from there)
http = new WortopiaHttp config

# Let's start the websockets server
websockets = new WortopiaWebsockets config, http.app, gameTimer

# We are done with our initalization
winston.info 'Wortopia started successful'

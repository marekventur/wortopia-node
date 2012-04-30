###
    This is the wortopia main file. 
    Start it via `coffee app`
###

winston = require 'winston'

config             = require './config'
WortopiaHttp       = require './lib/WortopiaHttp'
WortopiaWebsockets = require './lib/WortopiaWebsockets'
db                 = require './lib/WortopiaDatabase'


# Welcome the person that starts it
winston.info 'Starting wortopia...'

# Make sure the database is initiated
db.initiate config

# This handles all our HTTP traffic (or at least the bit we want to serve from there)
http = new WortopiaHttp config

# Let's start the websockets server
websockets = new config, http

# We are done with our initalization
winston.info 'Wortopia started successful'

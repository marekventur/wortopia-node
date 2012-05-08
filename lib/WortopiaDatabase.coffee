###
    Wrappers the database

    This is a singleton
###
winston = require 'winston'

# This is different, so watch out!
module.exports =  
    initiate: (@config) =>
        winston.info 'Database successfuly instantiated'

        # Those functions are in here to make sure they can't be called before it's instantiated

        # Return a player object for a given id
        @getPlayerForId: (id) =>
            return false




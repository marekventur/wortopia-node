###
    Express is used to serve http
###

express = require 'express'
winston = require 'winston'
ejs     = require 'ejs'

class WortopiaHttp 
    constructor: (@config) ->

        # Start an express server
        @app = express.createServer()

        # Configure the hell out of it
        @app.configure () =>
            @app.use express.methodOverride()
            @app.use express.bodyParser()
            @app.use @app.router
            @app.set 'views', __dirname + '/../client'
            @app.set "view options", { layout: false }

        @app.configure 'development', () =>
            winston.info "Express uses DEVELOPMENT config. This offers only limited caching and should not be used for production"
            @app.use express.static(__dirname + '/../client')
            @app.use express.errorHandler { dumpExceptions: true, showStack: true } 

        @app.configure 'production', () =>
            winston.info "Express uses PRODUCTION config"
            oneYear = 31557600000
            @app.use express.static(__dirname + '/../client', { maxAge: oneYear })
            @app.use express.errorHandler()

        @app.get '/', (req, res) =>
            res.render 'index.ejs', { layout: false } 

        @app.listen @config.http.port
        winston.info "HTTP Server started on port #{config.http.port}"

module.exports = WortopiaHttp
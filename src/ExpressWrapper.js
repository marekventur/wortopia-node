import express from 'express';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import path from 'path';

export default function(config, logger) {
    var that = this;

    that.app = express();

    that.start = function() {
        const basePath = path.join(__dirname, '../static-build/');
        

        that.app.get("/", function(req, res) {
        	res.redirect('/4');
        });
        that.app.get(/\/[45]/, function(req, res) {
        	res.sendFile(path.join(basePath, 'index.html'));
        });
        that.app.use(serveStatic(basePath));
        that.app.use(bodyParser());
    }

}

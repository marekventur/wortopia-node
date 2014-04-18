var exec = require('child_process').exec;
var _ = require('underscore');
var async = require('async');
var lineReader = require('line-reader');

module.exports = function(redis, config, logger, redisKeyGenerator) {
    this.start = function() {
        async.eachSeries(_.keys(config.languages), function(language, done) {
            logger.info('Checking language %s...', language);
            var redisKey = redisKeyGenerator.getWordsKey(language);
            var filePath = require('path').resolve(__dirname + '/../languages/' + language + '/words.txt');
            logger.info('File path: %s', filePath);

            // Get number of members from redis
            redis.scard(redisKey, function(err, numberOfRedisMembers) {
                if (err) {
                    throw err;
                }

                // Get number of words from the language file
                exec('wc -l ' + filePath, function (err, numberOfLinesInFile) {
                    if (err) {
                        throw err;
                    }
                    numberOfLinesInFile = parseInt(numberOfLinesInFile, 10) + 1;

                    logger.info("Redis: %d   File: %d", numberOfRedisMembers, numberOfLinesInFile);
                    if (numberOfRedisMembers == numberOfLinesInFile) {
                        logger.info('Number of words match, no refresh needed');
                        done();
                    } else {    
                        // TODO: There are better ways of doing this: http://redis.io/topics/mass-insert
                        logger.info('Refreshing redis key now...');
                        redis.del(redisKey);
                        elementsRead = 0;
                        lineReader.eachLine(filePath, function(word, last) {
                            elementsRead++;
                            if (last) {
                                redis.sadd(redisKey, word, function() {
                                    clearInterval(progressInterval);
                                    done(); 
                                });
                            } else {
                                redis.sadd(redisKey, word);    
                            }
                        });

                        var progressInterval = setInterval(function() {
                            logger.info("Read: %d / %d", elementsRead, numberOfLinesInFile);
                        }, 1000);
                    }
                });
            });
        }, function(err, data) {
            if (err) {
                throw new err;
            }
            logger.info('All languages have been checked successfully.')
        });
    }
}
var _ = require('underscore');
var Q = require('q');

module.exports = function(field, db) {
    var that = field;
    var players = {};
    var teams = {};
    var resultList = [];
    var finished = false;

    function getPlayer(user) {
        if (!players[user.id]) {
            players[user.id] = {
                user: user,
                words: {},
                points: 0
            };
            if (user.team) {
                players[user.id].teamName = user.team;
                getTeam(user.team).players.push(players[user.id]);
            } else {
                resultList.push(players[user.id]);
            }
        }
        return players[user.id];
    }

    function getTeam(teamName) {
        if(!teams[teamName]) {
            teams[teamName] = {
                team: true,
                name: teamName,
                words: {},
                players: [],
                points: 0
            };
            resultList.push(teams[teamName]);
        }
        return teams[teamName];
    }

    that.scoreForPlayer = function(user, word) {
        var player = getPlayer(user);
        if (!player.words[word.word]) {
            player.words[word.word] = word;
            player.points += word.points;

            if (player.teamName && !teams[player.teamName].words[word.word]) {
                teams[player.teamName].words[word.word] = word;
                teams[player.teamName].points += word.points;
            }

            return true;
        }
        return false;
    }

    that.finishGame = function() {
        var totalPoints = that.getTotalPointsSync();
        finished = true;
        resultList.sort(compareByPoints);
        _.each(teams, function(team) {
            team.players.sort(compareByPoints);
            team.words = _.toArray(team.words);
            team.words.sort(compareByPoints);
            team.percent = Math.round(team.points / totalPoints * 100);
        });
        _.each(players, function(player) {
            player.words = _.toArray(player.words);
            player.words.sort(compareByPoints);
            if (player.user.guest) {
                player.user = {
                    id: player.user.id,
                    guestId: player.user.guestId,
                    guest: player.user.guest
                };
            } else {
                player.user = {
                    id: player.user.id,
                    name: player.user.name,
                    guest: false
                };
            }
            
            player.percent = Math.round(player.points / totalPoints * 100);
        })

        that.scoreForPlayer = function() {
            throw new Error('The game has finished');
        }

        that.getResult = function() {
            return resultList;
        }

        that.saveToDb = function() {
            var now;
            var lastPromise = db.queryOne('select now() as now;')
            .then(function(result) {
                now = result.now;
            })
            _.each(players, function(player) {
                if (!player.user.guest) {
                    lastPromise = lastPromise.then(function() {
                        return db.query(
                            'insert into user_results (user_id, finished, words, points, max_words, max_points, size) values ($1, $2, $3, $4, $5, $6, $7);',
                                [
                                    player.user.id, 
                                    now,
                                    player.words.length,
                                    player.points,
                                    that.getWordCountSync(),
                                    totalPoints,
                                    that.size
                                ]
                            );
                    });
                }   
            })
            return lastPromise;
        }
    }

    that.isFinished = function() {
        return finished;
    }

    that.saveToDb = function() {
        throw new Error('The game has to be finished first');   
    }

    that.getResult = function() {
        throw new Error('The game has to be finished first');
    }

    that.getResultForPlayer = function(user) {
        if (players[user.id]) {
            return {
                points: players[user.id].points,
                words: _.toArray(players[user.id].words)
            };
        }
        return {points: 0, words: []};
    }

    that.getPointsForPlayer = function(user) {
        if (players[user.id]) {
            return players[user.id].points;
        }
        return 0;
    }

    function compareByPoints(a, b) {
        if (a.points < b.points) {
            return 1;
        }
        if (a.points > b.points) {
            return -1;
        }
        return 0;
    }
}

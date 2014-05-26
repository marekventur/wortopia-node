var _ = require('underscore');

module.exports = function(field) {
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
                teamName: teamName,
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
        finished = true;
        resultList.sort(compareByPoints);
        _.each(teams, function(team) {
            team.players.sort(compareByPoints);
            team.words = _.toArray(team.words);
            team.words.sort(compareByPoints);
        });
        _.each(players, function(player) {
            player.words = _.toArray(player.words);
            player.words.sort(compareByPoints);
        })

        that.scoreForPlayer = function() {
            throw new Error('The game has finished');
        }

        that.getResult = function() {
            return resultList;
        }
    }

    that.isFinished = function() {
        return finished;
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

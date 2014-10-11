require('./setup');

describe('FieldPlayers', function() {
    var field, user1, user2, userReal, user3Team1, user4Team1, word1, word2, word3, db;

    beforeEach(function() {
        setUpDi();

        field = [
            ['n', 'r', 'u', 'd'],
            ['e', 't', 'e' ,'m'],
            ['a', 's', 'e', 'n'],
            ['m', 'r', 't', 'n']
        ];
        di.get('fieldDecorator').decorate(field);
        user1 = {id: 1, name: 'John'};
        user2 = {id: 2, name: 'Jill'};
        user3Team1 = {id: 3, team: 'team1', name: 'Sue'};
        user4Team1 = {id: 4, team: 'team1', name: 'Lee'};
        word1 = {word: 'tea', points: 1};
        word2 = {word: 'bloom', points: 2};
        word3 = {word: 'teapot', points: 3};
        field.getTotalPointsSync = sinon.stub().returns(12);
    });

    it('calling getResult before finishing results in an error', function() {
        try {
            field.getResult();
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'The game has to be finished first');
        }
    });

    it('calling scoreForPlayer after finishing results in an error', function() {
        try {
            field.finishGame();
            field.scoreForPlayer(user1, word1);
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'The game has finished');
        }
    });

    it('works with a simple szenario', function() {
        assert.equal(field.getResultForPlayer(user1).points, 0);
        assert.equal(field.getPointsForPlayer(user1), 0);
        assert.deepEqual(field.getResultForPlayer(user1).words, []);
        assert.ok(field.scoreForPlayer(user1, word1));
        assert.equal(field.getResultForPlayer(user1).points, 1);
        assert.equal(field.getPointsForPlayer(user1), 1);
        assert.deepEqual(field.getResultForPlayer(user1).words, [word1]);
        field.finishGame();
        assert.equal(field.getResult().length, 1);
        assert.equal(field.getResult()[0].user.id, user1.id);
        assert.equal(field.getResult()[0].user.name, user1.name);
        assert.equal(field.getResult()[0].points, 1);
    });

    it('guessing words twice will return false and not increase points', function() {
        assert.ok(field.scoreForPlayer(user1, word1));
        assert.notOk(field.scoreForPlayer(user1, word1));
        field.finishGame();
        assert.equal(field.getResult().length, 1);
        assert.equal(field.getResult()[0].user.id, user1.id);
        assert.equal(field.getResult()[0].points, 1);
    });

    it('two players will be scored correctly', function() {
        assert.ok(field.scoreForPlayer(user1, word1));
        assert.ok(field.scoreForPlayer(user2, word1));
        assert.ok(field.scoreForPlayer(user2, word2));
        field.finishGame();
        assert.equal(field.getResult().length, 2);
        assert.equal(field.getResult()[0].user.id, user2.id);
        assert.equal(field.getResult()[1].user.id, user1.id);
        assert.equal(field.getResult()[0].points, 3);
        assert.equal(field.getResult()[1].points, 1);
        assert.deepEqual(field.getResult()[0].words[0], word2);
    });

    it('teams will be scored correctly', function() {
        assert.ok(field.scoreForPlayer(user3Team1, word1));
        assert.ok(field.scoreForPlayer(user4Team1, word1));
        assert.ok(field.scoreForPlayer(user4Team1, word2));
        field.finishGame();
        assert.equal(field.getResult().length, 1);
        assert.deepEqual(field.getResult()[0].name, 'team1');
        assert.equal(field.getResult()[0].points, 3);
        assert.equal(field.getResult()[0].percent, 25);
        assert.deepEqual(field.getResult()[0].players[0].user.id, user4Team1.id);
        assert.deepEqual(field.getResult()[0].players[1].user.id, user3Team1.id);
        assert.deepEqual(field.getResult()[0].players[0].words[0], word2);
        assert.equal(field.getResult()[0].players[1].points, 1);
        assert.equal(field.getResult()[0].players[1].percent, 8);
    });

    it('mixing teams and normal players will be scored correctly', function() {
        assert.ok(field.scoreForPlayer(user1, word1));
        assert.ok(field.scoreForPlayer(user2, word1));
        assert.ok(field.scoreForPlayer(user2, word3));
        assert.ok(field.scoreForPlayer(user3Team1, word1));
        assert.ok(field.scoreForPlayer(user4Team1, word1));
        assert.ok(field.scoreForPlayer(user4Team1, word2));
        field.finishGame();
        assert.equal(field.getResult().length, 3);
        assert.deepEqual(field.getResult()[0].user.id, user2.id);
        assert.deepEqual(field.getResult()[2].user.id, user1.id);
        assert.equal(field.getResult()[0].points, 4);
        assert.equal(field.getResult()[2].points, 1);
        assert.deepEqual(field.getResult()[1].name, 'team1');
    });

    context('with real user', function() {
        beforeEach(function() {
            db = di.get('db');
            return db.query('delete from users;')
            .then(function() {
                return di.get('userDao').create('testuser', 'test@test.com', 'abc')
            })
            .then(function(user) {
                userReal = user;
            });
        });

        it('#saveToDb works', function() {
            assert.ok(field.scoreForPlayer(userReal, word2));
            field.finishGame();
            field.getWordCountSync = sinon.stub().returns(10);
            return field.saveToDb() 
            .then(function() {
                return db.queryOne('select * from user_results where user_id = $1 limit 1', [userReal.id]);
            })
            .then(function(result) {
                assert.equal(result.words, 1);
                assert.equal(result.points, 2);
                assert.equal(result.max_words, 10);
                assert.equal(result.max_points, 12);
            });
        });
    });
});

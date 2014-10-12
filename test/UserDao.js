require('./setup');

describe('FieldPlayers', function() {
    var db, user, userDao;

    beforeEach(function() {
        setUpDi();
        
        db = di.get('db');
        userDao = di.get('userDao');
        return db.query('delete from users;')
        .then(function() {
            return userDao.create('testuser', 'test@test.com', 'abc')
        })
        .then(function(setUser) {
            user = setUser;
        });
    });

    it('#getViaLogin works with username', function() {
        return userDao.getViaLogin('testuser', 'abc');
    });

    it('#getViaLogin works with email', function() {
        return userDao.getViaLogin('test@test.com', 'abc');
    });

    it('#getViaLogin fails on ', function() {
        return userDao.getViaLogin('nope', 'abc')
        .then(assert.fail, assert.ok);
    });
    
});

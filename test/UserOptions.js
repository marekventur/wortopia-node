require('./setup');

describe('UserOptions', function() {
    var db, userDao, user;

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

    it('returns empty object by default', function() {
        return user.getOptions()
        .then(function(options) {
            assert.deepEqual(options, {});
        });
    })

    it('setting and getting works', function() {
        var options = {foo: 'bar'};
        return user.setOptions(options)
        .then(function() {
            return user.getOptions();
        })
        .then(function(retrievedOptions) {
            assert.deepEqual(retrievedOptions, options);
        })
    });
    
});

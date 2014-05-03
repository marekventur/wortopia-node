var Q = require('q');
var pg = require('pg');
module.exports = function(databaseConfig) {
    var that = this;

    function getConnectionString() {
        return databaseConfig[process.env.NODE_ENV || 'dev'];
    }

    that.query = function(sql, params) {
        var deferred = Q.defer();
        pg.connect(getConnectionString(), function(err, client, done) {
            if (err) {
                return deferred.reject(new Error(err));
            }
            client.query(sql, params, function(err, result) {
                done();

                if (err) {
                    var error = new Error(err);
                    error.message = error.message + '(Query: ' + sql + ')';
                    return deferred.reject(error);
                }

                deferred.resolve(result.rows);
            });
        });

        return deferred.promise;
    }

    that.queryOne = function(sql, params) {
        return that.query(sql, params)
        .then(function(rows) {
            if (!rows || rows.length == 0) {
                return null;
            }
            return rows[0];
        });
    }

}
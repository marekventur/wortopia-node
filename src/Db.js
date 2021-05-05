import pg from 'pg';

export default function(config, logger) {
    var that = this;

    const pool = new pg.Pool({
        connectionString: config.dbConnectionString
    });
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    });

    that.query = async function(sql, params) {
        try {
            return (await pool.query(sql, params)).rows;
        } catch (e) {
            throw new Error(`${e.message} (Query ${sql})`);
        }
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
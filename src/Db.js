import pg from 'pg';

export default function(config, logger) {
    var that = this;

    function getConnectionString() {
        return config.dbConnectionString;
    }

    that.query = async function(sql, params) {
        const client = new pg.Client(getConnectionString());
        await client.connect()
        try {
            return (await client.query(sql, params)).rows;
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
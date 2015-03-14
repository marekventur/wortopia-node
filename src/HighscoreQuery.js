var _ = require('underscore');
module.exports = function(db) {
	var that = this;

	that.query = function(size, interval) {
		sql = "SELECT " +  
			"	u.name, " + 
			"   u.id, " +
			"	sub.avg, " + 
			"	sub.avg_words as \"avgWords\", " + 
			"	sub.count " + 
			"FROM " + 
			"	( " + 
			"		SELECT  " + 
			"			user_id, " + 
			"			avg(points / max_points::float) AS avg, " + 
			"			avg(words)::float as avg_words, " + 
			"			count(1)::integer AS count " + 
			"		FROM  " + 
			"			user_results " + 
			"		WHERE  " + 
			"			finished > now() - INTERVAL '1 day' * $2  " + 
			"				AND " + 
			"			max_points > 0 " + 
			"				AND " + 
			"			size = $1 " + 
			"		GROUP BY  " + 
			"			user_id " + 
			"	) as sub " + 
			"		LEFT JOIN " + 
			"	users u " + 
			"		ON  " + 
			"	u.id = sub.user_id " + 
			"WHERE  " + 
			"	sub.count > 2 " + 
			"ORDER BY " + 
			"	sub.avg DESC " + 
			"LIMIT 100;";
		return db.query(sql, [size, interval]);
	}
}
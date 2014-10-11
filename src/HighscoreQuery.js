var _ = require('underscore');
module.exports = function(db) {
	var that = this;

	that.query = function(size) {
		sql = "SELECT " +  
			"	u.name, " + 
			"	sub.avg, " + 
			"	sub.avg_words as avgWords, " + 
			"	sub.count " + 
			"FROM " + 
			"	( " + 
			"		SELECT  " + 
			"			user_id, " + 
			"			avg(points / max_points::float) AS avg, " + 
			"			avg(words) as avg_words, " + 
			"			count(1) AS count " + 
			"		FROM  " + 
			"			user_results " + 
			"		WHERE  " + 
			"			finished > now() - INTERVAL '1 month'  " + 
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
			"	sub.count > 5 " + 
			"ORDER BY " + 
			"	sub.avg DESC " + 
			"LIMIT 100;";
		return db.query(sql, [size]);
	}
}
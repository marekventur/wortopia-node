CREATE TABLE user_results
(
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
	finished timestamp without time zone NOT NULL DEFAULT now(),
	words INTEGER NOT NULL,
	points INTEGER NOT NULL,
	max_words INTEGER NOT NULL,
	max_points INTEGER NOT NULL
);
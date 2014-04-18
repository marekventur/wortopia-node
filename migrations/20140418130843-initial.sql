CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users
(
    name CITEXT PRIMARY KEY
        CONSTRAINT name_not_too_long CHECK(char_length(name) <= 15)
        CONSTRAINT name_not_too_short CHECK(char_length(name) > 4)
        CONSTRAINT name_shouldnt_be_confusable_with_guest CHECK(name NOT LIKE 'guest_%'),
    pw_hash TEXT NOT NULL,
    team CITEXT
        CONSTRAINT team_not_too_long CHECK(char_length(team) <= 12)
        CONSTRAINT team_not_too_short CHECK(char_length(team) > 4)
);

-- INSERT INTO users (name, pw_hash) VALUES ('marekventur', crypt('test', gen_salt('bf')));
-- SELECT pw_hash = crypt('test', pw_hash) FROM users WHERE name = 'marekventur';

CREATE TABLE words
(
    word CITEXT PRIMARY KEY,
    accepted BOOL NOT NULL DEFAULT true
);

CREATE TABLE wiki
(
    id SERIAL PRIMARY KEY,
    user_name CITEXT REFERENCES users(name) ON DELETE CASCADE,
    word CITEXT REFERENCES words(word) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);
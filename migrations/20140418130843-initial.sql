--CREATE EXTENSION IF NOT EXISTS citext;
--CREATE EXTENSION IF NOT EXISTS pgcrypto;
--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name CITEXT NOT NULL UNIQUE
        CONSTRAINT name_not_too_long CHECK(char_length(name) <= 15)
        CONSTRAINT name_not_too_short CHECK(char_length(name) > 4)
        CONSTRAINT name_shouldnt_be_confusable_with_guest CHECK(name NOT LIKE 'guest_%'),
    pw_hash TEXT NOT NULL,
    team CITEXT
        CONSTRAINT team_not_too_long CHECK(char_length(team) <= 12)
        CONSTRAINT team_not_too_short CHECK(char_length(team) > 4),
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

-- Store email addresses in a different table, that way we can lock permissions down
CREATE TABLE user_emails
(
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    email TEXT NOT NULL
);

CREATE TABLE user_sessions
(
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    guest_id INTEGER,
    session_token TEXT NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    valid_until timestamp without time zone NOT NULL DEFAULT now() + INTERVAL '30 days',
    CONSTRAINT user_id_or_guest_id_given CHECK( (user_id IS NULL) != (guest_id IS NULL) )
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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    word CITEXT REFERENCES words(word) ON DELETE CASCADE ON UPDATE CASCADE,
    text TEXT NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

ALTER TABLE users DROP CONSTRAINT name_not_too_short;
ALTER TABLE users ADD CONSTRAINT name_not_too_short CHECK(char_length(name) >= 4);
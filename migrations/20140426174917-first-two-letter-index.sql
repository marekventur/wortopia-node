ALTER TABLE words ADD CONSTRAINT word_can_only_be_lowercase check(word = lower(word));
CREATE INDEX words_first_two_letters ON words (substring(replace(word, 'qu', 'q') for 2));
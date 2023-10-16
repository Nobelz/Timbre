SET SEARCH_PATH TO timbre;

DROP TABLE IF EXISTS song_profile;
DROP TABLE IF EXISTS song_rating;
DROP TABLE IF EXISTS user_relationship;
DROP TABLE IF EXISTS friend_request;
DROP TABLE IF EXISTS recommendation;
DROP TABLE IF EXISTS song;
DROP TABLE IF EXISTS timbre_user;

CREATE TABLE timbre_user (
	user_id SERIAL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	first_name TEXT,
	last_name TEXT,
	user_bio TEXT,
	spotify_last_refresh TIMESTAMP
);

CREATE TABLE friend_request (
	from_id INTEGER,
	to_id INTEGER,
	
	PRIMARY KEY(from_id, to_id),
	
	CONSTRAINT fk_from_friendreq
		FOREIGN KEY(from_id) 
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_to_friendreq
		FOREIGN KEY(to_id) 
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_friend_request_pair  ON timbre.friend_request (LEAST(from_id, to_id), GREATEST(from_id, to_id));

CREATE TABLE user_relationship  (
	matching_id SERIAL PRIMARY KEY,
	user_id1 INTEGER NOT NULL,
	user_id2 INTEGER NOT NULL,
	compatibility_score DOUBLE PRECISION,
	is_friend BOOLEAN NOT NULL,
	
	CONSTRAINT fk_matching_user1
		FOREIGN KEY(user_id1)
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_matching_user2
		FOREIGN KEY(user_id2)
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_relationship_pair ON timbre.user_relationship  (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));

CREATE TABLE song (
	song_id TEXT PRIMARY KEY
);

CREATE TABLE song_rating(
	user_id INTEGER,
	song_id TEXT,
	rating INTEGER NOT NULL,
	
	PRIMARY KEY(user_id, song_id),
	
	CONSTRAINT fk_rating_user
		FOREIGN KEY(user_id) 
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_rating_song
		FOREIGN KEY(song_id) 
			REFERENCES song(song_id)
			ON DELETE CASCADE
);

CREATE TABLE recommendation(
	song_id TEXT,
	sender_id INTEGER,
	receiver_id INTEGER,
	rec_message TEXT,
	
	PRIMARY KEY(song_id, sender_id, receiver_id),

	CONSTRAINT fk_recommendation_song
		FOREIGN KEY(song_id) 
			REFERENCES song(song_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_recommendation_sender
		FOREIGN KEY(sender_id) 
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_recommendation_receiver
		FOREIGN KEY(receiver_id) 
			REFERENCES timbre_user(user_id)
			ON DELETE CASCADE
);

CREATE TABLE song_profile(
    user_id INTEGER,
    type_id INTEGER CHECK (type_id BETWEEN 1 AND 4), -- 1: top artists, 2: top tracks, 3: recently played, 4: user ratings
    acousticness DECIMAL NOT NULL CHECK (acousticness >= 0 AND acousticness <= 1),
    valence DECIMAL NOT NULL CHECK (valence >= 0 AND valence <= 1),
    danceability DECIMAL NOT NULL CHECK (danceability >= 0 AND danceability <= 1),
    energy DECIMAL NOT NULL CHECK (energy >= 0 AND energy <= 1),
    instrumentalness DECIMAL NOT NULL CHECK (instrumentalness >= 0 AND instrumentalness <= 1),
    liveness DECIMAL NOT NULL CHECK (liveness >= 0 AND liveness <= 1),
    loudness DECIMAL NOT NULL CHECK (loudness >= 0 AND loudness <= 1),
    speechiness DECIMAL NOT NULL CHECK (speechiness >= 0 AND speechiness <= 1),
    tempo DECIMAL NOT NULL CHECK (tempo >= 0 AND tempo <= 1),

    PRIMARY KEY(user_id, type_id),

    CONSTRAINT fk_user_song_profile
        FOREIGN KEY(user_id)
            REFERENCES timbre_user(user_id)
            ON DELETE CASCADE
)
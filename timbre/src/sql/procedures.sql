CREATE OR REPLACE FUNCTION timbre.search_user_from_id(
    id_to_search TEXT
)
RETURNS SETOF INTEGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
    SELECT user_id FROM timbre.timbre_user WHERE spotify_id = id_to_search;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.search_user_from_email(
    email_to_search TEXT
)
RETURNS SETOF INTEGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
	SELECT user_id FROM timbre.timbre_user WHERE email = email_to_search;
END;
$$;

CREATE OR REPLACE PROCEDURE timbre.create_user(
    spotify_id TEXT,
    email TEXT,
    spotify_display_name TEXT,
    profile_link TEXT
)
LANGUAGE SQL
AS $$
    INSERT INTO timbre.timbre_user (spotify_id, email, spotify_diplay_name, profile_link, create_time) VALUES (spotify_id, email, spotify_display_name, profile_link, NOW());
$$;

CREATE OR REPLACE PROCEDURE timbre.insert_song_profile(
    user_id INTEGER,
    type_id INTEGER,
    acousticness DECIMAL,
    valence DECIMAL,
    danceability DECIMAL,
    energy DECIMAL,
    instrumentalness DECIMAL,
    liveness DECIMAL,
    loudness DECIMAL,
    speechiness DECIMAL,
    tempo DECIMAL
)
LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO timbre.song_profile 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'acousticness') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $3), characteristics.max = MAX(characteristics.max, $3)
        WHERE characteristics.name = 'acousticness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('acousticness', $3, $3);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'valence') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $4), characteristics.max = MAX(characteristics.max, $4)
        WHERE characteristics.name = 'valence';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('valence', $4, $4);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'danceability') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $5), characteristics.max = MAX(characteristics.max, $5)
        WHERE characteristics.name = 'danceability';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('danceability', $5, $5);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'energy') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $6), characteristics.max = MAX(characteristics.max, $6)
        WHERE characteristics.name = 'energy';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('energy', $6, $6);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'instrumentalness') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $7), characteristics.max = MAX(characteristics.max, $7)
        WHERE characteristics.name = 'instrumentalness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('instrumentalness', $7, $7);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'liveness') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $8), characteristics.max = MAX(characteristics.max, $8)
        WHERE characteristics.name = 'liveness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('liveness', $8, $8);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'loudness') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $9), characteristics.max = MAX(characteristics.max, $9)
        WHERE characteristics.name = 'loudness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('loudness', $9, $9);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'speechiness') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $10), characteristics.max = MAX(characteristics.max, $10)
        WHERE characteristics.name = 'speechiness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('speechiness', $10, $10);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE characteristics.name = 'tempo') THEN
        UPDATE timbre.characteristics
        SET characteristics.min = MIN(characteristics.min, $11), characteristics.max = MAX(characteristics.max, $11)
        WHERE characteristics.name = 'tempo';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('tempo', $11, $11);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_top_ratings(
    user_id INTEGER,
    rating_limit INTEGER
)
RETURNS TABLE (song_id TEXT, rating DECIMAL)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
	SELECT song_rating.song_id, song_rating.rating FROM timbre.song_rating
    WHERE timbre.song_rating.user_id = $1
    ORDER BY rating DESC, rating_time DESC -- Take the top ratings, and if there are ties, take the most recent ratings
    LIMIT rating_limit;
END;
$$;
    
CREATE OR REPLACE PROCEDURE timbre.make_rating(
    user_id INTEGER,
    song_id TEXT,
    rating DECIMAL
)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM timbre.song_rating WHERE song_rating.user_id = $1 AND song_rating.song_id = $2) THEN
        UPDATE timbre.song_rating
        SET song_rating.rating = $3
        WHERE song_rating.user_id = $1 AND song_rating.song_id = $2;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM timbre.song WHERE song.song_id = $2) THEN
            INSERT INTO timbre.song(song_id) VALUES ($2);
        END IF;

        INSERT INTO timbre.song_rating(user_id, song_id, rating) VALUES ($1, $2, $3);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_song_profile(
    user_id INTEGER,
    type_id INTEGER,
    num_profiles INTEGER DEFAULT 0
) 
RETURNS TABLE (acousticness DECIMAL, valence DECIMAL, danceability DECIMAL, energy DECIMAL, instrumentalness DECIMAL, liveness DECIMAL, loudness DECIMAL, speechiness DECIMAL, tempo DECIMAL, profile_time TIMESTAMP)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF num_profiles = 0 THEN
        RETURN QUERY
        SELECT song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = $2
        ORDER BY profile_time DESC;
    ELSE
        RETURN QUERY
        SELECT song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = $2
        ORDER BY profile_time DESC
        LIMIT num_profiles;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_all_song_profiles(
    user_id INTEGER,
    num_profiles INTEGER DEFAULT 0
)
RETURNS TABLE (type_id INTEGER, acousticness DECIMAL, valence DECIMAL, danceability DECIMAL, energy DECIMAL, instrumentalness DECIMAL, liveness DECIMAL, loudness DECIMAL, speechiness DECIMAL, tempo DECIMAL, profile_time TIMESTAMP)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF num_profiles = 0 THEN
        RETURN QUERY
        SELECT song_profile.type_id, song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1
        ORDER BY type_id ASc, profile_time DESC;
    ELSE
        RETURN QUERY
        (SELECT song_profile.type_id, song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = 1
        ORDER BY profile_time DESC
        LIMIT num_profiles)
        UNION
        (SELECT song_profile.type_id, song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = 2
        ORDER BY profile_time DESC
        LIMIT num_profiles)
        UNION
        (SELECT song_profile.type_id, song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = 3
        ORDER BY profile_time DESC
        LIMIT num_profiles)
        UNION
        (SELECT song_profile.type_id, song_profile.acousticness, song_profile.valence, song_profile.danceability, song_profile.energy, song_profile.instrumentalness, song_profile.liveness, song_profile.loudness, song_profile.speechiness, song_profile.tempo, song_profile.profile_time FROM timbre.song_profile
        WHERE timbre.song_profile.user_id = $1 AND timbre.song_profile.type_id = 4
        ORDER BY profile_time DESC
        LIMIT num_profiles)
        ORDER BY type_id ASC, profile_time DESC;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_profile_characteristics()
RETURNS TABLE (name TEXT, min DECIMAL, max DECIMAL)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
    SELECT characteristics.name, characteristics.min, characteristics.max FROM timbre.characteristics;
END;
$$;

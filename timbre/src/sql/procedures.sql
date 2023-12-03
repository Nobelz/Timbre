CREATE OR REPLACE FUNCTION timbre.get_random_users(
    current_user_spotify_id TEXT
)
RETURNS SETOF TEXT
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
	SELECT spotify_id 
	FROM timbre.timbre_user
    WHERE spotify_id != current_user_spotify_id
	ORDER BY RANDOM()
	LIMIT 5; /* change this value to set the number of randomly sampled users to return */ 
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_user_info_from_spotify_id(
    spotify_id_to_search TEXT
)
RETURNS TABLE (display_name TEXT, user_email TEXT, pic_link TEXT, bio TEXT, last_refresh TIMESTAMP)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
	SELECT spotify_display_name, email, profile_pic, user_bio, spotify_last_refresh
	FROM timbre.timbre_user
    WHERE spotify_id = spotify_id_to_search;
END;
$$;

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
    SELECT user_id FROM timbre.timbre_user WHERE LOWER(email) = LOWER(email_to_search);
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
    INSERT INTO timbre.timbre_user (spotify_id, email, spotify_display_name, profile_link, spotify_last_refresh, create_time) VALUES (spotify_id, email, spotify_display_name, profile_link, NOW(), NOW());
$$;

CREATE OR REPLACE PROCEDURE timbre.update_user(
    user_id INTEGER,
    email TEXT,
    spotify_display_name TEXT,
	profile_pic TEXT
)
LANGUAGE SQL
AS $$
    UPDATE timbre.timbre_user 
    SET email = $2, spotify_display_name = $3, profile_pic = $4, spotify_last_refresh = NOW()
    WHERE user_id = $1;
$$;

CREATE OR REPLACE PROCEDURE timbre.update_bio(
    user_id INTEGER,
    bio TEXT
)
LANGUAGE SQL
AS $$
    UPDATE timbre.timbre_user 
    SET user_bio = $2
    WHERE user_id = $1;
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

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'acousticness') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $3), c_max = GREATEST(c_max, $3)
        WHERE c_name = 'acousticness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('acousticness', $3, $3);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'valence') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $4), c_max = GREATEST(c_max, $4)
        WHERE c_name = 'valence';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('valence', $4, $4);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'danceability') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $5), c_max = GREATEST(c_max, $5)
        WHERE c_name = 'danceability';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('danceability', $5, $5);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'energy') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $6), c_max = GREATEST(c_max, $6)
        WHERE c_name = 'energy';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('energy', $6, $6);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'instrumentalness') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $7), c_max = GREATEST(c_max, $7)
        WHERE c_name = 'instrumentalness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('instrumentalness', $7, $7);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'liveness') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $8), c_max = GREATEST(c_max, $8)
        WHERE c_name = 'liveness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('liveness', $8, $8);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'loudness') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $9), c_max = GREATEST(c_max, $9)
        WHERE c_name = 'loudness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('loudness', $9, $9);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'speechiness') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $10), c_max = GREATEST(c_max, $10)
        WHERE c_name = 'speechiness';
    ELSE
        INSERT INTO timbre.characteristics VALUES ('speechiness', $10, $10);
    END IF;

    IF EXISTS (SELECT 1 FROM timbre.characteristics WHERE c_name = 'tempo') THEN
        UPDATE timbre.characteristics
        SET c_min = LEAST(c_min, $11), c_max = GREATEST(c_max, $11)
        WHERE c_name = 'tempo';
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
        SET rating = $3
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
RETURNS TABLE (c_name TEXT, c_min DECIMAL, c_max DECIMAL)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
    SELECT characteristics.c_name, characteristics.c_min, characteristics.c_max FROM timbre.characteristics;
END;
$$;

CREATE OR REPLACE PROCEDURE timbre.friend_request(
    request_id INTEGER,
    receive_id INTEGER
) 
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM timbre.friend_request WHERE from_id = $1 AND to_id = $2) THEN
        IF EXISTS (SELECT 1 FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1) THEN
            DELETE FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1;
            INSERT INTO timbre.friendship(user_id1, user_id2) VALUES ($1, $2); -- Friendship is mutual
        ELSE
            INSERT INTO timbre.friend_request VALUES ($1, $2);
        END IF;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_friends(
    user_id INTEGER
) 
RETURNS TABLE (friend_id INTEGER, spotify_id TEXT, display_name TEXT, profile_pic TEXT)
LANGUAGE PLPGSQL
AS $$
BEGIN 
    RETURN QUERY
    WITH friend_ids AS (
        SELECT user_id1 AS friend_id FROM timbre.friendship
        WHERE user_id2 = user_id
        UNION
        SELECT user_id2 AS friend_id FROM timbre.friendship
        WHERE user_id1 = user_id
    )
    SELECT friend_ids.friend_id, timbre_user.spotify_id, timbre_user.spotify_display_name, timbre_user.profile_pic FROM
    friend_ids
    JOIN timbre.timbre_user 
    ON friend_ids.friend_id = timbre_user.user_id;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_friend_requests(
    friend_id INTEGER
)
RETURNS TABLE (user_id INTEGER, spotify_id TEXT, display_name TEXT, profile_pic TEXT)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
    WITH friend_ids AS (
        SELECT from_id AS friend_id
        FROM timbre.friend_request
        WHERE to_id = $1
    )
    SELECT friend_ids.friend_id, timbre_user.spotify_id, timbre_user.spotify_display_name, timbre_user.profile_pic
    FROM friend_ids
    JOIN timbre.timbre_user
    ON friend_ids.friend_id = timbre_user.user_id;
END;
$$;

CREATE OR REPLACE PROCEDURE timbre.accept_friend_request(
    user_id INTEGER,
    friend_id INTEGER
)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1) THEN
        DELETE FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1;
        INSERT INTO timbre.friendship(user_id1, user_id2) VALUES ($1, $2);
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE timbre.reject_friend_request(
    user_id INTEGER,
    friend_id INTEGER
)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1) THEN
        DELETE FROM timbre.friend_request WHERE from_id = $2 AND to_id = $1;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE timbre.send_recommendation(
    user_id INTEGER,
    friend_id INTEGER,
    song_id TEXT
)
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM timbre.recommendation WHERE song_id = $3 AND sender_id = $1 AND friend_id = $2) THEN
        INSERT INTO timbre.recommendation(song_id, sender_id, friend_id) VALUES ($3, $1, $2);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.get_recommendations(
    user_id INTEGER
)
RETURNS TABLE (song_id TEXT, sender_id INTEGER, spotify_id TEXT, display_name TEXT, profile_pic TEXT)
LANGUAGE PLPGSQL
AS $$
BEGIN
    RETURN QUERY
    WITH sender_ids AS (
        SELECT song_id, sender_id FROM timbre.recommendation
        WHERE receiver_id = $1
    )
    SELECT sender_ids.song_id, sender_ids.sender_id, timbre_user.spotify_id, timbre_user.spotify_display_name, timbre_user.profile_pic 
    FROM sender_ids
    JOIN timbre.timbre_user
    ON sender_ids.sender_id = timbre_user.user_id;
END;
$$;

CREATE OR REPLACE FUNCTION timbre.check_friends(
    user_id INTEGER,
    friend_id INTEGER
) RETURNS BOOLEAN
LANGUAGE PLPGSQL
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM timbre.friendship WHERE user_id1 = $1 AND user_id2 = $2) THEN
        RETURN TRUE;
    ELSIF EXISTS (SELECT 1 FROM timbre.friendship WHERE user_id1 = $2 AND user_id2 = $1) THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;
CREATE PROCEDURE timbre.search_user_from_username(
    username_to_search TEXT
)
LANGUAGE SQL
AS $$
    SELECT user_id FROM timbre.timbre_user WHERE username = username_to_search;

CREATE PROCEDURE timbre.insert_song_profile(
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
    IF EXISTS (SELECT 1 FROM timbre.song_profile WHERE user_id = $1 AND type_id = $2) THEN
        UPDATE timbre.song_profile
        SET acousticness = $3,
            valence = $4,
            danceability = $5,
            energy = $6,
            instrumentalness = $7,
            liveness = $8,
            loudness = $9,
            speechiness = $10,
            tempo = $11
        WHERE user_id = $1 AND type_id = $2;
    ELSE
        INSERT INTO timbre.song_profile 
        VALUES (user_id, type_id, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    END IF;
END;
$$;
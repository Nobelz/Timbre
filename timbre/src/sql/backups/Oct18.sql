--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2023-10-18 22:22:09 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 24818)
-- Name: timbre; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA timbre;


ALTER SCHEMA timbre OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 24946)
-- Name: create_user(text); Type: PROCEDURE; Schema: timbre; Owner: postgres
--

CREATE PROCEDURE timbre.create_user(IN username text)
    LANGUAGE sql
    AS $$
    INSERT INTO timbre.timbre_user (username, create_time) VALUES (username, NOW());
$$;


ALTER PROCEDURE timbre.create_user(IN username text) OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 25124)
-- Name: get_all_song_profiles(integer, integer); Type: FUNCTION; Schema: timbre; Owner: postgres
--

CREATE FUNCTION timbre.get_all_song_profiles(user_id integer, num_profiles integer DEFAULT 0) RETURNS TABLE(type_id integer, acousticness numeric, valence numeric, danceability numeric, energy numeric, instrumentalness numeric, liveness numeric, loudness numeric, speechiness numeric, tempo numeric, profile_time timestamp without time zone)
    LANGUAGE plpgsql
    AS $_$
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
        ORDER BY type_id ASc, profile_time DESC;
    END IF;
END;
$_$;


ALTER FUNCTION timbre.get_all_song_profiles(user_id integer, num_profiles integer) OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 25123)
-- Name: get_song_profile(integer, integer, integer); Type: FUNCTION; Schema: timbre; Owner: postgres
--

CREATE FUNCTION timbre.get_song_profile(user_id integer, type_id integer, num_profiles integer DEFAULT 0) RETURNS TABLE(acousticness numeric, valence numeric, danceability numeric, energy numeric, instrumentalness numeric, liveness numeric, loudness numeric, speechiness numeric, tempo numeric, profile_time timestamp without time zone)
    LANGUAGE plpgsql
    AS $_$
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
$_$;


ALTER FUNCTION timbre.get_song_profile(user_id integer, type_id integer, num_profiles integer) OWNER TO postgres;

--
-- TOC entry 238 (class 1255 OID 25076)
-- Name: get_top_ratings(integer, integer); Type: FUNCTION; Schema: timbre; Owner: postgres
--

CREATE FUNCTION timbre.get_top_ratings(user_id integer, rating_limit integer) RETURNS TABLE(song_id text, rating numeric)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY
	SELECT song_rating.song_id, song_rating.rating FROM timbre.song_rating
    WHERE timbre.song_rating.user_id = $1
    ORDER BY rating DESC, rating_time DESC -- Take the top ratings, and if there are ties, take the most recent ratings
    LIMIT rating_limit;
END;
$_$;


ALTER FUNCTION timbre.get_top_ratings(user_id integer, rating_limit integer) OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 24941)
-- Name: insert_song_profile(integer, integer, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric); Type: PROCEDURE; Schema: timbre; Owner: postgres
--

CREATE PROCEDURE timbre.insert_song_profile(IN user_id integer, IN type_id integer, IN acousticness numeric, IN valence numeric, IN danceability numeric, IN energy numeric, IN instrumentalness numeric, IN liveness numeric, IN loudness numeric, IN speechiness numeric, IN tempo numeric)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    INSERT INTO timbre.song_profile 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
END;
$_$;


ALTER PROCEDURE timbre.insert_song_profile(IN user_id integer, IN type_id integer, IN acousticness numeric, IN valence numeric, IN danceability numeric, IN energy numeric, IN instrumentalness numeric, IN liveness numeric, IN loudness numeric, IN speechiness numeric, IN tempo numeric) OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 25075)
-- Name: make_rating(integer, text, numeric); Type: PROCEDURE; Schema: timbre; Owner: postgres
--

CREATE PROCEDURE timbre.make_rating(IN user_id integer, IN song_id text, IN rating numeric)
    LANGUAGE plpgsql
    AS $_$
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
$_$;


ALTER PROCEDURE timbre.make_rating(IN user_id integer, IN song_id text, IN rating numeric) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 24956)
-- Name: search_user_from_username(text); Type: FUNCTION; Schema: timbre; Owner: postgres
--

CREATE FUNCTION timbre.search_user_from_username(username_to_search text) RETURNS SETOF integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
	SELECT user_id FROM timbre.timbre_user WHERE username = username_to_search;
END;
$$;


ALTER FUNCTION timbre.search_user_from_username(username_to_search text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 24969)
-- Name: friend_request; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.friend_request (
    from_id integer NOT NULL,
    to_id integer NOT NULL
);


ALTER TABLE timbre.friend_request OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25028)
-- Name: recommendation; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.recommendation (
    song_id text NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    rec_message text,
    rec_time timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE timbre.recommendation OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25003)
-- Name: song; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.song (
    song_id text NOT NULL
);


ALTER TABLE timbre.song OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25095)
-- Name: song_profile; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.song_profile (
    user_id integer NOT NULL,
    type_id integer NOT NULL,
    acousticness numeric NOT NULL,
    valence numeric NOT NULL,
    danceability numeric NOT NULL,
    energy numeric NOT NULL,
    instrumentalness numeric NOT NULL,
    liveness numeric NOT NULL,
    loudness numeric NOT NULL,
    speechiness numeric NOT NULL,
    tempo numeric NOT NULL,
    profile_time timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT song_profile_acousticness_check CHECK (((acousticness >= (0)::numeric) AND (acousticness <= (1)::numeric))),
    CONSTRAINT song_profile_danceability_check CHECK (((danceability >= (0)::numeric) AND (danceability <= (1)::numeric))),
    CONSTRAINT song_profile_energy_check CHECK (((energy >= (0)::numeric) AND (energy <= (1)::numeric))),
    CONSTRAINT song_profile_instrumentalness_check CHECK (((instrumentalness >= (0)::numeric) AND (instrumentalness <= (1)::numeric))),
    CONSTRAINT song_profile_liveness_check CHECK (((liveness >= (0)::numeric) AND (liveness <= (1)::numeric))),
    CONSTRAINT song_profile_loudness_check CHECK (((loudness >= (0)::numeric) AND (loudness <= (1)::numeric))),
    CONSTRAINT song_profile_speechiness_check CHECK (((speechiness >= (0)::numeric) AND (speechiness <= (1)::numeric))),
    CONSTRAINT song_profile_tempo_check CHECK (((tempo >= (0)::numeric) AND (tempo <= (1)::numeric))),
    CONSTRAINT song_profile_type_id_check CHECK (((type_id >= 1) AND (type_id <= 5))),
    CONSTRAINT song_profile_valence_check CHECK (((valence >= (0)::numeric) AND (valence <= (1)::numeric)))
);


ALTER TABLE timbre.song_profile OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25010)
-- Name: song_rating; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.song_rating (
    user_id integer NOT NULL,
    song_id text NOT NULL,
    rating numeric NOT NULL,
    rating_time timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE timbre.song_rating OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24958)
-- Name: timbre_user; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.timbre_user (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text,
    last_name text,
    user_bio text,
    spotify_last_refresh timestamp without time zone,
    create_time timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE timbre.timbre_user OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24957)
-- Name: timbre_user_user_id_seq; Type: SEQUENCE; Schema: timbre; Owner: postgres
--

CREATE SEQUENCE timbre.timbre_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE timbre.timbre_user_user_id_seq OWNER TO postgres;

--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 215
-- Name: timbre_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: timbre; Owner: postgres
--

ALTER SEQUENCE timbre.timbre_user_user_id_seq OWNED BY timbre.timbre_user.user_id;


--
-- TOC entry 219 (class 1259 OID 24986)
-- Name: user_relationship; Type: TABLE; Schema: timbre; Owner: postgres
--

CREATE TABLE timbre.user_relationship (
    matching_id integer NOT NULL,
    user_id1 integer NOT NULL,
    user_id2 integer NOT NULL,
    compatibility_score double precision,
    is_friend boolean NOT NULL
);


ALTER TABLE timbre.user_relationship OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24985)
-- Name: user_relationship_matching_id_seq; Type: SEQUENCE; Schema: timbre; Owner: postgres
--

CREATE SEQUENCE timbre.user_relationship_matching_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE timbre.user_relationship_matching_id_seq OWNER TO postgres;

--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_relationship_matching_id_seq; Type: SEQUENCE OWNED BY; Schema: timbre; Owner: postgres
--

ALTER SEQUENCE timbre.user_relationship_matching_id_seq OWNED BY timbre.user_relationship.matching_id;


--
-- TOC entry 3475 (class 2604 OID 24961)
-- Name: timbre_user user_id; Type: DEFAULT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.timbre_user ALTER COLUMN user_id SET DEFAULT nextval('timbre.timbre_user_user_id_seq'::regclass);


--
-- TOC entry 3477 (class 2604 OID 24989)
-- Name: user_relationship matching_id; Type: DEFAULT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.user_relationship ALTER COLUMN matching_id SET DEFAULT nextval('timbre.user_relationship_matching_id_seq'::regclass);


--
-- TOC entry 3664 (class 0 OID 24969)
-- Dependencies: 217
-- Data for Name: friend_request; Type: TABLE DATA; Schema: timbre; Owner: postgres
--



--
-- TOC entry 3669 (class 0 OID 25028)
-- Dependencies: 222
-- Data for Name: recommendation; Type: TABLE DATA; Schema: timbre; Owner: postgres
--



--
-- TOC entry 3667 (class 0 OID 25003)
-- Dependencies: 220
-- Data for Name: song; Type: TABLE DATA; Schema: timbre; Owner: postgres
--

INSERT INTO timbre.song (song_id) VALUES ('31TWjH1Khmi330f2v1LnQW');


--
-- TOC entry 3670 (class 0 OID 25095)
-- Dependencies: 223
-- Data for Name: song_profile; Type: TABLE DATA; Schema: timbre; Owner: postgres
--

INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:15:09.853312');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:15:09.935265');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8131333333333334, 0.4467333333333333, 0.27305999999999997, 0.0000028653333333333333, 0.3860733333333334, 0.7323033333333333, 0.15686666666666665, 0.35706666666666664, 0.8073278921274744, '2023-10-17 01:15:09.935921');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:15:09.936428');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:15:25.970126');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:15:26.063811');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8131333333333334, 0.4467333333333333, 0.27305999999999997, 0.0000028653333333333333, 0.3860733333333334, 0.7323033333333333, 0.15686666666666665, 0.35706666666666664, 0.8073278921274744, '2023-10-17 01:15:26.06483');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:15:26.065572');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:15:57.02541');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:15:57.203214');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8131333333333334, 0.4467333333333333, 0.27305999999999997, 0.0000028653333333333333, 0.3860733333333334, 0.7323033333333333, 0.15686666666666665, 0.35706666666666664, 0.8073278921274744, '2023-10-17 01:15:57.206612');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:15:57.20725');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:16:20.169554');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:16:20.310199');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8131333333333334, 0.4467333333333333, 0.27305999999999997, 0.0000028653333333333333, 0.3860733333333334, 0.7323033333333333, 0.15686666666666665, 0.35706666666666664, 0.8073278921274744, '2023-10-17 01:16:20.310943');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:16:20.311543');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:16:39.381843');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:16:39.555096');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8131333333333334, 0.4467333333333333, 0.27305999999999997, 0.0000028653333333333333, 0.3860733333333334, 0.7323033333333333, 0.15686666666666665, 0.35706666666666664, 0.8073278921274744, '2023-10-17 01:16:39.555971');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:16:39.556772');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 01:17:35.464511');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 01:17:35.551663');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.8196666666666667, 0.44399999999999995, 0.2705933333333333, 0.0000028653333333333333, 0.3994733333333334, 0.7312666666666666, 0.15605333333333332, 0.3584, 0.81171793329087, '2023-10-17 01:17:35.552817');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 01:17:35.55343');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 1, 0.1453696711111111, 0.7191333333333334, 0.7786533333333332, 0.003191811111111111, 0.20606622222222223, 0.928868074074074, 0.14033066666666666, 0.6446488888888889, 0.8325328480122014, '2023-10-17 12:56:08.765895');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 2, 0.28494181818181824, 0.6930181818181818, 0.7090727272727271, 0.044990773636363626, 0.33957818181818183, 0.8781357575757577, 0.09434363636363637, 0.6869636363636363, 0.8348296231841972, '2023-10-17 12:56:10.315339');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 3, 0.1507953333333333, 0.6576666666666667, 0.7972, 0.0000036266666666666665, 0.13477333333333333, 0.9384522222222221, 0.11031999999999999, 0.5150666666666667, 0.8368885114638323, '2023-10-17 12:56:10.316212');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (3, 3, 0.37815, 0.5579999999999999, 0.421, 0.00001685, 0.3585, 0.8247583333333334, 0.03675, 0.45099999999999996, 0.8537800541155501, '2023-10-17 14:06:15.975283');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 1, 0.5228143466666667, 0.5113822222222222, 0.47612, 0.043263796622222225, 0.20239333333333334, 0.8521365185185183, 0.10334977777777778, 0.3103671111111111, 0.8355934161100265, '2023-10-17 14:09:35.968803');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 2, 0.9011818181818181, 0.4458181818181819, 0.2679090909090909, 0.02948037654545455, 0.10746363636363636, 0.7974051515151516, 0.05275818181818182, 0.37314727272727277, 0.8063758364232757, '2023-10-17 14:09:37.009238');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 3, 0.5097333333333334, 0.509, 0.47852666666666666, 0.024297106666666665, 0.15883999999999998, 0.8662544444444444, 0.07262666666666669, 0.3147999999999999, 0.832416097150844, '2023-10-17 14:09:37.010141');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 1, 0.5228143466666667, 0.5113822222222222, 0.47612, 0.043263796622222225, 0.20239333333333334, 0.8521365185185183, 0.10334977777777778, 0.3103671111111111, 0.8355934161100265, '2023-10-17 14:14:22.509216');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 2, 0.9011818181818181, 0.4458181818181819, 0.2679090909090909, 0.02948037654545455, 0.10746363636363636, 0.7974051515151516, 0.05275818181818182, 0.37314727272727277, 0.8063758364232757, '2023-10-17 14:14:23.469843');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (4, 3, 0.4973333333333333, 0.5082, 0.4669933333333333, 0.024308506666666667, 0.15837333333333334, 0.8623733333333333, 0.07028666666666669, 0.31633333333333324, 0.8321282789799155, '2023-10-17 14:14:23.470753');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.4946705422222222, 0.4574355555555556, 0.4198791111111111, 0.2900389311111111, 0.16783955555555555, 0.8015742222222222, 0.05170177777777778, 0.26927911111111114, 0.8449710732222424, '2023-10-17 14:14:44.421371');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.7196909090909092, 0.48896363636363643, 0.49134545454545453, 0.00000009490909090909091, 0.40414363636363637, 0.7996345454545456, 0.20715454545454545, 0.4449090909090909, 0.8268944348733425, '2023-10-17 14:14:45.452794');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.7562199999999998, 0.5033333333333334, 0.38186666666666663, 0.00027961599999999995, 0.4455666666666667, 0.7607522222222223, 0.19324000000000002, 0.4610666666666667, 0.828254324527378, '2023-10-17 14:14:45.454124');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.237, 0.7588558890703402, '2023-10-17 14:14:45.454791');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 1, 0.1453696711111111, 0.7191333333333334, 0.7786533333333332, 0.003191811111111111, 0.20606622222222223, 0.928868074074074, 0.14033066666666666, 0.6446488888888889, 0.8325328480122014, '2023-10-18 00:14:29.896944');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 2, 0.28494181818181824, 0.6930181818181818, 0.7090727272727271, 0.044990773636363626, 0.33957818181818183, 0.8781357575757577, 0.09434363636363637, 0.6869636363636363, 0.8348296231841972, '2023-10-18 00:14:31.25022');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 3, 0.08576466666666666, 0.6609333333333334, 0.8168000000000001, 0.0, 0.13738666666666666, 0.937968888888889, 0.11398666666666668, 0.5009333333333332, 0.831386007191658, '2023-10-18 00:14:31.257058');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 1, 0.14274593777777778, 0.7174533333333334, 0.7796133333333333, 0.003178344444444444, 0.2044302222222222, 0.9293722962962963, 0.13929866666666668, 0.6416488888888889, 0.8343558285629465, '2023-10-18 19:49:17.625172');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 2, 0.28494181818181824, 0.6930181818181818, 0.7090727272727271, 0.044990773636363626, 0.33957818181818183, 0.8781357575757577, 0.09434363636363637, 0.6869636363636363, 0.8348296231841972, '2023-10-18 19:49:18.87512');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (2, 3, 0.275688, 0.5603333333333332, 0.6224666666666667, 0.001070348, 0.13870666666666664, 0.8906299999999999, 0.06504666666666667, 0.3796, 0.8453870182114234, '2023-10-18 19:49:18.882236');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 1, 0.16050133333333333, 0.6841733333333332, 0.6532844444444444, 0.04374284328888889, 0.17463733333333334, 0.897661111111111, 0.1181253333333333, 0.5396817777777778, 0.8395912881421024, '2023-10-18 20:02:55.697433');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 2, 0.12002727272727273, 0.5698727272727273, 0.7154727272727274, 0.013778774545454545, 0.15521090909090907, 0.9052669696969696, 0.04626909090909091, 0.43695272727272727, 0.8351139310376523, '2023-10-18 20:02:56.570559');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 3, 0.08462866666666667, 0.8254, 0.6442, 0.0005267413333333333, 0.11940666666666665, 0.9010911111111111, 0.18453999999999998, 0.5243333333333333, 0.8481456371378873, '2023-10-18 20:02:56.5713');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 1, 0.16050133333333333, 0.6841733333333332, 0.6532844444444444, 0.04374284328888889, 0.17463733333333334, 0.897661111111111, 0.1181253333333333, 0.5396817777777778, 0.8395912881421024, '2023-10-18 20:36:33.00671');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 2, 0.12002727272727273, 0.5698727272727273, 0.7154727272727274, 0.013778774545454545, 0.15521090909090907, 0.9052669696969696, 0.04626909090909091, 0.43695272727272727, 0.8351139310376523, '2023-10-18 20:55:35.357021');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 3, 0.08462866666666667, 0.8254, 0.6442, 0.0005267413333333333, 0.11940666666666665, 0.9010911111111111, 0.18453999999999998, 0.5243333333333333, 0.8481456371378873, '2023-10-18 20:55:35.357894');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 1, 0.16050133333333333, 0.5396817777777778, 0.6841733333333332, 0.6532844444444444, 0.04374284328888889, 0.17463733333333334, 0.897661111111111, 0.1181253333333333, 0.8395912881421024, '2023-10-18 21:02:09.740655');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 2, 0.12002727272727273, 0.43695272727272727, 0.5698727272727273, 0.7154727272727274, 0.013778774545454545, 0.15521090909090907, 0.9052669696969696, 0.04626909090909091, 0.8351139310376523, '2023-10-18 21:02:10.714908');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (5, 3, 0.08462866666666667, 0.5243333333333333, 0.8254, 0.6442, 0.0005267413333333333, 0.11940666666666665, 0.9010911111111111, 0.18453999999999998, 0.8481456371378873, '2023-10-18 21:02:10.715538');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:06:05.120246');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:06:05.888675');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6541157333333332, 0.49026666666666663, 0.5074666666666666, 0.4357333333333333, 0.000291916, 0.4240466666666667, 0.8106366666666667, 0.11896666666666667, 0.8012987833792757, '2023-10-18 21:06:05.889771');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:06:05.89345');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (6, 1, 0.12632973333333333, 0.6354311111111111, 0.7107422222222222, 0.7666488888888888, 0.0000731376, 0.1989271111111111, 0.9286303703703702, 0.11478355555555557, 0.8355961086349213, '2023-10-18 21:08:08.759357');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (6, 2, 0.20485709090909088, 0.4903054545454545, 0.6001636363636363, 0.6609636363636364, 0.00027838472727272724, 0.14041999999999996, 0.8894845454545455, 0.07293636363636363, 0.8222546104473393, '2023-10-18 21:08:09.616461');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (6, 3, 0.3919375333333333, 0.44300000000000006, 0.552, 0.5471999999999999, 0.029940514666666664, 0.22067333333333328, 0.877001111111111, 0.05807333333333333, 0.8502477177150185, '2023-10-18 21:08:09.617216');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:08:56.983057');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:08:57.685984');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6541157333333332, 0.49026666666666663, 0.5074666666666666, 0.4357333333333333, 0.000291916, 0.4240466666666667, 0.8106366666666667, 0.11896666666666667, 0.8012987833792757, '2023-10-18 21:08:57.686832');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:08:57.688038');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:09:02.97695');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:09:03.645093');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6541157333333332, 0.49026666666666663, 0.5074666666666666, 0.4357333333333333, 0.000291916, 0.4240466666666667, 0.8106366666666667, 0.11896666666666667, 0.8012987833792757, '2023-10-18 21:09:03.645739');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:09:03.646354');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:12:30.567124');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:12:31.440668');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6677157333333332, 0.46979999999999994, 0.4964666666666666, 0.41819999999999996, 0.00029769599999999996, 0.4104466666666667, 0.8053422222222223, 0.11862666666666669, 0.7957551134877243, '2023-10-18 21:12:31.441591');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:12:31.442269');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:16:51.447335');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:16:52.123899');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6615357333333333, 0.49253333333333327, 0.5027999999999999, 0.4413333333333333, 0.00029769599999999996, 0.41498, 0.8076377777777778, 0.12062666666666667, 0.8002627887846353, '2023-10-18 21:16:52.124667');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:16:52.125334');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5537936355555555, 0.31442355555555557, 0.46359999999999996, 0.46316488888888885, 0.2085548558222222, 0.24561644444444447, 0.8035634074074074, 0.1131208888888889, 0.8409674461559962, '2023-10-18 21:20:05.939354');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:20:06.691082');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.67124, 0.5314, 0.5077333333333333, 0.4456666666666666, 0.00029769599999999996, 0.40275333333333335, 0.80829, 0.12534666666666666, 0.8035448598028444, '2023-10-18 21:20:06.692749');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:20:06.693917');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:28:14.301978');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:28:17.986806');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6801533333333333, 0.5184, 0.5128666666666667, 0.43993333333333323, 0.0002825626666666666, 0.39687333333333336, 0.8099277777777777, 0.11004666666666668, 0.8039700024755673, '2023-10-18 21:28:17.98755');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:28:17.988254');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:30:43.00002');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:30:43.95501');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6044490666666666, 0.5208666666666666, 0.5416, 0.4953333333333333, 0.0002825626666666666, 0.37094, 0.8311888888888889, 0.11014000000000002, 0.8108193462674539, '2023-10-18 21:30:43.956133');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:30:43.956698');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:31:34.902077');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:31:35.765692');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6044490666666666, 0.5208666666666666, 0.5416, 0.4953333333333333, 0.0002825626666666666, 0.37094, 0.8311888888888889, 0.11014000000000002, 0.8108193462674539, '2023-10-18 21:31:35.76671');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:31:35.76778');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:31:54.369743');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:31:55.695014');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6044490666666666, 0.5208666666666666, 0.5416, 0.4953333333333333, 0.0002825626666666666, 0.37094, 0.8311888888888889, 0.11014000000000002, 0.8108193462674539, '2023-10-18 21:31:55.69574');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:31:55.696346');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:32:12.244898');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:32:16.033262');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.6044490666666666, 0.5208666666666666, 0.5416, 0.4953333333333333, 0.0002825626666666666, 0.37094, 0.8311888888888889, 0.11014000000000002, 0.8108193462674539, '2023-10-18 21:32:16.034129');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:32:16.034891');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 1, 0.5367739200000001, 0.3231746666666666, 0.45732000000000006, 0.46201466666666663, 0.19230158346666668, 0.257708, 0.8058717777777779, 0.104148, 0.8400223142387295, '2023-10-18 21:36:40.614924');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 2, 0.40871454545454544, 0.2825890909090909, 0.5311454545454545, 0.49952727272727265, 0.00002125963636363636, 0.10280727272727272, 0.8933015151515151, 0.03105454545454546, 0.8259108152550815, '2023-10-18 21:36:41.542737');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 3, 0.5622490666666666, 0.5238, 0.5448666666666666, 0.5188666666666667, 0.0002825626666666666, 0.35353999999999997, 0.8412955555555556, 0.10972666666666668, 0.8074502134070217, '2023-10-18 21:36:41.543803');
INSERT INTO timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) VALUES (1, 4, 0.762, 0.237, 0.304, 0.266, 0.0, 0.112, 0.79545, 0.0378, 0.7588558890703402, '2023-10-18 21:36:41.544376');


--
-- TOC entry 3668 (class 0 OID 25010)
-- Dependencies: 221
-- Data for Name: song_rating; Type: TABLE DATA; Schema: timbre; Owner: postgres
--

INSERT INTO timbre.song_rating (user_id, song_id, rating, rating_time) VALUES (1, '31TWjH1Khmi330f2v1LnQW', 8, '2023-10-17 00:09:33.317882');


--
-- TOC entry 3663 (class 0 OID 24958)
-- Dependencies: 216
-- Data for Name: timbre_user; Type: TABLE DATA; Schema: timbre; Owner: postgres
--

INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (1, 'nobelzhou19@gmail.com', NULL, NULL, NULL, NULL, '2023-10-16 23:34:26.60028');
INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (2, 'jonathanlong19148@gmail.com', NULL, NULL, NULL, NULL, '2023-10-17 12:56:08.727714');
INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (3, 'ashidacollege@gmail.com', NULL, NULL, NULL, NULL, '2023-10-17 14:00:17.19552');
INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (4, 'guptanikhilesh2003@gmail.com', NULL, NULL, NULL, NULL, '2023-10-17 14:08:38.674127');
INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (5, 'gjainschigg@gmail.com', NULL, NULL, NULL, NULL, '2023-10-18 20:02:55.557418');
INSERT INTO timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) VALUES (6, 'wtl2255@gmail.com', NULL, NULL, NULL, NULL, '2023-10-18 21:08:08.715178');


--
-- TOC entry 3666 (class 0 OID 24986)
-- Dependencies: 219
-- Data for Name: user_relationship; Type: TABLE DATA; Schema: timbre; Owner: postgres
--



--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 215
-- Name: timbre_user_user_id_seq; Type: SEQUENCE SET; Schema: timbre; Owner: postgres
--

SELECT pg_catalog.setval('timbre.timbre_user_user_id_seq', 6, true);


--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 218
-- Name: user_relationship_matching_id_seq; Type: SEQUENCE SET; Schema: timbre; Owner: postgres
--

SELECT pg_catalog.setval('timbre.user_relationship_matching_id_seq', 1, false);


--
-- TOC entry 3496 (class 2606 OID 24973)
-- Name: friend_request friend_request_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT friend_request_pkey PRIMARY KEY (from_id, to_id);


--
-- TOC entry 3506 (class 2606 OID 25035)
-- Name: recommendation recommendation_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (song_id, sender_id, receiver_id);


--
-- TOC entry 3502 (class 2606 OID 25009)
-- Name: song song_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);


--
-- TOC entry 3508 (class 2606 OID 25112)
-- Name: song_profile song_profile_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song_profile
    ADD CONSTRAINT song_profile_pkey PRIMARY KEY (user_id, type_id, profile_time);


--
-- TOC entry 3504 (class 2606 OID 25017)
-- Name: song_rating song_rating_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT song_rating_pkey PRIMARY KEY (user_id, song_id);


--
-- TOC entry 3492 (class 2606 OID 24966)
-- Name: timbre_user timbre_user_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3494 (class 2606 OID 24968)
-- Name: timbre_user timbre_user_username_key; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_username_key UNIQUE (username);


--
-- TOC entry 3500 (class 2606 OID 24991)
-- Name: user_relationship user_relationship_pkey; Type: CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT user_relationship_pkey PRIMARY KEY (matching_id);


--
-- TOC entry 3497 (class 1259 OID 24984)
-- Name: unique_friend_request_pair; Type: INDEX; Schema: timbre; Owner: postgres
--

CREATE UNIQUE INDEX unique_friend_request_pair ON timbre.friend_request USING btree (LEAST(from_id, to_id), GREATEST(from_id, to_id));


--
-- TOC entry 3498 (class 1259 OID 25002)
-- Name: unique_relationship_pair; Type: INDEX; Schema: timbre; Owner: postgres
--

CREATE UNIQUE INDEX unique_relationship_pair ON timbre.user_relationship USING btree (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));


--
-- TOC entry 3509 (class 2606 OID 24974)
-- Name: friend_request fk_from_friendreq; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_from_friendreq FOREIGN KEY (from_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3511 (class 2606 OID 24992)
-- Name: user_relationship fk_matching_user1; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user1 FOREIGN KEY (user_id1) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3512 (class 2606 OID 24997)
-- Name: user_relationship fk_matching_user2; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user2 FOREIGN KEY (user_id2) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3513 (class 2606 OID 25023)
-- Name: song_rating fk_rating_song; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;


--
-- TOC entry 3514 (class 2606 OID 25018)
-- Name: song_rating fk_rating_user; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3515 (class 2606 OID 25046)
-- Name: recommendation fk_recommendation_receiver; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_receiver FOREIGN KEY (receiver_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3516 (class 2606 OID 25041)
-- Name: recommendation fk_recommendation_sender; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_sender FOREIGN KEY (sender_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3517 (class 2606 OID 25036)
-- Name: recommendation fk_recommendation_song; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;


--
-- TOC entry 3510 (class 2606 OID 24979)
-- Name: friend_request fk_to_friendreq; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_to_friendreq FOREIGN KEY (to_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 3518 (class 2606 OID 25113)
-- Name: song_profile fk_user_song_profile; Type: FK CONSTRAINT; Schema: timbre; Owner: postgres
--

ALTER TABLE ONLY timbre.song_profile
    ADD CONSTRAINT fk_user_song_profile FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;


-- Completed on 2023-10-18 22:22:10 EDT

--
-- PostgreSQL database dump complete
--


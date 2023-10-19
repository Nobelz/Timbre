PGDMP      
            	    {           timbre    16.0    16.0 6    Y           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Z           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            [           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            \           1262    16398    timbre    DATABASE     h   CREATE DATABASE timbre WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE timbre;
                postgres    false                        2615    24818    timbre    SCHEMA        CREATE SCHEMA timbre;
    DROP SCHEMA timbre;
                postgres    false            �            1255    24946    create_user(text) 	   PROCEDURE     �   CREATE PROCEDURE timbre.create_user(IN username text)
    LANGUAGE sql
    AS $$
    INSERT INTO timbre.timbre_user (username, create_time) VALUES (username, NOW());
$$;
 5   DROP PROCEDURE timbre.create_user(IN username text);
       timbre          postgres    false    5            �            1255    25124 '   get_all_song_profiles(integer, integer)    FUNCTION     �
  CREATE FUNCTION timbre.get_all_song_profiles(user_id integer, num_profiles integer DEFAULT 0) RETURNS TABLE(type_id integer, acousticness numeric, valence numeric, danceability numeric, energy numeric, instrumentalness numeric, liveness numeric, loudness numeric, speechiness numeric, tempo numeric, profile_time timestamp without time zone)
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
 S   DROP FUNCTION timbre.get_all_song_profiles(user_id integer, num_profiles integer);
       timbre          postgres    false    5            �            1255    25123 +   get_song_profile(integer, integer, integer)    FUNCTION     $  CREATE FUNCTION timbre.get_song_profile(user_id integer, type_id integer, num_profiles integer DEFAULT 0) RETURNS TABLE(acousticness numeric, valence numeric, danceability numeric, energy numeric, instrumentalness numeric, liveness numeric, loudness numeric, speechiness numeric, tempo numeric, profile_time timestamp without time zone)
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
 _   DROP FUNCTION timbre.get_song_profile(user_id integer, type_id integer, num_profiles integer);
       timbre          postgres    false    5            �            1255    25076 !   get_top_ratings(integer, integer)    FUNCTION     �  CREATE FUNCTION timbre.get_top_ratings(user_id integer, rating_limit integer) RETURNS TABLE(song_id text, rating numeric)
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
 M   DROP FUNCTION timbre.get_top_ratings(user_id integer, rating_limit integer);
       timbre          postgres    false    5            �            1255    24941 v   insert_song_profile(integer, integer, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric) 	   PROCEDURE     �  CREATE PROCEDURE timbre.insert_song_profile(IN user_id integer, IN type_id integer, IN acousticness numeric, IN valence numeric, IN danceability numeric, IN energy numeric, IN instrumentalness numeric, IN liveness numeric, IN loudness numeric, IN speechiness numeric, IN tempo numeric)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    INSERT INTO timbre.song_profile 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
END;
$_$;
   DROP PROCEDURE timbre.insert_song_profile(IN user_id integer, IN type_id integer, IN acousticness numeric, IN valence numeric, IN danceability numeric, IN energy numeric, IN instrumentalness numeric, IN liveness numeric, IN loudness numeric, IN speechiness numeric, IN tempo numeric);
       timbre          postgres    false    5            �            1255    25075 #   make_rating(integer, text, numeric) 	   PROCEDURE     �  CREATE PROCEDURE timbre.make_rating(IN user_id integer, IN song_id text, IN rating numeric)
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
 [   DROP PROCEDURE timbre.make_rating(IN user_id integer, IN song_id text, IN rating numeric);
       timbre          postgres    false    5            �            1255    24956    search_user_from_username(text)    FUNCTION     �   CREATE FUNCTION timbre.search_user_from_username(username_to_search text) RETURNS SETOF integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
	SELECT user_id FROM timbre.timbre_user WHERE username = username_to_search;
END;
$$;
 I   DROP FUNCTION timbre.search_user_from_username(username_to_search text);
       timbre          postgres    false    5            �            1259    24969    friend_request    TABLE     a   CREATE TABLE timbre.friend_request (
    from_id integer NOT NULL,
    to_id integer NOT NULL
);
 "   DROP TABLE timbre.friend_request;
       timbre         heap    postgres    false    5            �            1259    25028    recommendation    TABLE     �   CREATE TABLE timbre.recommendation (
    song_id text NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    rec_message text,
    rec_time timestamp without time zone DEFAULT now() NOT NULL
);
 "   DROP TABLE timbre.recommendation;
       timbre         heap    postgres    false    5            �            1259    25003    song    TABLE     8   CREATE TABLE timbre.song (
    song_id text NOT NULL
);
    DROP TABLE timbre.song;
       timbre         heap    postgres    false    5            �            1259    25095    song_profile    TABLE     8  CREATE TABLE timbre.song_profile (
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
     DROP TABLE timbre.song_profile;
       timbre         heap    postgres    false    5            �            1259    25010    song_rating    TABLE     �   CREATE TABLE timbre.song_rating (
    user_id integer NOT NULL,
    song_id text NOT NULL,
    rating numeric NOT NULL,
    rating_time timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE timbre.song_rating;
       timbre         heap    postgres    false    5            �            1259    24958    timbre_user    TABLE       CREATE TABLE timbre.timbre_user (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text,
    last_name text,
    user_bio text,
    spotify_last_refresh timestamp without time zone,
    create_time timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE timbre.timbre_user;
       timbre         heap    postgres    false    5            �            1259    24957    timbre_user_user_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.timbre_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE timbre.timbre_user_user_id_seq;
       timbre          postgres    false    5    216            ]           0    0    timbre_user_user_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE timbre.timbre_user_user_id_seq OWNED BY timbre.timbre_user.user_id;
          timbre          postgres    false    215            �            1259    24986    user_relationship    TABLE     �   CREATE TABLE timbre.user_relationship (
    matching_id integer NOT NULL,
    user_id1 integer NOT NULL,
    user_id2 integer NOT NULL,
    compatibility_score double precision,
    is_friend boolean NOT NULL
);
 %   DROP TABLE timbre.user_relationship;
       timbre         heap    postgres    false    5            �            1259    24985 !   user_relationship_matching_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.user_relationship_matching_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE timbre.user_relationship_matching_id_seq;
       timbre          postgres    false    219    5            ^           0    0 !   user_relationship_matching_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE timbre.user_relationship_matching_id_seq OWNED BY timbre.user_relationship.matching_id;
          timbre          postgres    false    218            �           2604    24961    timbre_user user_id    DEFAULT     z   ALTER TABLE ONLY timbre.timbre_user ALTER COLUMN user_id SET DEFAULT nextval('timbre.timbre_user_user_id_seq'::regclass);
 B   ALTER TABLE timbre.timbre_user ALTER COLUMN user_id DROP DEFAULT;
       timbre          postgres    false    216    215    216            �           2604    24989    user_relationship matching_id    DEFAULT     �   ALTER TABLE ONLY timbre.user_relationship ALTER COLUMN matching_id SET DEFAULT nextval('timbre.user_relationship_matching_id_seq'::regclass);
 L   ALTER TABLE timbre.user_relationship ALTER COLUMN matching_id DROP DEFAULT;
       timbre          postgres    false    219    218    219            P          0    24969    friend_request 
   TABLE DATA           8   COPY timbre.friend_request (from_id, to_id) FROM stdin;
    timbre          postgres    false    217   �`       U          0    25028    recommendation 
   TABLE DATA           `   COPY timbre.recommendation (song_id, sender_id, receiver_id, rec_message, rec_time) FROM stdin;
    timbre          postgres    false    222   �`       S          0    25003    song 
   TABLE DATA           '   COPY timbre.song (song_id) FROM stdin;
    timbre          postgres    false    220   �`       V          0    25095    song_profile 
   TABLE DATA           �   COPY timbre.song_profile (user_id, type_id, acousticness, valence, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, profile_time) FROM stdin;
    timbre          postgres    false    223   a       T          0    25010    song_rating 
   TABLE DATA           L   COPY timbre.song_rating (user_id, song_id, rating, rating_time) FROM stdin;
    timbre          postgres    false    221   �k       O          0    24958    timbre_user 
   TABLE DATA           |   COPY timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, create_time) FROM stdin;
    timbre          postgres    false    216   �k       R          0    24986    user_relationship 
   TABLE DATA           l   COPY timbre.user_relationship (matching_id, user_id1, user_id2, compatibility_score, is_friend) FROM stdin;
    timbre          postgres    false    219   �l       _           0    0    timbre_user_user_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('timbre.timbre_user_user_id_seq', 6, true);
          timbre          postgres    false    215            `           0    0 !   user_relationship_matching_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('timbre.user_relationship_matching_id_seq', 1, false);
          timbre          postgres    false    218            �           2606    24973 "   friend_request friend_request_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT friend_request_pkey PRIMARY KEY (from_id, to_id);
 L   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT friend_request_pkey;
       timbre            postgres    false    217    217            �           2606    25035 "   recommendation recommendation_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (song_id, sender_id, receiver_id);
 L   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT recommendation_pkey;
       timbre            postgres    false    222    222    222            �           2606    25009    song song_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY timbre.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);
 8   ALTER TABLE ONLY timbre.song DROP CONSTRAINT song_pkey;
       timbre            postgres    false    220            �           2606    25112    song_profile song_profile_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY timbre.song_profile
    ADD CONSTRAINT song_profile_pkey PRIMARY KEY (user_id, type_id, profile_time);
 H   ALTER TABLE ONLY timbre.song_profile DROP CONSTRAINT song_profile_pkey;
       timbre            postgres    false    223    223    223            �           2606    25017    song_rating song_rating_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT song_rating_pkey PRIMARY KEY (user_id, song_id);
 F   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT song_rating_pkey;
       timbre            postgres    false    221    221            �           2606    24966    timbre_user timbre_user_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_pkey PRIMARY KEY (user_id);
 F   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_pkey;
       timbre            postgres    false    216            �           2606    24968 $   timbre_user timbre_user_username_key 
   CONSTRAINT     c   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_username_key UNIQUE (username);
 N   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_username_key;
       timbre            postgres    false    216            �           2606    24991 (   user_relationship user_relationship_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT user_relationship_pkey PRIMARY KEY (matching_id);
 R   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT user_relationship_pkey;
       timbre            postgres    false    219            �           1259    24984    unique_friend_request_pair    INDEX     �   CREATE UNIQUE INDEX unique_friend_request_pair ON timbre.friend_request USING btree (LEAST(from_id, to_id), GREATEST(from_id, to_id));
 .   DROP INDEX timbre.unique_friend_request_pair;
       timbre            postgres    false    217    217    217            �           1259    25002    unique_relationship_pair    INDEX     �   CREATE UNIQUE INDEX unique_relationship_pair ON timbre.user_relationship USING btree (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));
 ,   DROP INDEX timbre.unique_relationship_pair;
       timbre            postgres    false    219    219    219            �           2606    24974     friend_request fk_from_friendreq    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_from_friendreq FOREIGN KEY (from_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT fk_from_friendreq;
       timbre          postgres    false    216    3492    217            �           2606    24992 #   user_relationship fk_matching_user1    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user1 FOREIGN KEY (user_id1) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT fk_matching_user1;
       timbre          postgres    false    3492    216    219            �           2606    24997 #   user_relationship fk_matching_user2    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user2 FOREIGN KEY (user_id2) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT fk_matching_user2;
       timbre          postgres    false    3492    219    216            �           2606    25023    song_rating fk_rating_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT fk_rating_song;
       timbre          postgres    false    221    220    3502            �           2606    25018    song_rating fk_rating_user    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT fk_rating_user;
       timbre          postgres    false    3492    221    216            �           2606    25046 )   recommendation fk_recommendation_receiver    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_receiver FOREIGN KEY (receiver_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_receiver;
       timbre          postgres    false    216    222    3492            �           2606    25041 '   recommendation fk_recommendation_sender    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_sender FOREIGN KEY (sender_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_sender;
       timbre          postgres    false    222    216    3492            �           2606    25036 %   recommendation fk_recommendation_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_song;
       timbre          postgres    false    220    222    3502            �           2606    24979    friend_request fk_to_friendreq    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_to_friendreq FOREIGN KEY (to_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT fk_to_friendreq;
       timbre          postgres    false    217    216    3492            �           2606    25113 !   song_profile fk_user_song_profile    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_profile
    ADD CONSTRAINT fk_user_song_profile FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY timbre.song_profile DROP CONSTRAINT fk_user_song_profile;
       timbre          postgres    false    216    3492    223            P      x������ � �      U      x������ � �      S   $   x�36	��0����466H3*3������� ve      V   �
  x�ݛ[��(��O�b60)t��e����%�H�5/���ɩ>��O7���)umV��qŭj*�~��E���~�{)�]�[Ԭ�?ެ���9��R�
����Zs�;�xUՍ�I������M�o��
]�^�_z!��?Ѳ�7/�O
ӻ7�TRf��O�+�r��/�3T��тXt�h��@L�:����\ŭ��h7��R(�ʭB�Y'!y\��6�n�SlR�?.��ĽU��ފ�Mb���OQm�MWH$��|/�*��Llj�ZO	@�쬅j�hj>f�D�:�1wEc�k���X-��������s���h�ۙ��v)M:�y�N�����j5>��.��ҙ��L\�I�Cu��ZF�a�]�狀]9�D�z�S(�B�g��&��Ǽ�� g�Z*���k��+����	����E�3d!v�zѦ�N���P�Rkr��g�,����`����\��רQ�kp]�W���S5DF��@A�72p'��G���1A�͛M8���! �y6��"x��
wi0��1iν7ذ�o�	OP�Ik�9`�v�ʅ�pW�s��c�km��1C�{�01&<�1�ΚKyܢ�*S��O��8ܴ�c�M�&U�'u��D@�A�g��'������Y�؉iv�3d��[�j��hc�K�����]�և�
�N�U�`�K�z�:�,|�)������b(�|k_��8�>���� �B D�t�\�z�}8c$�l��I�c����hR�;��N�A$�8\���VTj�;��7���7Ҽ+��J}|S�@�xq����aqi8��E�A�[�E�[�ԗ!�f���j��x:�=ia�I	g��d�9��W��s���ls��u����`������]�4��h�C��&hնɬ9Z5L��`�ZD�sx�ٻ�D#�@����]��F<����	��
�ה�! �T��I��1�L���
i9�G�>��(�e�Б��UJ����d������E����3)��,`��z-��_^;aTý��$�<�B�b���e�n�9u�r4QC�.�	�4�j�1*(u�逸�X�.��Ty\�jz����8ǐ#I|-��'�͹����f���4P��X ����M���|��p��t�&���"W�أ%���fZ�,�#$��԰��αS�!�@	����7�;Vl�x7�-TZZױ[����\�%0�#e��h�cB�f(��Wa"�W�a�p��u�������D�����C���+ݸB����Ɛ�;7V�(�I���zP���dk�ղ7�e���&��E_�i���:PB�^6HD�m��+��R�)O�G�� hm�c�x�Z�U����#�;r$�L�Y�\ʯ
N�!d�AG�y|�adIۭ��ӭ��l�l���Z��#hZf������� ��H�_硌5�A$���Z�.O���W�<�E��*:b�p�G���2�D�3G5Q�pBA�VCT���LAj�u�
o�M��DI��`J�� T�QE�3�7u7��_�z�����_��0��df��_�z�����_�Jy(Ɓb����+��_�z��"<�&�k�?U�(�4Ec.��}���g,g�4�(�9*����ר���%_'k�Erv]�.M�� !�8�M-Zy�|��a��Z�U�{e�z9�Ye�9�����S��]��z,s�۠g�?�P�S�T����R"H��v
����&SH/���X�9J�H�W�C��:~�brz%��bR�[����(�`�]@κ,��m͍��?��K̹G��ӆk�&</���	���fb�bZ�Ȟ#�|@���Km{��K+(6�`��7����fr1:Vgz2ƞ[�_�A���ӱ;�9h[��j���5?��m^U9��1��Wu��fɘh�.R�.{k��䠱!��K�z#4��T��5�|�tB!=���\=V�&;\�jN�g�I���2���w�
,-Vx�?��!��������w�c'q�=P�^�����C�օ?��.��¼#o� �z�!� ���{1�	a����"���cL|�(gl����㐈�Q���-B��q�e�5��y{�8v7�%�a��&#�a�2�u���O{���jTv�|���b��[���L�ki���搈QMH�n~v�9T^�ze�[{k��sa?��WH�ߋ��v�X́J���8*�X<q|#�Oq|t�i8�o���zq�4�$�9$j�����<c����1�y����l�`A�\D�w-�F�^r��h��S�ĭT�vV��y���S�?y�Bx�W��V񚛑s��d���t�u��X��i�Sc�s�~a)E��&��S@n�$l����د�Goq*e��R�����I"�I��Ut;{�P��>C>Ptp������$��[��G�w{����G�b�U�J���������ג��Y��8��CM�s�OG���j�Ǚ1��i�S��ٟCv�݋8��oFG>�轋����W/(�O�(�n��� �M��n�*��`�u�V��<�qD�
ܨ~�cئ�C4{@Ӿ�Q��*��'IMC����71z[�?U?ݻ�6�E���B��~�uא�@\��> �q�r�T���sg�Mw�=�U�&�����@�m^�:��bZbe?�݃���!`�.T���s�����+e      T   C   x�3�46	��0����466H3*3����4202�54�54W00�2��26�364��0����� ��      O   �   x���An� E��)|����̪'�	����*�Q��>ɪ�X�����>��v/�F�G����2����?F6'���M46���������z=�L6�s��8���g�ɂQi+�;-��5�6"F�f���wO����֭0�9&	���%� *_R��Rj���01F|v�y�������^ϯ~�� :�d�      R      x������ � �     
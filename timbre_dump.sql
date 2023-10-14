PGDMP         &            	    {           Timbre    14.5    14.4 U    _           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            `           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            a           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            b           1262    16601    Timbre    DATABASE     l   CREATE DATABASE "Timbre" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE "Timbre";
                postgres    false            c           0    0    DATABASE "Timbre"    COMMENT     9   COMMENT ON DATABASE "Timbre" IS 'CSDS395 Final Project';
                   postgres    false    3426                        2615    16962    timbre    SCHEMA        CREATE SCHEMA timbre;
    DROP SCHEMA timbre;
                postgres    false            �            1255    17552 '   cancel_friend_request(integer, integer) 	   PROCEDURE     �   CREATE PROCEDURE timbre.cancel_friend_request(IN from_id integer, IN to_id integer)
    LANGUAGE sql
    AS $$
	DELETE FROM timbre.friend_request WHERE from_id = From_id and To_id = To_id;
$$;
 S   DROP PROCEDURE timbre.cancel_friend_request(IN from_id integer, IN to_id integer);
       timbre          postgres    false    4            �            1255    17549 L   create_user(text, text, text, text, text, text, timestamp without time zone) 	   PROCEDURE     �  CREATE PROCEDURE timbre.create_user(IN username text, IN first_name text, IN last_name text, IN email text, IN hash_password text, IN user_bio text DEFAULT NULL::text, IN spotify_last_refresh timestamp without time zone DEFAULT NULL::timestamp without time zone)
    LANGUAGE sql
    AS $$ 
INSERT INTO timbre.timbre_user (username, first_name, last_name, email, hash_password, user_bio, spotify_last_refresh)
VALUES (username, first_name, last_name, email, hash_password, user_bio, spotify_last_refresh);
$$;
 �   DROP PROCEDURE timbre.create_user(IN username text, IN first_name text, IN last_name text, IN email text, IN hash_password text, IN user_bio text, IN spotify_last_refresh timestamp without time zone);
       timbre          postgres    false    4            �            1255    17550    delete_user(text) 	   PROCEDURE     �   CREATE PROCEDURE timbre.delete_user(IN user_to_delete text)
    LANGUAGE sql
    AS $$
DELETE FROM timbre.timbre_user WHERE username = user_to_delete;
$$;
 ;   DROP PROCEDURE timbre.delete_user(IN user_to_delete text);
       timbre          postgres    false    4            �            1255    17555    get_incoming_request(integer) 	   PROCEDURE     �   CREATE PROCEDURE timbre.get_incoming_request(IN user_id integer)
    LANGUAGE sql
    AS $$
SELECT from_id
FROM timbre.friend_request
WHERE to_id = user_id;
$$;
 @   DROP PROCEDURE timbre.get_incoming_request(IN user_id integer);
       timbre          postgres    false    4            �            1255    17556    get_outgoing_request(integer) 	   PROCEDURE     �   CREATE PROCEDURE timbre.get_outgoing_request(IN user_id integer)
    LANGUAGE sql
    AS $$
SELECT to_id
FROM timbre.friend_request
WHERE from_id = user_id;
$$;
 @   DROP PROCEDURE timbre.get_outgoing_request(IN user_id integer);
       timbre          postgres    false    4            �            1255    17553 ,   recommend_song(text, integer, integer, text) 	   PROCEDURE       CREATE PROCEDURE timbre.recommend_song(IN song text, IN sender integer, IN receiver integer, IN message text DEFAULT NULL::text)
    LANGUAGE sql
    AS $$
INSERT INTO timbre.recommendation (song_id, sender_id, reciever_id, rec_message)
VALUES (song, sender, receiver, message);
$$;
 m   DROP PROCEDURE timbre.recommend_song(IN song text, IN sender integer, IN receiver integer, IN message text);
       timbre          postgres    false    4            �            1255    17560 '   remove_recommendation(integer, integer) 	   PROCEDURE     �   CREATE PROCEDURE timbre.remove_recommendation(IN user_sender integer, IN user_receiver integer)
    LANGUAGE sql
    AS $$
DELETE FROM timbre.recommendation
WHERE sender_id = user_sender and receiver_id = user_receiver;
$$;
 _   DROP PROCEDURE timbre.remove_recommendation(IN user_sender integer, IN user_receiver integer);
       timbre          postgres    false    4            �            1255    17551    search_user(text) 	   PROCEDURE     �   CREATE PROCEDURE timbre.search_user(IN user_to_search text)
    LANGUAGE sql
    AS $$
SELECT user_id
FROM timbre.timbre_user
WHERE username = user_to_search OR CONCAT(first_name, ' ', last_name) LIKE CONCAT('%', user_to_search, '%');
$$;
 ;   DROP PROCEDURE timbre.search_user(IN user_to_search text);
       timbre          postgres    false    4            �            1255    17554 %   send_friend_request(integer, integer) 	   PROCEDURE     �   CREATE PROCEDURE timbre.send_friend_request(IN from_id integer, IN to_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF (From_id != To_id) THEN
		INSERT INTO timbre.friend_request(from_id, to_id)
		VALUES (From_id, To_id);
	END IF;
END;
$$;
 Q   DROP PROCEDURE timbre.send_friend_request(IN from_id integer, IN to_id integer);
       timbre          postgres    false    4            �            1255    17558 0   update_friend_request(integer, integer, boolean) 	   PROCEDURE     �  CREATE PROCEDURE timbre.update_friend_request(IN user_id1_var integer, IN user_id2_var integer, IN status boolean)
    LANGUAGE sql
    AS $$
UPDATE timbre.user_relationship
SET is_friend = status
WHERE (user_id1 = user_id1_var AND user_id2 = user_id2_var) 
OR (user_id1 = user_id2_var AND user_id2 = user_id1_var);
DELETE FROM timbre.friend_request
WHERE (from_id = user_id1_var AND to_id = user_id2_var) 
OR (from_id = user_id2_var AND to_id = user_id1_var);
$$;
 r   DROP PROCEDURE timbre.update_friend_request(IN user_id1_var integer, IN user_id2_var integer, IN status boolean);
       timbre          postgres    false    4            �            1259    17441    artist    TABLE     ^   CREATE TABLE timbre.artist (
    artist_id integer NOT NULL,
    artist_name text NOT NULL
);
    DROP TABLE timbre.artist;
       timbre         heap    postgres    false    4            �            1259    17440    artist_artist_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.artist_artist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE timbre.artist_artist_id_seq;
       timbre          postgres    false    217    4            d           0    0    artist_artist_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE timbre.artist_artist_id_seq OWNED BY timbre.artist.artist_id;
          timbre          postgres    false    216            �            1259    17399    friend_request    TABLE     a   CREATE TABLE timbre.friend_request (
    from_id integer NOT NULL,
    to_id integer NOT NULL
);
 "   DROP TABLE timbre.friend_request;
       timbre         heap    postgres    false    4            �            1259    17467    genre    TABLE     [   CREATE TABLE timbre.genre (
    genre_id integer NOT NULL,
    genre_name text NOT NULL
);
    DROP TABLE timbre.genre;
       timbre         heap    postgres    false    4            �            1259    17466    genre_genre_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.genre_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE timbre.genre_genre_id_seq;
       timbre          postgres    false    4    220            e           0    0    genre_genre_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE timbre.genre_genre_id_seq OWNED BY timbre.genre.genre_id;
          timbre          postgres    false    219            �            1259    17531    listens    TABLE     s   CREATE TABLE timbre.listens (
    user_id integer NOT NULL,
    song_id text NOT NULL,
    num_listened integer
);
    DROP TABLE timbre.listens;
       timbre         heap    postgres    false    4            �            1259    17509    recommendation    TABLE     �   CREATE TABLE timbre.recommendation (
    song_id text NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    rec_message text
);
 "   DROP TABLE timbre.recommendation;
       timbre         heap    postgres    false    4            �            1259    17433    song    TABLE     r   CREATE TABLE timbre.song (
    song_id text NOT NULL,
    song_name text NOT NULL,
    song_year date NOT NULL
);
    DROP TABLE timbre.song;
       timbre         heap    postgres    false    4            �            1259    17449    song_artist    TABLE     _   CREATE TABLE timbre.song_artist (
    song_id text NOT NULL,
    artist_id integer NOT NULL
);
    DROP TABLE timbre.song_artist;
       timbre         heap    postgres    false    4            �            1259    17475 
   song_genre    TABLE     ]   CREATE TABLE timbre.song_genre (
    song_id text NOT NULL,
    genre_id integer NOT NULL
);
    DROP TABLE timbre.song_genre;
       timbre         heap    postgres    false    4            �            1259    17492    song_rating    TABLE     z   CREATE TABLE timbre.song_rating (
    user_id integer NOT NULL,
    song_id text NOT NULL,
    rating integer NOT NULL
);
    DROP TABLE timbre.song_rating;
       timbre         heap    postgres    false    4            �            1259    17385    timbre_user    TABLE       CREATE TABLE timbre.timbre_user (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    user_bio text,
    spotify_last_refresh timestamp without time zone,
    email text NOT NULL,
    hash_password text NOT NULL
);
    DROP TABLE timbre.timbre_user;
       timbre         heap    postgres    false    4            �            1259    17384    timbre_user_user_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.timbre_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE timbre.timbre_user_user_id_seq;
       timbre          postgres    false    211    4            f           0    0    timbre_user_user_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE timbre.timbre_user_user_id_seq OWNED BY timbre.timbre_user.user_id;
          timbre          postgres    false    210            �            1259    17416    user_relationship    TABLE     �   CREATE TABLE timbre.user_relationship (
    matching_id integer NOT NULL,
    user_id1 integer NOT NULL,
    user_id2 integer NOT NULL,
    compatibility_score double precision,
    is_friend boolean NOT NULL
);
 %   DROP TABLE timbre.user_relationship;
       timbre         heap    postgres    false    4            �            1259    17415 !   user_relationship_matching_id_seq    SEQUENCE     �   CREATE SEQUENCE timbre.user_relationship_matching_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE timbre.user_relationship_matching_id_seq;
       timbre          postgres    false    214    4            g           0    0 !   user_relationship_matching_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE timbre.user_relationship_matching_id_seq OWNED BY timbre.user_relationship.matching_id;
          timbre          postgres    false    213            �           2604    17444    artist artist_id    DEFAULT     t   ALTER TABLE ONLY timbre.artist ALTER COLUMN artist_id SET DEFAULT nextval('timbre.artist_artist_id_seq'::regclass);
 ?   ALTER TABLE timbre.artist ALTER COLUMN artist_id DROP DEFAULT;
       timbre          postgres    false    217    216    217            �           2604    17470    genre genre_id    DEFAULT     p   ALTER TABLE ONLY timbre.genre ALTER COLUMN genre_id SET DEFAULT nextval('timbre.genre_genre_id_seq'::regclass);
 =   ALTER TABLE timbre.genre ALTER COLUMN genre_id DROP DEFAULT;
       timbre          postgres    false    219    220    220            �           2604    17388    timbre_user user_id    DEFAULT     z   ALTER TABLE ONLY timbre.timbre_user ALTER COLUMN user_id SET DEFAULT nextval('timbre.timbre_user_user_id_seq'::regclass);
 B   ALTER TABLE timbre.timbre_user ALTER COLUMN user_id DROP DEFAULT;
       timbre          postgres    false    211    210    211            �           2604    17419    user_relationship matching_id    DEFAULT     �   ALTER TABLE ONLY timbre.user_relationship ALTER COLUMN matching_id SET DEFAULT nextval('timbre.user_relationship_matching_id_seq'::regclass);
 L   ALTER TABLE timbre.user_relationship ALTER COLUMN matching_id DROP DEFAULT;
       timbre          postgres    false    214    213    214            U          0    17441    artist 
   TABLE DATA           8   COPY timbre.artist (artist_id, artist_name) FROM stdin;
    timbre          postgres    false    217   o       P          0    17399    friend_request 
   TABLE DATA           8   COPY timbre.friend_request (from_id, to_id) FROM stdin;
    timbre          postgres    false    212   -o       X          0    17467    genre 
   TABLE DATA           5   COPY timbre.genre (genre_id, genre_name) FROM stdin;
    timbre          postgres    false    220   Jo       \          0    17531    listens 
   TABLE DATA           A   COPY timbre.listens (user_id, song_id, num_listened) FROM stdin;
    timbre          postgres    false    224   go       [          0    17509    recommendation 
   TABLE DATA           V   COPY timbre.recommendation (song_id, sender_id, receiver_id, rec_message) FROM stdin;
    timbre          postgres    false    223   �o       S          0    17433    song 
   TABLE DATA           =   COPY timbre.song (song_id, song_name, song_year) FROM stdin;
    timbre          postgres    false    215   �o       V          0    17449    song_artist 
   TABLE DATA           9   COPY timbre.song_artist (song_id, artist_id) FROM stdin;
    timbre          postgres    false    218   �o       Y          0    17475 
   song_genre 
   TABLE DATA           7   COPY timbre.song_genre (song_id, genre_id) FROM stdin;
    timbre          postgres    false    221   �o       Z          0    17492    song_rating 
   TABLE DATA           ?   COPY timbre.song_rating (user_id, song_id, rating) FROM stdin;
    timbre          postgres    false    222   �o       O          0    17385    timbre_user 
   TABLE DATA           �   COPY timbre.timbre_user (user_id, username, first_name, last_name, user_bio, spotify_last_refresh, email, hash_password) FROM stdin;
    timbre          postgres    false    211   p       R          0    17416    user_relationship 
   TABLE DATA           l   COPY timbre.user_relationship (matching_id, user_id1, user_id2, compatibility_score, is_friend) FROM stdin;
    timbre          postgres    false    214   2p       h           0    0    artist_artist_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('timbre.artist_artist_id_seq', 1, false);
          timbre          postgres    false    216            i           0    0    genre_genre_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('timbre.genre_genre_id_seq', 1, false);
          timbre          postgres    false    219            j           0    0    timbre_user_user_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('timbre.timbre_user_user_id_seq', 3, true);
          timbre          postgres    false    210            k           0    0 !   user_relationship_matching_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('timbre.user_relationship_matching_id_seq', 1, false);
          timbre          postgres    false    213            �           2606    17448    artist artist_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY timbre.artist
    ADD CONSTRAINT artist_pkey PRIMARY KEY (artist_id);
 <   ALTER TABLE ONLY timbre.artist DROP CONSTRAINT artist_pkey;
       timbre            postgres    false    217            �           2606    17403 "   friend_request friend_request_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT friend_request_pkey PRIMARY KEY (from_id, to_id);
 L   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT friend_request_pkey;
       timbre            postgres    false    212    212            �           2606    17474    genre genre_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY timbre.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);
 :   ALTER TABLE ONLY timbre.genre DROP CONSTRAINT genre_pkey;
       timbre            postgres    false    220            �           2606    17537    listens listens_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY timbre.listens
    ADD CONSTRAINT listens_pkey PRIMARY KEY (user_id, song_id);
 >   ALTER TABLE ONLY timbre.listens DROP CONSTRAINT listens_pkey;
       timbre            postgres    false    224    224            �           2606    17515 "   recommendation recommendation_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (song_id, sender_id, receiver_id);
 L   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT recommendation_pkey;
       timbre            postgres    false    223    223    223            �           2606    17455    song_artist song_artist_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY timbre.song_artist
    ADD CONSTRAINT song_artist_pkey PRIMARY KEY (song_id, artist_id);
 F   ALTER TABLE ONLY timbre.song_artist DROP CONSTRAINT song_artist_pkey;
       timbre            postgres    false    218    218            �           2606    17481    song_genre song_genre_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY timbre.song_genre
    ADD CONSTRAINT song_genre_pkey PRIMARY KEY (song_id, genre_id);
 D   ALTER TABLE ONLY timbre.song_genre DROP CONSTRAINT song_genre_pkey;
       timbre            postgres    false    221    221            �           2606    17439    song song_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY timbre.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);
 8   ALTER TABLE ONLY timbre.song DROP CONSTRAINT song_pkey;
       timbre            postgres    false    215            �           2606    17498    song_rating song_rating_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT song_rating_pkey PRIMARY KEY (user_id, song_id);
 F   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT song_rating_pkey;
       timbre            postgres    false    222    222            �           2606    17396 !   timbre_user timbre_user_email_key 
   CONSTRAINT     ]   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_email_key UNIQUE (email);
 K   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_email_key;
       timbre            postgres    false    211            �           2606    17398 )   timbre_user timbre_user_hash_password_key 
   CONSTRAINT     m   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_hash_password_key UNIQUE (hash_password);
 S   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_hash_password_key;
       timbre            postgres    false    211            �           2606    17392    timbre_user timbre_user_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_pkey PRIMARY KEY (user_id);
 F   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_pkey;
       timbre            postgres    false    211            �           2606    17394 $   timbre_user timbre_user_username_key 
   CONSTRAINT     c   ALTER TABLE ONLY timbre.timbre_user
    ADD CONSTRAINT timbre_user_username_key UNIQUE (username);
 N   ALTER TABLE ONLY timbre.timbre_user DROP CONSTRAINT timbre_user_username_key;
       timbre            postgres    false    211            �           2606    17421 (   user_relationship user_relationship_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT user_relationship_pkey PRIMARY KEY (matching_id);
 R   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT user_relationship_pkey;
       timbre            postgres    false    214            �           1259    17414    unique_friend_request_pair    INDEX     �   CREATE UNIQUE INDEX unique_friend_request_pair ON timbre.friend_request USING btree (LEAST(from_id, to_id), GREATEST(from_id, to_id));
 .   DROP INDEX timbre.unique_friend_request_pair;
       timbre            postgres    false    212    212    212            �           1259    17432    unique_relationship_pair    INDEX     �   CREATE UNIQUE INDEX unique_relationship_pair ON timbre.user_relationship USING btree (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));
 ,   DROP INDEX timbre.unique_relationship_pair;
       timbre            postgres    false    214    214    214            �           2606    17404     friend_request fk_from_friendreq    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_from_friendreq FOREIGN KEY (from_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT fk_from_friendreq;
       timbre          postgres    false    212    211    3227            �           2606    17543    listens fk_listening_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.listens
    ADD CONSTRAINT fk_listening_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY timbre.listens DROP CONSTRAINT fk_listening_song;
       timbre          postgres    false    215    3237    224            �           2606    17538    listens fk_listening_user    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.listens
    ADD CONSTRAINT fk_listening_user FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY timbre.listens DROP CONSTRAINT fk_listening_user;
       timbre          postgres    false    224    3227    211            �           2606    17422 #   user_relationship fk_matching_user1    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user1 FOREIGN KEY (user_id1) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT fk_matching_user1;
       timbre          postgres    false    3227    211    214            �           2606    17427 #   user_relationship fk_matching_user2    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.user_relationship
    ADD CONSTRAINT fk_matching_user2 FOREIGN KEY (user_id2) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY timbre.user_relationship DROP CONSTRAINT fk_matching_user2;
       timbre          postgres    false    214    3227    211            �           2606    17504    song_rating fk_rating_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT fk_rating_song;
       timbre          postgres    false    222    3237    215            �           2606    17499    song_rating fk_rating_user    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_rating
    ADD CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY timbre.song_rating DROP CONSTRAINT fk_rating_user;
       timbre          postgres    false    222    211    3227            �           2606    17526 )   recommendation fk_recommendation_reciever    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_reciever FOREIGN KEY (receiver_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_reciever;
       timbre          postgres    false    3227    211    223            �           2606    17521 '   recommendation fk_recommendation_sender    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_sender FOREIGN KEY (sender_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_sender;
       timbre          postgres    false    3227    223    211            �           2606    17516 %   recommendation fk_recommendation_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.recommendation
    ADD CONSTRAINT fk_recommendation_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY timbre.recommendation DROP CONSTRAINT fk_recommendation_song;
       timbre          postgres    false    3237    223    215            �           2606    17461    song_artist fk_singer_artist    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_artist
    ADD CONSTRAINT fk_singer_artist FOREIGN KEY (artist_id) REFERENCES timbre.artist(artist_id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY timbre.song_artist DROP CONSTRAINT fk_singer_artist;
       timbre          postgres    false    217    3239    218            �           2606    17456    song_artist fk_singer_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_artist
    ADD CONSTRAINT fk_singer_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY timbre.song_artist DROP CONSTRAINT fk_singer_song;
       timbre          postgres    false    3237    215    218            �           2606    17487    song_genre fk_style_genre    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_genre
    ADD CONSTRAINT fk_style_genre FOREIGN KEY (genre_id) REFERENCES timbre.genre(genre_id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY timbre.song_genre DROP CONSTRAINT fk_style_genre;
       timbre          postgres    false    221    220    3243            �           2606    17482    song_genre fk_style_song    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.song_genre
    ADD CONSTRAINT fk_style_song FOREIGN KEY (song_id) REFERENCES timbre.song(song_id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY timbre.song_genre DROP CONSTRAINT fk_style_song;
       timbre          postgres    false    3237    215    221            �           2606    17409    friend_request fk_to_friendreq    FK CONSTRAINT     �   ALTER TABLE ONLY timbre.friend_request
    ADD CONSTRAINT fk_to_friendreq FOREIGN KEY (to_id) REFERENCES timbre.timbre_user(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY timbre.friend_request DROP CONSTRAINT fk_to_friendreq;
       timbre          postgres    false    212    211    3227            U      x������ � �      P      x������ � �      X      x������ � �      \      x������ � �      [      x������ � �      S      x������ � �      V      x������ � �      Y      x������ � �      Z      x������ � �      O      x������ � �      R      x������ � �     
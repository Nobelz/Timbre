import { Pool } from "pg";

let connection;

if (!connection) {
    connection = new Pool({
        user: process.env.PGSQL_USER,
        password: process.env.PGSQL_PASSWORD,
        host: process.env.PGSQL_HOST,
        port: process.env.PGSQL_PORT,
        database: process.env.PGSQL_DATABASE,
    })
}

const getUserInfo = async (spotify_id_to_search) => {
    try {
        const query = `SELECT * FROM timbre.get_user_info_from_spotify_id('${spotify_id_to_search}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

// Function that sample random users for compatiability score calculation
const getRandomUsers = async (current_user_spotify_id) => {
    try {
        const query = `SELECT * FROM timbre.get_random_users('${current_user_spotify_id}')`;
        const result = await connection.query(query);
        const users = result.rows.map(row => row.get_random_users);

        return users;
    } catch (error) {
        console.log(error);
    }
};

// Function that is responsible for inserting user information into the database
const insertSongRating = async (user_id, song_id, rating) => {
    try {
        const query = `CALL timbre.make_rating (
            '${user_id}', 
            '${song_id}', 
            '${rating}'
        )`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

// TODO: remove this function, replaced by getTopRatings ACTUALLY DON'T REMOVE
const getSongRating = async () => {
    try {
        const query = `SELECT * FROM timbre.get_song_profile(1, 1)`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getUserIDFromSpotifyID = async(spotify_id) => {
    try {
        const query = `SELECT * FROM timbre.search_user_from_id('${spotify_id}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getUserIDFromEmail = async(email) => {
    try {
        const query = `SELECT * FROM timbre.search_user_from_email('${email}')`;
        const result = await connection.query(query);
        if (result.rowCount === 0) {
            return null;
        } else {
            return result;
        }
    } catch (error) {
        console.log(error);
    }
};

const createUser = async(spotify_id, email, spotify_display_name, profile_link) => {
    try {
        const query = `CALL timbre.create_user('${spotify_id}', '${email}', '${spotify_display_name}', '${profile_link}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async(user_id, email, spotify_display_name, profile_pic) => {
    try {
        if (profile_pic)
            profile_pic = `'${profile_pic}'`;
        else 
            profile_pic = null;

        const query = `CALL timbre.update_user(${user_id}, '${email}', '${spotify_display_name}', ${profile_pic})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const updateUserBio = async(user_id, bio) => {
    try {
        if (bio)
            bio = `'${bio}'`;
        else 
            bio = null;

        const query = `CALL timbre.update_bio(${user_id}, ${bio})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const insertSongProfile = async(user_id, type_id, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, valence, tempo) => {
    try {
        const query = `CALL timbre.insert_song_profile(
            '${user_id}', 
            '${type_id}', 
            '${acousticness}',
            '${valence}',
            '${danceability}',
            '${energy}',
            '${instrumentalness}',
            '${liveness}',
            '${loudness}',
            '${speechiness}',
            '${tempo}'
        )`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getTopRatings = async(user_id, limit) => {
    try {
        const query = `SELECT * FROM timbre.get_top_ratings(${user_id}, ${limit})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getSongProfile = async(user_id, type_id, limit) => {
    try {
        const query = `SELECT * FROM timbre.get_song_profile(${user_id}, ${type_id}, ${limit})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {   
        console.log(error);
    }
};

const getSongProfiles = async(user_id, type_id) => {
    try {
        const query = `SELECT * FROM timbre.get_all_song_profiles(${user_id}, ${type_id})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getProfileCharacteristics = async() => {
    try {
        const query = `SELECT * FROM timbre.get_profile_characteristics()`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const makeFriendRequest = async(user_id1, user_id2) => {
    try {
        if (user_id1 === user_id2) {
            return null; // Users cannot be a friend of themselves
        }

        const query = `CALL timbre.friend_request(${user_id1}, ${user_id2})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getFriends = async(user_id) => {
    try {
        const query = `SELECT * FROM timbre.get_friends(${user_id})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getFriendRequests = async(user_id) => {
    try {
        const query = `SELECT * FROM timbre.get_friend_requests(${user_id})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const acceptFriendRequest = async(user_id1, user_id2) => {
    try {
        const query = `CALL timbre.accept_friend_request(${user_id1}, ${user_id2})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const rejectFriendRequest = async(user_id1, user_id2) => {
    try {
        const query = `CALL timbre.reject_friend_request(${user_id1}, ${user_id2})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const makeRecommendation = async(user_id1, user_id2, song) => {
    try {
        await addSong(song.song_id, song.title, song.uri, song.albumImageUrl, song.artists, song.artist_ids);
        const query = `CALL timbre.send_recommendation(${user_id1}, ${user_id2}, '${song.song_id}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getRecommendations = async(user_id) => {
    try {
        const query = `SELECT * FROM timbre.get_recommendations(${user_id})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const checkFriends = async(user_id1, user_id2) => {
    try {
        const query = `SELECT * FROM timbre.check_friends(${user_id1}, ${user_id2})`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const addSong = async (song_id, title, uri, album_image, artists, artist_ids) => {
    try {
        const query = `SELECT * FROM timbre.add_song('${song_id}', '${title}', '${uri}', '${album_image}')`;
        let result = await connection.query(query);

        if (result.rows[0].add_song) {
            for (let i = 0; i < artists.length; i++) {
                const artist_name = artists[i];
                const artist_id = artist_ids[i];
                await addArtist(song_id, artist_id, artist_name);
            }
        }
        return result;
    } catch (error) {
        console.log(error);
    }
};

const addArtist = async(song_id, artist_id, artist_name) => {
    try {
        const query = `CALL timbre.add_song_artist('${song_id}', '${artist_id}', '${artist_name}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getSongInformation = async(user_id, song_id) => {
    try {
        const query = `SELECT * FROM timbre.get_song_info(${user_id}, '${song_id}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getSongArtistInformation = async(song_id) => {
    try {
        const query = `SELECT * FROM timbre.get_song_artists('${song_id}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
}

// Put all function names here to export
const db_functions = {
    getUserInfo,
    getRandomUsers,
    insertSongRating,
    getSongRating, // TODO REMOVE (MAYBE NOT ACTUALLY)
    getUserIDFromSpotifyID,
    getUserIDFromEmail,
    createUser,
    updateUser,
    updateUserBio,
    insertSongProfile,
    getTopRatings,
    getSongProfile,
    getSongProfiles,
    getProfileCharacteristics,
    makeFriendRequest,
    getFriends,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    makeRecommendation,
    getRecommendations,
    checkFriends,
    getSongInformation,
    getSongArtistInformation,
};

module.exports = db_functions;

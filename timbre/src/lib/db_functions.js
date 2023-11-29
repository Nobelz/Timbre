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

const getUserIDFromSpotifyID = async(username) => {
    try {
        const query = `SELECT * FROM timbre.search_user_from_id('${username}')`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};

const createUser = async(username) => {
    try {
        const query = 'CALL timbre.create_profile(${username})';
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

// Put all function names here to export
const db_functions = {
    insertSongRating,
    getSongRating, // TODO REMOVE
    getUserIDFromSpotifyID,
    createUser,
    insertSongProfile,
    getTopRatings,
    getSongProfile,
    getSongProfiles,
    getProfileCharacteristics,
};

module.exports = db_functions;

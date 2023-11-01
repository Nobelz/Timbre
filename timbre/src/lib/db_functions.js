import { Pool } from "pg";

// Connection to Postgres database
let connection;

// Requires environment variables set up in .env.local
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
        // connection.end();
        return result;
    } catch (error) {
        console.log(error);
    }
};

const getSongRating = async () => {
    try {
        const query = `SELECT * FROM timbre.get_song_profile(1, 1)`;
        const result = await connection.query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
};


// Put all function names here to export
const db_functions = {
    insertSongRating,
    getSongRating,
};

module.exports = db_functions;
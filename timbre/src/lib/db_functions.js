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
const insertUser = async (user_id, username) => {
    try {
        const query = `INSERT INTO timbre.timbre_user (username, first_name, last_name, user_bio, email, hash_password) VALUES ("${username}")` // fixing this later just testing if i can at least connect to db
        const result = await connection.query(
            query
        );
        connection.end();
        return result;
    } catch (error) {
        console.log(error);
    }
};

// Put all function names here to export
const db_functions = {
    insertUser,
};

module.exports = db_functions;
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createTables = async () => {
    const queries = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            userID VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            filepath VARCHAR(255) NOT NULL,
            last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            tag VARCHAR(255),
            mod_filepath VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS highlights (
            id SERIAL PRIMARY KEY,
            filepath VARCHAR(255) NOT NULL,
            highlights JSONB NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(queries);
        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await pool.end();
    }
};

const deleteAllTables = async () => {
    const queries = `
        DROP TABLE IF EXISTS highlights CASCADE;
        DROP TABLE IF EXISTS files CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
    `;

    try {
        await pool.query(queries);
        console.log('All tables deleted successfully.');
    } catch (err) {
        console.error('Error deleting tables:', err);
    } finally {
        await pool.end();
    }
};

const main = async () => {
    createTables();
    // deleteAllTables();
}

// main();

module.exports = pool;
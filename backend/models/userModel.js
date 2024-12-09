const pool = require('../db/psql');
const bcrypt = require('bcryptjs');

// Create a new user in the database
const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email, password',
        [username, email, hashedPassword]
    );
    return result.rows[0];  // Return user data (without password)
};

// Find user by email for authentication
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];  // Return user data
};

module.exports = {
    createUser,
    findUserByEmail,
};
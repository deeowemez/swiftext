const pool = require('../db/psql');
const bcrypt = require('bcryptjs');

// Create a new user in the database
const createUser = async (userID, username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (userID, username, email, password) VALUES ($1, $2, $3, $4) RETURNING userID, username, email, password',
        [userID, username, email, hashedPassword]
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
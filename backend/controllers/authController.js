const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/userModel');
const { updateHighlightColorProfiles, defaultProfile } = require('../db/dynamoConfig');
const crypto = require('crypto');

const generateUserID = () => {
    return crypto.randomBytes(8).toString('hex');
};

const insertDefaultProfile = async (userID) => {
    try {
        await updateHighlightColorProfiles(defaultProfile(userID), userID);
        console.log("Default profiles inserted successfully");
    } catch (error) {
        console.error("Error inserting default profiles:", error);
    }
};

// Register a new user
const register = async (req, res) => {
    const { userID, username, email, password } = req.body;
    // console.log('req.body: ', req.body);

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const generatedUserID = generateUserID();

        const newUser = await createUser(generatedUserID, username, email, password);

        await insertDefaultProfile(generatedUserID);

        res.status(201).json({ userID: newUser.userID, username: newUser.username, email: newUser.email, password: newUser.password });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
};

// Log in the user and generate a JWT
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT
        const token = jwt.sign(
            { userID: user.userid, username: user.username, email: user.email },
            process.env.JWT_SECRET, // This should be an environment variable
            { expiresIn: '1h' } // Token expiration time
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
};

// Middleware to protect routes that require authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user data to the request
        next();
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid token');
    }
};

module.exports = {
    register,
    login,
    authenticate,
};
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg'); 
require('dotenv').config();

const app = express();
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to the file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });



// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Insert file metadata into the database
        const result = await pool.query(
            'INSERT INTO uploads (filename, filepath) VALUES ($1, $2) RETURNING id',
            [req.file.filename, req.file.path]
        );
        res.status(200).send({
            fileName: req.file.filename,
            message: 'File uploaded successfully.',
            id: result.rows[0].id, // return the ID of the new record
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving file metadata to the database.');
    }
});

// Add a root route for testing
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
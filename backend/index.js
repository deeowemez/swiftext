const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();
const { getHighlightProfile, insertItems, updateHighlightColorProfiles } = require('./dynamoConfig');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api/uploads', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Insert file metadata into the database
        const modFilePath = 'backend/' + req.file.path;
        // console.log('req.file.paht: ', req.file.path);
        const result = await pool.query(
            'INSERT INTO files (filename, filepath, mod_filepath) VALUES ($1, $2, $3) RETURNING id',
            [req.file.originalname, req.file.path, modFilePath]
        );
        res.status(200).send({
            fileName: req.file.originalname,
            message: 'File uploaded successfully.',
            id: result.rows[0].id, // return the ID of the new record
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving file metadata to the database.');
    }
});

// Fetch a specific file by its path
app.get('/edit', async (req, res) => {
    const filePath = req.query.filePath;
    console.log('req.query: ', req.query);
    console.log('fileP: ', filePath);

    // Ensure the file path is valid and exists on the server
    const fullFilePath = path.join(__dirname, filePath);

    // Send the file or an error response
    res.sendFile(fullFilePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
});

// Endpoint to retrieve highlights for a specific user and file
app.get('/highlights', async (req, res) => {
    const filePath = req.query.filePath;

    try {
        const result = await pool.query(
            'SELECT highlights FROM highlights WHERE filepath = $1',
            [filePath]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No highlights found for this file and user.');
        }

        res.status(200).json({
            success: true,
            highlights: result.rows[0].highlights,
        });
    } catch (err) {
        console.error('Error fetching highlights:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch highlights' });
    }
});

// Endpoint to save or update highlights for a user and file
app.post('/highlights', async (req, res) => {
    const filePath = req.query.filePath;
    console.log('highlights filep: ', filePath);
    const { highlights } = req.body;

    if (!highlights) {
        return res.status(400).json({ error: 'Highlights data is required' });
    }

    try {
        // Check if highlights already exist for this user and file
        const checkResult = await pool.query(
            'SELECT * FROM highlights WHERE filepath = $1',
            [filePath]
        );

        if (checkResult.rows.length > 0) {
            // Update existing highlights
            await pool.query(
                'UPDATE highlights SET highlights = $1 WHERE filepath = $2',
                [JSON.stringify(highlights), filePath]
            );
        } else {
            // Insert new highlights
            await pool.query(
                'INSERT INTO highlights (filepath, highlights) VALUES ($1, $2)',
                [filePath, JSON.stringify(highlights)]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Highlights saved successfully.',
        });
    } catch (err) {
        console.error('Error saving highlights:', err);
        res.status(500).json({ success: false, error: 'Failed to save highlights' });
    }
});

// remove file metadata from db and delete file from system
app.delete('/files/:id', async (req, res) => {
    const fileId = req.params.id;
    console.log('fileid ', fileId);

    try {
        // Fetch file details from the database to get the file path
        const fileQuery = 'SELECT filepath FROM files WHERE id = $1';
        const result = await pool.query(fileQuery, [fileId]);

        if (result.rows.length === 0) {
            return res.status(404).send(`File with ID ${fileId} not found`);
        }

        const filePath = result.rows[0].filepath;

        // Delete file from the database
        const deleteQuery = 'DELETE FROM files WHERE id = $1';
        await pool.query(deleteQuery, [fileId]);

        // Delete the actual file from the filesystem
        const fullFilePath = path.join(__dirname, filePath);
        console.log('fullfilepath: ', fullFilePath);
        fs.unlink(fullFilePath, (err) => {
            if (err) {
                return res.status(500).send(`Error deleting file: ${err.message}`);
            }

            res.status(200).send(`File with ID ${fileId} deleted successfully`);
        });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file');
    }
});

app.get('/profile/:id', async (req, res) => {
    const profileID = req.params.id;
    console.log('profileID ', profileID);

    try {
        const response = await getHighlightProfile(profileID);
        // console.log('response index.js: ', response);
        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (err) {
        console.error('Error getting highlight profile:', err);
        res.status(500).json({
            success: false,
            error: 'Error getting highlight profile',
        });
    }
})

app.post("/profile/save", async (req, res) => {
    const items = req.body.items; // Expect an array of items in the request body
    console.log(items);

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items format' });
    }

    try {
        const response = await updateHighlightColorProfiles(items);
        console.log('resposnie: ', response);
        res.status(200).json({
            success: true,
            message: "Items inserted successfully",
            data: response, // Contains success details for each item
        });
    } catch (err) {
        console.error("Error inserting items:", err);
        res.status(500).json({
            success: false,
            error: "Failed to insert items",
        });
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
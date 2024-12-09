const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const pool = require('../db/psql'); // Importing database pool

// Logging middleware
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const modFilePath = 'backend/' + req.file.path;
        const result = await pool.query(
            'INSERT INTO files (filename, filepath, mod_filepath) VALUES ($1, $2, $3) RETURNING id',
            [req.file.originalname, req.file.path, modFilePath]
        );
        res.status(200).send({
            fileName: req.file.originalname,
            message: 'File uploaded successfully.',
            id: result.rows[0].id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving file metadata to the database.');
    }
};

const getAllFiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};

const deleteFile = async (req, res) => {
    const fileId = req.params.id;
    console.log('fileID: ', fileId);
    try {
        const fileQuery = 'SELECT filepath FROM files WHERE id = $1';
        const result = await pool.query(fileQuery, [fileId]);
        console.log('result: ', result);

        if (result.rows.length === 0) {
            return res.status(404).send(`File with ID ${fileId} not found`);
        }

        const filePath = result.rows[0].filepath;
        const deleteQuery = 'DELETE FROM files WHERE id = $1';
        await pool.query(deleteQuery, [fileId]);

        const parentPath = path.dirname(__dirname);
        const fullFilePath = path.join(parentPath, filePath);
        console.log('fullFilePath: ', fullFilePath);
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
};

const editFile = async (req, res) => {
    const filePath = req.query.filePath;

    // Ensure the file path is valid and exists on the server
    const parentPath = path.dirname(__dirname);
    const fullFilePath = path.join(parentPath, filePath);
    console.log('fileP: ', fullFilePath);

    // Send the file or an error response
    res.sendFile(fullFilePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
};

module.exports = { uploadFile, getAllFiles, deleteFile, editFile };
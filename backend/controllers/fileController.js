const { exec } = require('child_process');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const pool = require('../db/psql'); // Importing database pool

// Logging middleware
const uploadFile = async (req, res) => {
    const { userID } = req.query;
    // console.log('req body upload: ', req);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const modFilePath = 'backend/' + req.file.path;
        const result = await pool.query(
            'INSERT INTO files (userID, filename, filepath, mod_filepath) VALUES ($1, $2, $3, $4) RETURNING id',
            [userID, req.file.originalname, req.file.path, modFilePath]
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
    const { userID } = req.query;
    if (!userID) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const result = await pool.query('SELECT * FROM files WHERE userID = $1', [userID]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};

const deleteFile = async (req, res) => {
    const fileId = req.params.id;
    // console.log('fileID: ', fileId);
    try {
        const result = await pool.query('SELECT filepath FROM files WHERE id = $1', [fileId]);
        // console.log('result: ', result);

        if (result.rows.length === 0) {
            return res.status(404).send(`File with ID ${fileId} not found`);
        }

        const filePath = result.rows[0].filepath;
        await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

        // const parentPath = path.dirname(__dirname);
        // const fullFilePath = path.join(parentPath, filePath);
        // console.log('fullFilePath: ', fullFilePath);
        console.log('delete file filepath: ', filePath);
        fs.unlink(filePath, (err) => {
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
    const storagePath = process.env.STORAGE_PATH;
    const fullFilePath = path.join(parentPath, storagePath, "uploads", filePath); // dev
    // const fullFilePath = path.join(storagePath, "uploads", filePath); // prod
    console.log("parentpath: ", parentPath);
    console.log("storagePath: ", storagePath);
    console.log("fullFilePath: ", fullFilePath);

    // Send the file or an error response
    console.log('edit file filepath: ', fullFilePath);
    res.sendFile(fullFilePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
};

const convertToPdf = async (req, res) => {
    const { fileId } = req.query;

    if (!fileId) {
        return res.status(400).send('File ID is required');
    }

    try {
        // Retrieve file path from database
        const result = await pool.query('SELECT filepath, filename FROM files WHERE id = $1', [fileId]);

        if (result.rows.length === 0) {
            return res.status(404).send('File not found');
        }

        const filePathExt = result.rows[0].filepath;
        const filename = result.rows[0].filename;
        const storagePath = process.env.STORAGE_PATH; // prod

        const fileNumber = path.join(path.basename(filePathExt, '.docx')); //1733913722819 
        const parentPath = path.dirname(__dirname); // dev
        const absoluteInputPath = path.join(parentPath, filePathExt); // dev
        // const absoluteInputPath = filePathExt; // prod
        const pdfName = `${fileNumber}_${filename}.pdf`;
        const outputPath = path.join(parentPath, storagePath, 'wordToPdf', pdfName); // dev
        // const outputPath = path.join(storagePath, 'wordToPdf', pdfName); // prod
        // const outputPath = path.join('wordToPdf', pdfName);
        console.log('input filepath: ', absoluteInputPath);
        console.log('output filepath: ', outputPath);

        // Ensure the file exists
        if (!fs.existsSync(absoluteInputPath)) {
            return res.status(404).send('Input file not found');
        }

        const command = `libreoffice --headless --convert-to pdf "${absoluteInputPath}" --outdir "${path.dirname(outputPath)}" && mv "${path.join(path.dirname(outputPath), `${fileNumber}.pdf`)}" "${outputPath}"`;

        // console.log('command: ', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting file: ${error.message}`);
                return res.status(500).send('Error converting file');
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).send('Error during conversion');
            }

            // Set the Content-Disposition header for download
            res.setHeader('Content-Disposition', `attachment; filename="${pdfName}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            // Send the file
            res.sendFile(outputPath, async (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error sending the file');
                } else {
                    try {
                        // Delete the database record
                        await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

                        // Delete the Word file
                        fs.unlink(absoluteInputPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting Word file:', unlinkErr);
                            } else {
                                console.log('Word file deleted successfully:', absoluteInputPath);
                            }
                        });

                        // Delete the PDF file
                        fs.unlink(outputPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting PDF file:', unlinkErr);
                            } else {
                                console.log('PDF file deleted successfully:', outputPath);
                            }
                        });
                    } catch (dbErr) {
                        console.error('Error deleting database record:', dbErr);
                    }
                }
            });
        });
    } catch (err) {
        console.error('Error fetching file details or converting file:', err);
        res.status(500).send('Error processing the request');
    }
};

module.exports = { uploadFile, getAllFiles, deleteFile, editFile, convertToPdf };
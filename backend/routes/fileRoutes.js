const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { uploadFile, getAllFiles, deleteFile, editFile, convertToPdf } = require('../controllers/fileController');
require('dotenv').config();

const router = express.Router();
const storageBasePath = process.env.STORAGE_PATH || 'local_storage';

// Create directories if they don't exist
const uploadsPath = path.join(storageBasePath, 'uploads');
const wordToPdfPath = path.join(storageBasePath, 'wordToPdf');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(wordToPdfPath)) {
    fs.mkdirSync(wordToPdfPath, { recursive: true });
}

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Check MIME type and decide the directory
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Word file (.docx)
            cb(null, wordToPdfPath);
        } else if (file.mimetype === 'application/pdf') {
            // PDF file
            cb(null, uploadsPath);
        } else {
            // Reject unsupported file types
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to the file name
    }
});

// Create the multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

router.get('/', getAllFiles);
router.get('/edit', editFile);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);
router.get('/convert', convertToPdf);

module.exports = router;
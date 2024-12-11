const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { uploadFile, getAllFiles, deleteFile, editFile, convertToPdf } = require('../controllers/fileController');


const router = express.Router();

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('wordToPdf')) {
    fs.mkdirSync('wordToPdf');
}

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Check MIME type and decide the directory
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Word file (.docx)
            cb(null, 'wordToPdf/');
        } else if (file.mimetype === 'application/pdf') {
            // PDF file
            cb(null, 'uploads/');
        } else {
            // Reject unsupported file types
            cb(new Error('Only Word and PDF files are allowed'), false);
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
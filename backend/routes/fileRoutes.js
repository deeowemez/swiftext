const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadFile, getAllFiles, deleteFile, editFile } = require('../controllers/fileController');


const router = express.Router();

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

const upload = multer({ storage: storage });

router.get('/', getAllFiles);
router.get('/edit', editFile);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

module.exports = router;
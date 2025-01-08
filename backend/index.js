const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const fileRoutes = require('./routes/fileRoutes');
const highlightRoutes = require('./routes/highlightRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://swiftext-frontend.s3-website-ap-southeast-2.amazonaws.com' }));
app.use(express.json());
app.use(cors({
    exposedHeaders: ['Content-Disposition'], // Allow the Content-Disposition header
}));
// app.use(passport.initialize());
// app.use(passport.session());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/profile', profileRoutes);

// Serve static files from the directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/wordToPdf', express.static(path.join(__dirname, 'wordToPdf')));

// Add a root route for testing
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});

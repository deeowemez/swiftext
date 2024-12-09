const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const fileRoutes = require('./routes/fileRoutes');
const highlightRoutes = require('./routes/highlightRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api/files', fileRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/profile', profileRoutes);

// Add a root route for testing
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

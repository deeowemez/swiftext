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
const allowedOrigins = [
    'http://swiftext-frontend.s3-website-ap-southeast-2.amazonaws.com',
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is allowed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    exposedHeaders: ['Content-Disposition'], // Allow specific headers to be exposed
}));

app.use(express.json());
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

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

// Handle preflight requests (OPTIONS)
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
});

// Add a root route for testing
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
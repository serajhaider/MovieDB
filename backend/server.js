const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Passport Google Strategy configuration
require('./src/config/passport');
const passport = require('passport');

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive CORS for smooth deployment
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// API Routes
const MovieRoutes = require('./src/routes/MovieRoutes');
const AuthRoutes = require('./src/routes/AuthRoutes');
const UserRoutes = require('./src/routes/UserRoutes');

app.use('/api/movies', MovieRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);

// Base Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Movie Database API Server is running',
        timestamp: new Date()
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Backend Error:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express Server running on port ${PORT}`);
});

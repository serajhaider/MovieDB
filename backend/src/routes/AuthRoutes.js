const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../Middlewares/VerifyToken');

// POST /api/auth/register
router.post('/register', AuthController.registerUser);

// POST /api/auth/login
router.post('/login', AuthController.loginUser);

// GET /api/auth/google (Google OAuth trigger)
router.get('/google', AuthController.googleLogin);

// GET /api/auth/google/callback (Google OAuth callback handler)
router.get('/google/callback', AuthController.googleCallback);

// GET /api/auth/me (Protected profile)
router.get('/me', verifyToken, AuthController.getMe);

// PUT /api/auth/profile (Update user profile info)
router.put('/profile', verifyToken, AuthController.updateProfile);

module.exports = router;
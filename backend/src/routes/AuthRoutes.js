const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../Middlewares/VerifyToken');

// POST /api/auth/register
router.post('/register', AuthController.registerUser);

// POST /api/auth/login
router.post('/login', AuthController.loginUser);

// GET /api/auth/google (Google login trigger - matches Postman request in screenshot 1)
router.get('/google', AuthController.googleLogin);

// GET /api/auth/me (Protected profile)
router.get('/me', verifyToken, AuthController.getMe);

module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../Middlewares/VerifyToken');
const authorizeRoles = require('../Middlewares/Authorization');

// Watchlist routes (User)
router.get('/watchlist', verifyToken, UserController.getWatchlist);
router.post('/watchlist/toggle/:movieId', verifyToken, UserController.toggleWatchlist);
router.post('/watchlist/:movieId', verifyToken, UserController.addToWatchlist);
router.delete('/watchlist/:movieId', verifyToken, UserController.removeFromWatchlist);

// Profile update route
router.put('/profile', verifyToken, AuthController.updateProfile);

// Admin User Management routes
router.get('/', verifyToken, authorizeRoles('admin'), UserController.getAllUsers);
router.put('/:id/role', verifyToken, authorizeRoles('admin'), UserController.updateUserRole);
router.delete('/:id', verifyToken, authorizeRoles('admin'), UserController.deleteUser);

module.exports = router;

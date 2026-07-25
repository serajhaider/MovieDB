const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../Middlewares/VerifyToken');

// All watchlist routes are protected with verifyToken middleware
router.get('/watchlist', verifyToken, UserController.getWatchlist);
router.post('/watchlist/toggle/:movieId', verifyToken, UserController.toggleWatchlist);
router.post('/watchlist/:movieId', verifyToken, UserController.addToWatchlist);
router.delete('/watchlist/:movieId', verifyToken, UserController.removeFromWatchlist);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/AIController');
const verifyToken = require('../Middlewares/VerifyToken');

// POST /api/ai/recommend - Get AI movie recommendations (protected)
router.post('/recommend', verifyToken, getRecommendations);

module.exports = router;

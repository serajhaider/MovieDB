const { recommendMovies } = require('../services/GeminiService');
const Movie = require('../models/MovieModel');
const User = require('../models/UserModel');

/**
 * POST /api/ai/recommend
 * Sends user's watchlist + favourite genres to Gemini and returns 3 recommendations
 */
const getRecommendations = async (req, res) => {
    try {
        console.log('[AI] Request received');
        const userId = req.user?.id || req.user?._id;
        const userEmail = req.user?.email || 'Authenticated User';
        console.log(`[AI] Authenticated user: ${userEmail} (${userId})`);

        let watchlistToUse = [];

        // Try finding user in DB
        if (userId) {
            try {
                const user = await User.findById(userId).populate('watchlist');
                if (user && Array.isArray(user.watchlist)) {
                    watchlistToUse = user.watchlist;
                }
            } catch (uErr) {
                console.warn('[AI] User DB lookup warning:', uErr.message);
            }
        }

        // Fallback to request body watchlist if user DB watchlist is empty
        if (watchlistToUse.length === 0 && Array.isArray(req.body.watchlist)) {
            watchlistToUse = req.body.watchlist;
        }

        console.log(`[AI] Watchlist count: ${watchlistToUse.length}`);

        // STEP 10: Empty watchlist check
        if (watchlistToUse.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'Add some movies to your watchlist before requesting recommendations.',
                recommendations: []
            });
        }

        // Fetch all movies from catalog to pass to Gemini
        const allMovies = await Movie.find({}).select('title genre year avgRating rating synopsis cast director');

        if (allMovies.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No movies in catalog to recommend from.'
            });
        }

        // Extract genres from request body or watchlist
        const { favouriteGenres } = req.body;
        const genresToUse = (Array.isArray(favouriteGenres) && favouriteGenres.length > 0)
            ? favouriteGenres
            : [...new Set(watchlistToUse.map(m => m.genre).filter(Boolean))];

        console.log('[AI] Gemini request started');
        const recommendations = await recommendMovies(watchlistToUse, genresToUse, allMovies);
        console.log(`[AI] Gemini response received (${recommendations.length} recommendations generated)`);

        res.status(200).json({
            success: true,
            message: 'AI recommendations generated successfully',
            recommendations
        });

    } catch (error) {
        console.error('[AI] Gemini API error:', error.message);

        if (error.message.includes('GEMINI_API_KEY')) {
            return res.status(503).json({
                success: false,
                message: 'AI service is not configured on server. Please set GEMINI_API_KEY environment variable in Render.',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'AI recommendation service is temporarily unavailable.',
            error: error.message
        });
    }
};

module.exports = { getRecommendations };

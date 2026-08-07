const { recommendMovies } = require('../services/GeminiService');
const Movie = require('../models/MovieModel');
const User = require('../models/UserModel');

/**
 * POST /api/ai/recommend
 * Sends user's watchlist + favourite genres to Gemini and returns 3 recommendations
 */
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        let watchlistToUse = [];

        // Try finding user in DB
        if (userId) {
            try {
                const user = await User.findById(userId).populate('watchlist');
                if (user && user.watchlist) {
                    watchlistToUse = user.watchlist;
                }
            } catch (uErr) {
                console.warn('User lookup warning:', uErr.message);
            }
        }

        // Fallback to request body watchlist if user DB watchlist is empty
        if (watchlistToUse.length === 0 && req.body.watchlist) {
            watchlistToUse = req.body.watchlist;
        }

        // Fetch all movies from catalog to pass to Gemini
        const allMovies = await Movie.find({}).select('title genre year avgRating rating synopsis cast director');

        if (allMovies.length === 0) {
            return res.status(400).json({ message: 'No movies in catalog to recommend from.' });
        }

        // Extract genres from request body or watchlist
        const { favouriteGenres } = req.body;
        const genresToUse = (favouriteGenres && favouriteGenres.length > 0)
            ? favouriteGenres
            : [...new Set(watchlistToUse.map(m => m.genre).filter(Boolean))];

        const recommendations = await recommendMovies(watchlistToUse, genresToUse, allMovies);

        res.status(200).json({
            message: 'AI recommendations generated successfully',
            recommendations
        });

    } catch (error) {
        console.error('AI Recommendation Error:', error.stack || error.message);

        res.status(500).json({
            message: error.message || 'Failed to generate AI recommendations.',
            error: error.message
        });
    }
};

module.exports = { getRecommendations };

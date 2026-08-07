const { recommendMovies } = require('../services/GeminiService');
const Movie = require('../models/MovieModel');
const User = require('../models/UserModel');

/**
 * POST /api/ai/recommend
 * Sends user's watchlist + favourite genres to Gemini and returns 3 recommendations
 */
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's watchlist from DB
        const user = await User.findById(userId).populate('watchlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all movies from catalog to pass to Gemini
        const allMovies = await Movie.find({}).select('title genre year avgRating rating synopsis cast director');

        if (allMovies.length === 0) {
            return res.status(400).json({ message: 'No movies in catalog to recommend from.' });
        }

        // Use genres from request body, or extract from watchlist
        const { favouriteGenres } = req.body;
        const genresToUse = (favouriteGenres && favouriteGenres.length > 0)
            ? favouriteGenres
            : [...new Set(user.watchlist.map(m => m.genre).filter(Boolean))];

        const recommendations = await recommendMovies(user.watchlist, genresToUse, allMovies);

        res.status(200).json({
            message: 'AI recommendations generated successfully',
            recommendations
        });

    } catch (error) {
        console.error('AI Recommendation Error:', error);

        res.status(500).json({
            message: error.message || 'Failed to generate AI recommendations.',
            error: error.message
        });
    }
};

module.exports = { getRecommendations };

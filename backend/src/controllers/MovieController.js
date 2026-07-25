const Movie = require('../models/MovieModel');

// GET /api/movies?genre=Action&search=matrix
const getAllMovies = async (req, res) => {
    try {
        const { genre, search } = req.query;
        let query = {};

        // Filter by genre
        if (genre && genre !== 'all') {
            query.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
        }

        // Text search by title (case-insensitive)
        if (search && search.trim() !== '') {
            query.title = { $regex: new RegExp(search.trim(), 'i') };
        }

        const movies = await Movie.find(query).sort({ createdAt: -1 });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies', error: error.message });
    }
};

// GET /api/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie', error: error.message });
    }
};

// POST /api/movies
const createMovie = async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: 'Error creating movie', error: error.message });
    }
};

// PUT /api/movies/:id
const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedMovie) {
            res.status(200).json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error: error.message });
    }
};

// DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (deletedMovie) {
            res.status(200).json({ message: 'Movie deleted successfully', movie: deletedMovie });
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error: error.message });
    }
};

// POST /api/movies/:id/reviews - Protected (Scoped to logged-in user)
const addReview = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        const { rating, comment } = req.body;
        if (!comment || rating === undefined) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 0 || numRating > 10) {
            return res.status(400).json({ message: 'Rating must be a number between 0 and 10' });
        }

        // Scope to logged-in user from req.user
        const userName = req.user?.name || req.user?.email || 'Authenticated User';

        movie.reviews.push({
            user: userName,
            comment: comment.trim(),
            rating: numRating
        });

        // Recalculate avgRating whenever a new review is added
        const totalRatings = movie.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
        movie.avgRating = parseFloat((totalRatings / movie.reviews.length).toFixed(1));

        await movie.save();
        res.status(201).json({ message: 'Review added successfully', movie });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    addReview
};

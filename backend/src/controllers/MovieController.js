const Movie = require('../models/MovieModel');

// GET /api/movies?genre=Action&search=matrix&sortBy=rating&featured=true
const getAllMovies = async (req, res) => {
    try {
        const { genre, search, sortBy, featured } = req.query;
        let query = {};

        // Filter by genre
        if (genre && genre !== 'all') {
            query.genre = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
        }

        // Search by title, director, or synopsis
        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { title: searchRegex },
                { director: searchRegex },
                { synopsis: searchRegex },
                { genre: searchRegex }
            ];
        }

        // Filter featured movies
        if (featured === 'true') {
            query.featured = true;
        }

        // Sort configuration
        let sortOption = { createdAt: -1 };
        if (sortBy === 'rating') {
            sortOption = { avgRating: -1 };
        } else if (sortBy === 'year') {
            sortOption = { year: -1 };
        } else if (sortBy === 'title') {
            sortOption = { title: 1 };
        }

        const movies = await Movie.find(query).sort(sortOption);
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

// POST /api/movies - Admin
const createMovie = async (req, res) => {
    try {
        const { title, genre, year, director, synopsis, avgRating, rating, cast, poster, featured } = req.body;

        if (!title || !genre || !year || !director) {
            return res.status(400).json({ message: 'Title, genre, year, and director are required fields' });
        }

        const movieData = {
            title: title.trim(),
            genre: genre.trim(),
            year: Number(year),
            director: director.trim(),
            synopsis: synopsis ? synopsis.trim() : '',
            avgRating: Number(avgRating || rating || 5),
            cast: Array.isArray(cast) 
                ? cast 
                : (cast ? cast.split(',').map(c => c.trim()).filter(Boolean) : []),
            poster: poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
            featured: Boolean(featured),
            reviews: []
        };

        const newMovie = new Movie(movieData);
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: 'Error creating movie', error: error.message });
    }
};

// PUT /api/movies/:id - Admin
const updateMovie = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (typeof updateData.cast === 'string') {
            updateData.cast = updateData.cast.split(',').map(c => c.trim()).filter(Boolean);
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            updateData,
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

// DELETE /api/movies/:id - Admin
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

        const userName = req.user?.name || req.user?.email || 'Authenticated User';

        movie.reviews.push({
            user: userName,
            comment: comment.trim(),
            rating: numRating,
            createdAt: new Date()
        });

        // Recalculate avgRating
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

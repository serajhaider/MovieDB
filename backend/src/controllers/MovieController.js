const MovieModel = require('../models/MovieModel');

const getAllMovies = async (req, res) => {
    try {
        const movies = MovieModel.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies', error });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = MovieModel.getMovieById(req.params.id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie', error });
    }
};

const createMovie = async (req, res) => {
    try {
        const newMovie = MovieModel.createMovie(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: 'Error creating movie', error });
    }
};

const updateMovie = async (req, res) => {
    try {
        const updatedMovie = MovieModel.updateMovie(req.params.id, req.body);
        if (updatedMovie) {
            res.status(200).json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = MovieModel.deleteMovie(req.params.id);
        if (deletedMovie) {
            res.status(200).json(deletedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};

const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');

// GET /api/movies?genre=Action&search=matrix
router.get('/', MovieController.getAllMovies);

// GET /api/movies/:id
router.get('/:id', MovieController.getMovieById);

// POST /api/movies
router.post('/', MovieController.createMovie);

// PUT /api/movies/:id
router.put('/:id', MovieController.updateMovie);

// DELETE /api/movies/:id
router.delete('/:id', MovieController.deleteMovie);

// POST /api/movies/:id/reviews
router.post('/:id/reviews', MovieController.addReview);

module.exports = router;

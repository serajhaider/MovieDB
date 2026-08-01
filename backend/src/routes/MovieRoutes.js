const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const verifyToken = require('../Middlewares/VerifyToken');
const authorizeRoles = require('../Middlewares/Authorization');

// GET /api/movies?genre=Action&search=matrix&sortBy=rating&featured=true
router.get('/', MovieController.getAllMovies);

// GET /api/movies/:id
router.get('/:id', MovieController.getMovieById);

// POST /api/movies (Admin only)
router.post('/', verifyToken, authorizeRoles('admin'), MovieController.createMovie);

// PUT /api/movies/:id (Admin only)
router.put('/:id', verifyToken, authorizeRoles('admin'), MovieController.updateMovie);

// DELETE /api/movies/:id (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), MovieController.deleteMovie);

// POST /api/movies/:id/reviews (Protected user review)
router.post('/:id/reviews', verifyToken, MovieController.addReview);

module.exports = router;

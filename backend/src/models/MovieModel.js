const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, default: 'Anonymous' },
    comment: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10, default: 5 },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: 1888,
        max: 2030
    },
    director: {
        type: String,
        required: [true, 'Director is required'],
        trim: true
    },
    synopsis: {
        type: String,
        default: ''
    },
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    reviews: {
        type: [reviewSchema],
        default: []
    },
    cast: {
        type: [String],
        default: []
    },
    poster: {
        type: String,
        default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    },
    watched: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Text index for search by title, genre, director, synopsis
MovieSchema.index({ title: 'text', synopsis: 'text', director: 'text', genre: 'text' });

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;

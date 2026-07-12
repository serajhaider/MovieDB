let movies = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, watched: false },
    { id: 2, title: 'The Matrix', genre: 'Action', year: 1999, watched: true },
    { id: 3, title: 'Interstellar', genre: 'Adventure', year: 2014, watched: false },
    { id: 4, title: 'Godzilla', genre: 'Action', year: 2014, watched: true }
];

let nextId = 5;

const getAllMovies = () => {
    return movies;
}

const getMovieById = (id) => {
    const movieId = parseInt(id);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if (movieIndex !== -1) {
        return movies[movieIndex];
    } else {
        return null;
    }
}

const createMovie = (newMovie) => {
    newMovie.id = nextId++;
    movies.push(newMovie);
    return newMovie;
}

const updateMovie = (id, updatedMovie) => {
    const movieId = parseInt(id);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex !== -1) {
        movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie };
        return movies[movieIndex];
    } else {
        return null;
    }
}

const deleteMovie = (id) => {
    const movieId = parseInt(id);
    const movieIndex = movies.findIndex(movie => movie.id === movieId);

    if (movieIndex !== -1) {
        const deletedMovie = movies.splice(movieIndex, 1);
        return deletedMovie[0];
    } else {
        return null;
    }
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};

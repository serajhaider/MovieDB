let movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    director: "Christopher Nolan",
    rating: 8.7,
    synopsis: "A team of astronauts travels through a wormhole in search of a new home for humanity.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    poster: "/posters/interstellar.jpg",
    watched: false
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    director: "Christopher Nolan",
    rating: 8.8,
    synopsis: "A skilled thief enters people's dreams to steal secrets but is given one final mission.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Tom Hardy"],
    poster: "/posters/inception.jpg",
    watched: false
  },
  {
    id: 3,
    title: "Avatar",
    genre: "Adventure",
    year: 2009,
    director: "James Cameron",
    rating: 7.8,
    synopsis: "A marine joins the Avatar Program and becomes involved in the conflict on Pandora.",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    poster: "/posters/avatar.jpg",
    watched: false
  },
  {
    id: 4,
    title: "Batman",
    genre: "Action",
    year: 2022,
    director: "Matt Reeves",
    rating: 6.5,
    synopsis: "Batman uncovers corruption in Gotham City while pursuing the mysterious Riddler.",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
    poster: "/posters/batman.jpg",
    watched: false
  },
  {
    id: 5,
    title: "Joker",
    genre: "Crime",
    year: 2019,
    director: "Todd Phillips",
    rating: 4.9,
    synopsis: "A failed comedian slowly descends into madness and becomes Gotham's infamous Joker.",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
    poster: "/posters/jocker.jpg",
    watched: false
  }
];

let nextId = 6;

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

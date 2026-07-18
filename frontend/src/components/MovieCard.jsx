function MovieCard({ movie, selectMovie, watchlist, toggleWatchlist, selectedMovieId }) {
  const isWatchlisted = watchlist.some((item) => item._id === movie._id);
  const isSelected = selectedMovieId === movie._id;

  return (
    <div className={`movie-card${isSelected ? " selected" : ""}`}>

      {/* Square poster */}
      <div className="movie-poster-wrap" onClick={() => selectMovie(movie)}>
        <img src={movie.poster} alt={movie.title} />
      </div>

      <div className="movie-card-body">
        <div className="movie-card-title" title={movie.title}>
          {movie.title}
        </div>
        <div className="card-rating">
          ⭐ {movie.rating}
        </div>
        <div className="card-actions">
          <button className="btn-details" onClick={() => selectMovie(movie)}>
            View Details
          </button>
          <button
            className={`btn-watchlist ${isWatchlisted ? "remove" : "add"}`}
            onClick={() => toggleWatchlist(movie)}
          >
            {isWatchlisted ? "🗑 Remove" : "+ Add Watchlist"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default MovieCard;
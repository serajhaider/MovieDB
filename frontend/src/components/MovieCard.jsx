function MovieCard({ movie, selectMovie, watchlist, toggleWatchlist, selectedMovieId }) {
  const targetId = movie._id || movie.id;
  const isWatchlisted = watchlist.some((item) => (item._id || item.id) === targetId);
  const isSelected = selectedMovieId === targetId;

  const displayRating = movie.avgRating !== undefined ? movie.avgRating : (movie.rating || 0);

  return (
    <div className={`movie-card${isSelected ? " selected" : ""}`}>

      {/* Poster */}
      <div className="movie-poster-wrap" onClick={() => selectMovie(movie)}>
        <img src={movie.poster} alt={movie.title} />
      </div>

      <div className="movie-card-body">
        <div className="movie-card-title" title={movie.title}>
          {movie.title}
        </div>
        <div className="card-rating">
          ⭐ {displayRating} / 10
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
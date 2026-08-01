import { useMovie } from "../context/MovieContext";

function MovieCard({ movie, selectMovie, selectedMovieId }) {
  const { watchlist, toggleWatchlist } = useMovie();
  const targetId = movie._id || movie.id;
  const isWatchlisted = watchlist.some((item) => (item._id || item.id) === targetId);
  const isSelected = selectedMovieId === targetId;

  const displayRating = movie.avgRating !== undefined ? movie.avgRating : (movie.rating || 0);

  const fallbackPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`movie-card-modern ${isSelected ? "selected" : ""}`}>
      {/* Poster Image + Hover Overlay */}
      <div className="card-poster-container" onClick={() => selectMovie(movie)}>
        <img
          src={movie.poster || fallbackPoster}
          alt={movie.title}
          className="card-poster-img"
          onError={(e) => {
            e.target.src = fallbackPoster;
          }}
        />

        {/* Featured Tag */}
        {movie.featured && (
          <div className="featured-badge">🔥 Featured</div>
        )}

        {/* Rating Pill */}
        <div className="rating-pill">
          ⭐ {displayRating}
        </div>

        {/* Overlay hover action */}
        <div className="poster-overlay">
          <button className="btn-overlay-play">
            ▶ Details
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-info-content">
        <div className="card-genre-tag">{movie.genre} • {movie.year}</div>
        
        <h3 className="card-title-text" title={movie.title} onClick={() => selectMovie(movie)}>
          {movie.title}
        </h3>

        <p className="card-director-text">Dir. {movie.director}</p>

        <div className="card-action-bar">
          <button
            className="btn-card-details"
            onClick={() => selectMovie(movie)}
          >
            View Info
          </button>
          
          <button
            className={`btn-card-watchlist ${isWatchlisted ? "remove" : "add"}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {isWatchlisted ? "❤️ Saved" : "+ Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
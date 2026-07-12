function MovieDetail({ movie, watchlist, toggleWatchlist, onClose }) {
  const isWatchlisted = watchlist.some((item) => item.id === movie.id);

  return (
    <div className="movie-detail">

      {/* Header bar */}
      <div className="detail-top-bar">
        <h3>Movie Details</h3>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>

      {/* Poster + Info side by side */}
      <div className="detail-content">

        <div className="detail-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>

        <div className="detail-info">

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <h2 className="detail-title">{movie.title}</h2>
            <span className="detail-rating-pill">⭐ {movie.rating}</span>
          </div>

          <div className="detail-meta">
            <div className="detail-meta-row">
              <span className="meta-label">Genre:</span>
              <span className="meta-value">{movie.genre}</span>
            </div>
            <div className="detail-meta-row">
              <span className="meta-label">Year:</span>
              <span className="meta-value">{movie.year}</span>
            </div>
            <div className="detail-meta-row">
              <span className="meta-label">Director:</span>
              <span className="meta-value">{movie.director}</span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Synopsis</div>
            <p className="detail-synopsis">{movie.synopsis}</p>
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-title">Cast</div>
              <div className="cast-chips">
                {movie.cast.map((actor, i) => (
                  <span key={i} className="cast-chip">{actor}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Watchlist status */}
      <div className={`watchlist-status ${isWatchlisted ? "in-list" : "not-in-list"}`}>
        <span className={`status-text ${isWatchlisted ? "in" : "out"}`}>
          {isWatchlisted ? "❤️ In Your Watchlist" : "🎬 Not in Watchlist"}
        </span>
        <button
          className={`btn-toggle-watchlist ${isWatchlisted ? "remove" : "add"}`}
          onClick={() => toggleWatchlist(movie)}
        >
          {isWatchlisted ? "🗑 Remove from Watchlist" : "+ Add to Watchlist"}
        </button>
      </div>

    </div>
  );
}

export default MovieDetail;
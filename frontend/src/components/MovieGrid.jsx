import MovieCard from "./MovieCard";

function MovieGrid({ movies, selectMovie, watchlist, toggleWatchlist, activeTab, selectedMovieId }) {
  const title = activeTab === "watchlist" ? "Your Watchlist" : "Popular Movies";

  return (
    <div>
      <div className="grid-panel-header">
        <div className="panel-accent"></div>
        <h2>{title}</h2>
      </div>

      {movies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {activeTab === "watchlist" ? "❤️" : "🎬"}
          </div>
          <p>
            {activeTab === "watchlist"
              ? "Your watchlist is empty."
              : "No movies found."}
          </p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              selectMovie={selectMovie}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              selectedMovieId={selectedMovieId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieGrid;
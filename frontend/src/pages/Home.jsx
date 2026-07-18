import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import MovieDetail from "../components/MovieDetail";

const GENRES = ["all", "Sci-Fi", "Action", "Adventure", "Crime", "Drama", "Comedy", "Horror", "Romance"];

function Home() {
  const {
    movies,
    loading,
    error,
    watchlist,
    selectedMovie,
    setSelectedMovie,
    search,
    activeGenre,
    toggleWatchlist,
    filterByGenre,
    searchMovies,
  } = useMovie();

  const location = useLocation();
  const isWatchlistPage = location.pathname === "/watchlist";

  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    setStats({
      total: movies.length,
      averageRating:
        movies.length > 0
          ? (movies.reduce((sum, m) => sum + Number(m.avgRating || 0), 0) / movies.length).toFixed(1)
          : 0,
    });
  }, [movies]);

  const displayedMovies = isWatchlistPage ? watchlist : movies;

  return (
    <div className="home-page-content">
      {/* Top Bar: Stats + Search */}
      <div className="top-bar">
        <div className="dashboard">
          <div className="stat-card blue">
            <span className="stat-icon">🎞️</span>
            <div className="stat-info">
              <div className="stat-label">Total Movies</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-sub">in catalog</div>
            </div>
          </div>
          <div className="stat-card green">
            <span className="stat-icon">⭐</span>
            <div className="stat-info">
              <div className="stat-label">Avg Rating</div>
              <div className="stat-value">{stats.averageRating}</div>
              <div className="stat-sub">out of 10</div>
            </div>
          </div>
        </div>

        <SearchBar
          search={search}
          setSearch={(term) => searchMovies(term)}
        />
      </div>

      {/* Genre Filter Bar */}
      {!isWatchlistPage && (
        <div className="genre-filter-bar">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`genre-filter-btn ${activeGenre === genre ? "active" : ""}`}
              onClick={() => filterByGenre(genre)}
            >
              {genre === "all" ? "🎬 All" : genre}
            </button>
          ))}
        </div>
      )}

      {/* Loading / Error States */}
      {loading && <div className="loading-state">⏳ Loading movies...</div>}
      {error && <div className="error-state">⚠️ {error}</div>}

      {/* Main layout: Grid + Detail View */}
      {!loading && !error && (
        <div className={`content-layout${selectedMovie ? " has-detail" : ""}`}>
          <div className="grid-panel">
            <MovieGrid
              movies={displayedMovies}
              selectMovie={setSelectedMovie}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              activeTab={isWatchlistPage ? "watchlist" : "browse"}
              selectedMovieId={selectedMovie?._id}
            />
          </div>

          {selectedMovie && (
            <div className="detail-panel">
              <MovieDetail
                movie={selectedMovie}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onClose={() => setSelectedMovie(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import MovieDetail from "../components/MovieDetail";

function Home() {
  const {
    movies,
    watchlist,
    selectedMovie,
    setSelectedMovie,
    search,
    setSearch,
    toggleWatchlist,
  } = useMovie();

  const location = useLocation();
  const isWatchlistPage = location.pathname === "/watchlist";

  // Calculate statistics dynamically
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    setStats({
      total: movies.length,
      averageRating: movies.length > 0
        ? (movies.reduce((sum, m) => sum + Number(m.rating), 0) / movies.length).toFixed(1)
        : 0
    });
  }, [movies]);

  // Search Filter
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // Filter displayed movies based on the route path
  const displayedMovies = isWatchlistPage ? watchlist : filteredMovies;

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

        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Main layout: Grid + Detail View */}
      <div className={`content-layout${selectedMovie ? " has-detail" : ""}`}>
        <div className="grid-panel">
          <MovieGrid
            movies={displayedMovies}
            selectMovie={setSelectedMovie}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            activeTab={isWatchlistPage ? "watchlist" : "browse"}
            selectedMovieId={selectedMovie?.id}
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
    </div>
  );
}

export default Home;

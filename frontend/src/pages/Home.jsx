import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";

const GENRES = ["all", "Sci-Fi", "Action", "Adventure", "Drama", "Crime", "Romance", "Comedy"];

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
    filterByGenre,
    searchMovies,
    sortBy,
    sortMovies,
  } = useMovie();

  const location = useLocation();
  const isWatchlistPage = location.pathname === "/watchlist";

  // Pick top featured movie for hero spotlight banner
  const heroMovie = useMemo(() => {
    return movies.find((m) => m.featured) || movies[0] || null;
  }, [movies]);

  const displayedMovies = isWatchlistPage ? watchlist : movies;

  return (
    <div className="home-page">
      
      {/* Hero Banner Section (Only on main Browse page) */}
      {!isWatchlistPage && heroMovie && !search && activeGenre === "all" && (
        <section className="hero-spotlight">
          <div className="hero-bg-wrapper">
            <img
              src={heroMovie.poster}
              alt={heroMovie.title}
              className="hero-bg-image"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="hero-vignette-overlay"></div>
          </div>

          <div className="hero-spotlight-content">
            <span className="hero-tag">🔥 Featured Movie Spotlight</span>
            <h1 className="hero-spotlight-title">{heroMovie.title}</h1>
            <p className="hero-spotlight-meta">
              ⭐ {heroMovie.avgRating || 8.5}/10 &nbsp;•&nbsp; {heroMovie.genre} &nbsp;•&nbsp; {heroMovie.year} &nbsp;•&nbsp; Dir. {heroMovie.director}
            </p>
            <p className="hero-spotlight-synopsis">{heroMovie.synopsis}</p>
            
            <div className="hero-spotlight-actions">
              <button
                className="btn-hero-watch"
                onClick={() => setSelectedMovie(heroMovie)}
              >
                ▶ Explore Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <div className="home-container">
        
        {/* Section Header & Filters Bar */}
        <div className="filter-header-bar">
          <div className="header-title-box">
            <h2>{isWatchlistPage ? "❤️ My Watchlist" : "🎬 Explore Movies"}</h2>
            <span className="count-pill">{displayedMovies.length} Titles</span>
          </div>

          {!isWatchlistPage && (
            <div className="filter-controls-right">
              {/* Sort By Dropdown */}
              <div className="sort-selector-box">
                <label htmlFor="sort-select">Sort By:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => sortMovies(e.target.value)}
                  className="sort-dropdown"
                >
                  <option value="rating">Highest Rating ⭐</option>
                  <option value="year">Latest Release Year 📅</option>
                  <option value="title">Title (A-Z) 🔤</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Genre Pill Filters Bar */}
        {!isWatchlistPage && (
          <div className="genre-pills-scroll">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={`genre-pill-btn ${activeGenre === genre ? "active" : ""}`}
                onClick={() => filterByGenre(genre)}
              >
                {genre === "all" ? "🎬 All Genres" : genre}
              </button>
            ))}
          </div>
        )}

        {/* Search status query bar */}
        {search && (
          <div className="search-status-bar">
            <span>Showing search results for: <strong>"{search}"</strong></span>
            <button className="btn-clear-search" onClick={() => searchMovies("")}>Clear Search</button>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="state-card loading">
            <div className="spinner"></div>
            <p>Fetching movies catalog...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-card error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && !error && (
          displayedMovies.length === 0 ? (
            <div className="empty-catalog-card">
              <div className="empty-icon">{isWatchlistPage ? "❤️" : "🔍"}</div>
              <h3>{isWatchlistPage ? "Your Watchlist is Empty" : "No Movies Found"}</h3>
              <p>
                {isWatchlistPage
                  ? "Browse our movie collection and click '+ Watchlist' to save your favorite movies here!"
                  : "We couldn't find any movies matching your current filters or search query."}
              </p>
              {isWatchlistPage && (
                <Link to="/" className="btn-browse-movies">
                  Browse Movie Catalog
                </Link>
              )}
            </div>
          ) : (
            <div className="movies-grid-layout">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie._id || movie.id}
                  movie={movie}
                  selectMovie={setSelectedMovie}
                  selectedMovieId={selectedMovie?._id}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Movie Details Modal Overlay */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default Home;

import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";
import AddMovieForm from "./components/AddMovieForm";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";

import initialMovies from "./data/movies";

function App() {
  // Movies State — initialized from initialMovies file data
  const [movies, setMovies] = useState(initialMovies);

  // Selected Movie State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // Watchlist State
  const [watchlist, setWatchlist] = useState([]);

  // Dashboard State
  const [totalMovies, setTotalMovies] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Active Tab
  const [activeTab, setActiveTab] = useState("browse");

  // Dashboard Calculation
  useEffect(() => {
    setTotalMovies(movies.length);
    if (movies.length > 0) {
      const total = movies.reduce(
        (sum, movie) => sum + Number(movie.rating),
        0
      );
      setAverageRating((total / movies.length).toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [movies]);

  // Add Movie
  const addMovie = (movie) => {
    setMovies([
      ...movies,
      {
        ...movie,
        id: Date.now(),
      },
    ]);
  };

  // Watchlist toggle
  const toggleWatchlist = (movie) => {
    const exists = watchlist.find((m) => m.id === movie.id);
    if (exists) {
      setWatchlist(watchlist.filter((m) => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  // Search Filter
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // Movies shown based on active tab
  const displayedMovies =
    activeTab === "watchlist" ? watchlist : filteredMovies;

  return (
    <div className="app-root">
      <Navbar
        watchlistCount={watchlist.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {/* Dashboard + Search Row */}
        <div className="top-bar">
          <Dashboard totalMovies={totalMovies} averageRating={averageRating} />
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Main two-column layout */}
        <div className={`content-layout${selectedMovie ? " has-detail" : ""}`}>
          {/* Left: Movie Grid */}
          <div className="grid-panel">
            <MovieGrid
              movies={displayedMovies}
              selectMovie={setSelectedMovie}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              activeTab={activeTab}
              selectedMovieId={selectedMovie?.id}
            />
          </div>

          {/* Right: Movie Detail */}
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

        {/* Add Movie Form */}
        <AddMovieForm addMovie={addMovie} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
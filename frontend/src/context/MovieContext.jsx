import { createContext, useContext, useState, useEffect } from "react";
import initialMovies from "../data/movies";

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // Load initial movies from localStorage if present, else fallback to initialMovies
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies_list");
    return saved ? JSON.parse(saved) : initialMovies;
  });

  // Watchlist state
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Movie State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("movies_list", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem("watchlist_list", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add Movie
  const addMovie = (movie) => {
    const newMovie = {
      ...movie,
      id: Date.now(),
      rating: Number(movie.rating) || 0,
      year: Number(movie.year) || new Date().getFullYear(),
      cast: typeof movie.cast === "string" 
        ? movie.cast.split(",").map(c => c.trim()).filter(Boolean)
        : (movie.cast || []),
      poster: movie.poster || "/posters/interstellar.jpg", // default poster
    };
    setMovies((prevMovies) => [...prevMovies, newMovie]);
  };

  // Delete Movie
  const deleteMovie = (id) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    // Also remove from watchlist if it was there
    setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== id));
    if (selectedMovie?.id === id) {
      setSelectedMovie(null);
    }
  };

  // Toggle watchlist
  const toggleWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => {
      const exists = prevWatchlist.find((m) => m.id === movie.id);
      if (exists) {
        return prevWatchlist.filter((m) => m.id !== movie.id);
      } else {
        return [...prevWatchlist, movie];
      }
    });
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        watchlist,
        setWatchlist,
        selectedMovie,
        setSelectedMovie,
        search,
        setSearch,
        addMovie,
        deleteMovie,
        toggleWatchlist,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovie must be used within a MovieProvider");
  }
  return context;
}

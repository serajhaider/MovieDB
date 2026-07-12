import { createContext, useContext, useState, useEffect } from "react";

const MovieContext = createContext();

const API_URL = "http://localhost:5000/api/movies";

export function MovieProvider({ children }) {
  // Movies state loaded from API
  const [movies, setMovies] = useState([]);

  // Watchlist state remains in localStorage
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Movie State
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // Fetch movies from backend on load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist_list", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add Movie to API
  const addMovie = async (movie) => {
    const newMovieData = {
      ...movie,
      rating: Number(movie.rating) || 0,
      year: Number(movie.year) || new Date().getFullYear(),
      cast: typeof movie.cast === "string" 
        ? movie.cast.split(",").map(c => c.trim()).filter(Boolean)
        : (movie.cast || []),
      poster: movie.poster || "/posters/interstellar.jpg", // default poster
      watched: false
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovieData),
      });

      if (response.ok) {
        const createdMovie = await response.json();
        setMovies((prevMovies) => [...prevMovies, createdMovie]);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  // Delete Movie from API
  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
        // Also remove from watchlist if it was there
        setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== id));
        if (selectedMovie?.id === id) {
          setSelectedMovie(null);
        }
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
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

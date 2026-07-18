import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const MovieContext = createContext();

const API_URL = "http://localhost:5000/api/movies";

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Genre filter state
  const [activeGenre, setActiveGenre] = useState("all");

  // Search state
  const [search, setSearch] = useState("");

  // Watchlist stays in localStorage
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Movie
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies from backend — supports ?genre=Action&search=matrix
  const fetchMovies = useCallback(async (genre = "all", searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (genre && genre !== "all") params.genre = genre;
      if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm.trim();

      const response = await axios.get(API_URL, { params });
      setMovies(response.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMovies(activeGenre, search);
  }, []);

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist_list", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add Movie via POST
  const addMovie = async (movie) => {
    try {
      const payload = {
        ...movie,
        avgRating: Number(movie.avgRating || movie.rating) || 0,
        year: Number(movie.year) || new Date().getFullYear(),
        cast:
          typeof movie.cast === "string"
            ? movie.cast.split(",").map((c) => c.trim()).filter(Boolean)
            : movie.cast || [],
        poster: movie.poster || "/posters/interstellar.jpg",
        watched: false,
      };

      const response = await axios.post(API_URL, payload);
      setMovies((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  // Delete Movie via DELETE (uses MongoDB _id)
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
      setWatchlist((prev) => prev.filter((m) => m._id !== id));
      if (selectedMovie?._id === id) setSelectedMovie(null);
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  // Toggle Watchlist
  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m._id === movie._id);
      if (exists) return prev.filter((m) => m._id !== movie._id);
      return [...prev, movie];
    });
  };

  // Genre filter — fetches from server
  const filterByGenre = (genre) => {
    setActiveGenre(genre);
    fetchMovies(genre, search);
  };

  // Search — fetches from server
  const searchMovies = (term) => {
    setSearch(term);
    fetchMovies(activeGenre, term);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        loading,
        error,
        watchlist,
        setWatchlist,
        selectedMovie,
        setSelectedMovie,
        search,
        setSearch,
        activeGenre,
        setActiveGenre,
        addMovie,
        deleteMovie,
        toggleWatchlist,
        fetchMovies,
        filterByGenre,
        searchMovies,
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

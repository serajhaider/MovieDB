import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const MovieContext = createContext();

const API_BASE = "http://localhost:5000/api";
const MOVIES_API = `${API_BASE}/movies`;
const AUTH_API = `${API_BASE}/auth`;
const USER_API = `${API_BASE}/users`;

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Genre & Search states
  const [activeGenre, setActiveGenre] = useState("all");
  const [search, setSearch] = useState("");

  // Auth States initialized from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user_info");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth_token") || localStorage.getItem("session_id") || null;
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("user_id") || null;
  });

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("session_id") || null;
  });

  // Watchlist
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Movie
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Axios config with Auth Header
  const getAuthHeader = useCallback(() => {
    const activeToken = token || localStorage.getItem("auth_token") || localStorage.getItem("session_id");
    return activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {};
  }, [token]);

  // Fetch movies from backend — supports ?genre=Action&search=matrix
  const fetchMovies = useCallback(async (genre = "all", searchTerm = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (genre && genre !== "all") params.genre = genre;
      if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm.trim();

      const response = await axios.get(MOVIES_API, { params });
      setMovies(response.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user watchlist from server if logged in
  const fetchUserWatchlist = useCallback(async () => {
    const activeToken = token || localStorage.getItem("auth_token");
    if (!activeToken) return;

    try {
      const response = await axios.get(`${USER_API}/watchlist`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (Array.isArray(response.data)) {
        setWatchlist(response.data);
      }
    } catch (err) {
      console.error("Error fetching user watchlist:", err);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    fetchMovies(activeGenre, search);
    if (token) {
      fetchUserWatchlist();
    }
  }, [token, fetchMovies, fetchUserWatchlist]);

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist_list", JSON.stringify(watchlist));
  }, [watchlist]);

  // Auth: Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${AUTH_API}/login`, { email, password });
      const { token: resToken, sessionId: resSessionId, user: resUser, userId: resUserId } = response.data;

      const activeUserId = resUserId || resUser._id || resUser.id;
      const activeSessionId = resSessionId || resToken;

      // Save user_id and session_id into localStorage as requested
      localStorage.setItem("user_id", activeUserId);
      localStorage.setItem("session_id", activeSessionId);
      localStorage.setItem("auth_token", resToken);
      localStorage.setItem("user_info", JSON.stringify(resUser));

      setUser(resUser);
      setToken(resToken);
      setUserId(activeUserId);
      setSessionId(activeSessionId);

      if (resUser.watchlist) {
        setWatchlist(resUser.watchlist);
      }

      return { success: true, message: response.data.message || "Login successful!", user: resUser };
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      return { success: false, message: msg };
    }
  };

  // Auth: Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${AUTH_API}/register`, { name, email, password });
      const { token: resToken, sessionId: resSessionId, user: resUser, userId: resUserId } = response.data;

      const activeUserId = resUserId || resUser._id || resUser.id;
      const activeSessionId = resSessionId || resToken;

      // Save user_id and session_id into localStorage as requested
      localStorage.setItem("user_id", activeUserId);
      localStorage.setItem("session_id", activeSessionId);
      localStorage.setItem("auth_token", resToken);
      localStorage.setItem("user_info", JSON.stringify(resUser));

      setUser(resUser);
      setToken(resToken);
      setUserId(activeUserId);
      setSessionId(activeSessionId);

      return { success: true, message: response.data.message || "Registration successful!" };
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message: msg };
    }
  };

  // Auth: Logout function
  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("session_id");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");

    setUser(null);
    setToken(null);
    setUserId(null);
    setSessionId(null);
  };

  // Add Review to Movie and auto-recalculate avgRating
  const addReview = async (movieId, rating, comment) => {
    const activeToken = token || localStorage.getItem("auth_token");
    if (!activeToken) {
      return { success: false, message: "You must be logged in to submit a review." };
    }

    try {
      const response = await axios.post(
        `${MOVIES_API}/${movieId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      const updatedMovie = response.data.movie || response.data;

      // Update movies list in context state
      setMovies((prev) =>
        prev.map((m) => (m._id === movieId ? updatedMovie : m))
      );

      // Update currently selected movie if open
      if (selectedMovie?._id === movieId) {
        setSelectedMovie(updatedMovie);
      }

      return { success: true, message: "Review added successfully!" };
    } catch (err) {
      console.error("Error submitting review:", err);
      const msg = err.response?.data?.message || "Failed to submit review.";
      return { success: false, message: msg };
    }
  };

  // Add Movie via POST (Admin)
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

      const response = await axios.post(MOVIES_API, payload, getAuthHeader());
      setMovies((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  // Delete Movie via DELETE
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${MOVIES_API}/${id}`, getAuthHeader());
      setMovies((prev) => prev.filter((m) => m._id !== id));
      setWatchlist((prev) => prev.filter((m) => m._id !== id && m.id !== id));
      if (selectedMovie?._id === id) setSelectedMovie(null);
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  // Toggle Watchlist (syncs with backend if logged in)
  const toggleWatchlist = async (movie) => {
    const targetId = movie._id || movie.id;
    const activeToken = token || localStorage.getItem("auth_token");

    if (activeToken) {
      try {
        const response = await axios.post(
          `${USER_API}/watchlist/toggle/${targetId}`,
          {},
          { headers: { Authorization: `Bearer ${activeToken}` } }
        );
        if (response.data.watchlist) {
          setWatchlist(response.data.watchlist);
          return;
        }
      } catch (err) {
        console.error("Error toggling server watchlist:", err);
      }
    }

    // Fallback local toggle
    setWatchlist((prev) => {
      const exists = prev.find((m) => (m._id || m.id) === targetId);
      if (exists) return prev.filter((m) => (m._id || m.id) !== targetId);
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
        user,
        token,
        userId,
        sessionId,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        addReview,
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

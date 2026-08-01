import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const MovieContext = createContext();

// Dynamic API URL from environment variable or fallback to local backend
const VITE_API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${VITE_API.replace(/\/$/, '')}/api`;
const MOVIES_API = `${API_BASE}/movies`;
const AUTH_API = `${API_BASE}/auth`;
const USER_API = `${API_BASE}/users`;

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [activeGenre, setActiveGenre] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // 'rating', 'year', 'title'

  // Auth States
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

  // Watchlist State
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist_list");
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Movie for detail view
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Admin users list state
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);

  // Notification alert toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper for Authorization Headers
  const getAuthHeader = useCallback(() => {
    const activeToken = token || localStorage.getItem("auth_token");
    return activeToken ? { headers: { Authorization: `Bearer ${activeToken}` } } : {};
  }, [token]);

  // Fetch movies from server with genre, search, and sorting
  const fetchMovies = useCallback(async (genre = activeGenre, searchTerm = search, sortOrder = sortBy) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (genre && genre !== "all") params.genre = genre;
      if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm.trim();
      if (sortOrder) params.sortBy = sortOrder;

      const response = await axios.get(MOVIES_API, { params });
      setMovies(response.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Unable to connect to movie service. Please check backend API.");
    } finally {
      setLoading(false);
    }
  }, [activeGenre, search, sortBy]);

  // Fetch user profile from /auth/me to sync persistent auth state
  const fetchUserProfile = useCallback(async (activeToken) => {
    if (!activeToken) return null;
    try {
      const response = await axios.get(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (response.data.user) {
        const freshUser = response.data.user;
        setUser(freshUser);
        localStorage.setItem("user_info", JSON.stringify(freshUser));
        if (freshUser.watchlist) {
          setWatchlist(freshUser.watchlist);
        }
        return freshUser;
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // If token expired or invalid, log out
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
    return null;
  }, []);

  // Fetch watchlist from server
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

  // Parse Google OAuth redirect token from URL query string on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const errorFromUrl = urlParams.get("error");

    if (tokenFromUrl) {
      localStorage.setItem("auth_token", tokenFromUrl);
      localStorage.setItem("session_id", tokenFromUrl);
      setToken(tokenFromUrl);
      setSessionId(tokenFromUrl);

      fetchUserProfile(tokenFromUrl).then((fetchedUser) => {
        if (fetchedUser) {
          showToast(`Google Sign-In successful! Welcome, ${fetchedUser.name || fetchedUser.email}`, "success");
        }
      });

      // Clean token from URL bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (errorFromUrl) {
      showToast(decodeURIComponent(errorFromUrl), "error");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchUserProfile]);

  // Initial load
  useEffect(() => {
    fetchMovies(activeGenre, search, sortBy);
    if (token) {
      fetchUserProfile(token);
      fetchUserWatchlist();
    }
  }, [token, fetchMovies, fetchUserProfile, fetchUserWatchlist]);

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist_list", JSON.stringify(watchlist));
  }, [watchlist]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${AUTH_API}/login`, { email, password });
      const { token: resToken, sessionId: resSessionId, user: resUser, userId: resUserId } = response.data;

      const activeUserId = resUserId || resUser._id || resUser.id;
      const activeSessionId = resSessionId || resToken;

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

      showToast(`Welcome back, ${resUser.name || resUser.email}!`, "success");
      return { success: true, message: response.data.message || "Login successful!", user: resUser };
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Login failed. Please verify credentials.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${AUTH_API}/register`, { name, email, password });
      const { token: resToken, user: resUser, userId: resUserId } = response.data;

      const activeUserId = resUserId || resUser._id || resUser.id;

      localStorage.setItem("user_id", activeUserId);
      localStorage.setItem("session_id", resToken);
      localStorage.setItem("auth_token", resToken);
      localStorage.setItem("user_info", JSON.stringify(resUser));

      setUser(resUser);
      setToken(resToken);
      setUserId(activeUserId);
      setSessionId(resToken);

      showToast("Account registered successfully!", "success");
      return { success: true, message: response.data.message || "Registration successful!", user: resUser };
    } catch (err) {
      console.error("Register error:", err);
      const msg = err.response?.data?.message || "Registration failed.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // Google Login redirect
  const loginWithGoogle = () => {
    window.location.href = `${AUTH_API}/google`;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("session_id");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");

    setUser(null);
    setToken(null);
    setUserId(null);
    setSessionId(null);
    setWatchlist([]);
    showToast("Logged out successfully", "info");
  };

  // Update User Profile
  const updateProfile = async (name, avatar) => {
    try {
      const response = await axios.put(`${AUTH_API}/profile`, { name, avatar }, getAuthHeader());
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user_info", JSON.stringify(response.data.user));
        showToast("Profile updated successfully!", "success");
        return { success: true };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Failed to update profile", "error");
      return { success: false };
    }
  };

  // Add Review
  const addReview = async (movieId, rating, comment) => {
    const activeToken = token || localStorage.getItem("auth_token");
    if (!activeToken) {
      showToast("You must be signed in to submit a review.", "warning");
      return { success: false, message: "Authentication required." };
    }

    try {
      const response = await axios.post(
        `${MOVIES_API}/${movieId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      const updatedMovie = response.data.movie || response.data;

      setMovies((prev) =>
        prev.map((m) => (m._id === movieId ? updatedMovie : m))
      );

      if (selectedMovie?._id === movieId) {
        setSelectedMovie(updatedMovie);
      }

      showToast("Review submitted successfully!", "success");
      return { success: true, message: "Review added successfully!" };
    } catch (err) {
      console.error("Error submitting review:", err);
      const msg = err.response?.data?.message || "Failed to submit review.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // Add Movie (Admin)
  const addMovie = async (movieData) => {
    try {
      const response = await axios.post(MOVIES_API, movieData, getAuthHeader());
      setMovies((prev) => [response.data, ...prev]);
      showToast(`Added "${response.data.title}" to catalog!`, "success");
      return { success: true, movie: response.data };
    } catch (err) {
      console.error("Error adding movie:", err);
      const msg = err.response?.data?.message || "Failed to add movie.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // Update Movie (Admin)
  const updateMovie = async (id, updatedData) => {
    try {
      const response = await axios.put(`${MOVIES_API}/${id}`, updatedData, getAuthHeader());
      setMovies((prev) => prev.map((m) => (m._id === id ? response.data : m)));
      if (selectedMovie?._id === id) setSelectedMovie(response.data);
      showToast(`Updated "${response.data.title}"`, "success");
      return { success: true };
    } catch (err) {
      console.error("Error updating movie:", err);
      showToast("Failed to update movie", "error");
      return { success: false };
    }
  };

  // Delete Movie (Admin)
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${MOVIES_API}/${id}`, getAuthHeader());
      setMovies((prev) => prev.filter((m) => m._id !== id));
      setWatchlist((prev) => prev.filter((m) => (m._id || m.id) !== id));
      if (selectedMovie?._id === id) setSelectedMovie(null);
      showToast("Movie deleted from catalog", "info");
      return { success: true };
    } catch (err) {
      console.error("Error deleting movie:", err);
      showToast("Failed to delete movie", "error");
      return { success: false };
    }
  };

  // Toggle Watchlist
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
          showToast(response.data.message || "Watchlist updated", "success");
          return;
        }
      } catch (err) {
        console.error("Error toggling server watchlist:", err);
      }
    }

    // Fallback local toggle
    setWatchlist((prev) => {
      const exists = prev.find((m) => (m._id || m.id) === targetId);
      const updated = exists 
        ? prev.filter((m) => (m._id || m.id) !== targetId)
        : [...prev, movie];
      showToast(exists ? "Removed from watchlist" : "Added to watchlist", "info");
      return updated;
    });
  };

  // Admin User Management
  const fetchAdminUsers = async () => {
    setAdminUsersLoading(true);
    try {
      const response = await axios.get(USER_API, getAuthHeader());
      setAdminUsers(response.data);
    } catch (err) {
      console.error("Error fetching admin users:", err);
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const updateUserRole = async (targetUserId, newRole) => {
    try {
      const response = await axios.put(`${USER_API}/${targetUserId}/role`, { role: newRole }, getAuthHeader());
      setAdminUsers((prev) => prev.map((u) => (u._id === targetUserId ? response.data.user : u)));
      showToast(`User role updated to ${newRole}`, "success");
      return { success: true };
    } catch (err) {
      console.error("Error updating user role:", err);
      showToast("Failed to update user role", "error");
      return { success: false };
    }
  };

  const deleteUser = async (targetUserId) => {
    try {
      await axios.delete(`${USER_API}/${targetUserId}`, getAuthHeader());
      setAdminUsers((prev) => prev.filter((u) => u._id !== targetUserId));
      showToast("User account deleted", "info");
      return { success: true };
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("Failed to delete user", "error");
      return { success: false };
    }
  };

  // Filter & Search controls
  const filterByGenre = (genre) => {
    setActiveGenre(genre);
    fetchMovies(genre, search, sortBy);
  };

  const searchMovies = (term) => {
    setSearch(term);
    fetchMovies(activeGenre, term, sortBy);
  };

  const sortMovies = (sortOrder) => {
    setSortBy(sortOrder);
    fetchMovies(activeGenre, search, sortOrder);
  };

  const isAdmin = !!(user && (user.role === "admin" || user.email?.toLowerCase().includes("admin")));

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
        sortBy,
        setSortBy,
        user,
        token,
        userId,
        sessionId,
        isAuthenticated: !!token,
        isAdmin,
        toast,
        adminUsers,
        adminUsersLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        addReview,
        addMovie,
        updateMovie,
        deleteMovie,
        toggleWatchlist,
        fetchMovies,
        filterByGenre,
        searchMovies,
        sortMovies,
        fetchAdminUsers,
        updateUserRole,
        deleteUser,
        showToast,
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

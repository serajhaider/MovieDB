import { useState, useEffect } from "react";
import { useMovie } from "../context/MovieContext";

function Dashboard() {
  const {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    adminUsers,
    adminUsersLoading,
    fetchAdminUsers,
    updateUserRole,
    deleteUser,
    showToast,
  } = useMovie();

  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog' | 'users'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Form fields state
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState("");
  const [cast, setCast] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (activeTab === "users") {
      fetchAdminUsers();
    }
  }, [activeTab]);

  // Statistics calculation
  const totalMovies = movies.length;
  const avgRating = totalMovies > 0
    ? (movies.reduce((sum, m) => sum + Number(m.avgRating || 0), 0) / totalMovies).toFixed(1)
    : 0;
  const featuredCount = movies.filter((m) => m.featured).length;
  const totalReviews = movies.reduce((sum, m) => sum + (m.reviews?.length || 0), 0);

  const openAddModal = () => {
    setEditingMovie(null);
    setTitle("");
    setGenre("");
    setYear("");
    setDirector("");
    setSynopsis("");
    setPoster("");
    setRating("8.0");
    setCast("");
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setTitle(movie.title || "");
    setGenre(movie.genre || "");
    setYear(movie.year || "");
    setDirector(movie.director || "");
    setSynopsis(movie.synopsis || "");
    setPoster(movie.poster || "");
    setRating(movie.avgRating || movie.rating || "8.0");
    setCast(Array.isArray(movie.cast) ? movie.cast.join(", ") : "");
    setFeatured(!!movie.featured);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      genre,
      year: Number(year),
      director,
      synopsis,
      poster: poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      avgRating: Number(rating),
      cast: cast.split(",").map((c) => c.trim()).filter(Boolean),
      featured,
    };

    if (editingMovie) {
      await updateMovie(editingMovie._id || editingMovie.id, payload);
    } else {
      await addMovie(payload);
    }

    setIsModalOpen(false);
  };

  const toggleFeaturedMovie = async (movie) => {
    await updateMovie(movie._id || movie.id, { featured: !movie.featured });
  };

  return (
    <div className="admin-dashboard-container">
      
      {/* Top Admin Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === "catalog" ? "active" : ""}`}
          onClick={() => setActiveTab("catalog")}
        >
          🎬 Catalog Management ({totalMovies})
        </button>

        <button
          className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 User Role Management ({adminUsers.length || "..."})
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card slate">
          <span className="stat-icon">🎞️</span>
          <div className="stat-content">
            <h3>Total Catalog</h3>
            <div className="stat-value">{totalMovies} Movies</div>
            <p>Seeded & User-Added Titles</p>
          </div>
        </div>

        <div className="admin-stat-card gold">
          <span className="stat-icon">⭐</span>
          <div className="stat-content">
            <h3>Average Score</h3>
            <div className="stat-value">{avgRating} / 10</div>
            <p>Across {totalReviews} User Reviews</p>
          </div>
        </div>

        <div className="admin-stat-card fire">
          <span className="stat-icon">🔥</span>
          <div className="stat-content">
            <h3>Featured Titles</h3>
            <div className="stat-value">{featuredCount} Featured</div>
            <p>Spotlight Banner Movies</p>
          </div>
        </div>
      </div>

      {/* TAB 1: MOVIE CATALOG MANAGEMENT */}
      {activeTab === "catalog" && (
        <div className="admin-panel-card">
          <div className="panel-header-flex">
            <div>
              <h2>Catalog Inventory</h2>
              <p>Manage, edit, or delete existing movies in the platform</p>
            </div>
            
            <button className="btn-add-movie-primary" onClick={openAddModal}>
              ➕ Add New Movie
            </button>
          </div>

          <div className="table-responsive-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Director</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-table-cell">
                      No movies found in catalog. Click <strong>+ Add New Movie</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr key={movie._id || movie.id}>
                      <td className="movie-title-cell">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="table-poster-thumb"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <span className="movie-name">{movie.title}</span>
                      </td>
                      <td><span className="table-badge genre">{movie.genre}</span></td>
                      <td>{movie.year}</td>
                      <td>{movie.director}</td>
                      <td>
                        <span className="table-badge rating">⭐ {movie.avgRating || 0}</span>
                      </td>
                      <td>
                        <button
                          className={`btn-featured-toggle ${movie.featured ? "active" : ""}`}
                          onClick={() => toggleFeaturedMovie(movie)}
                          title="Toggle featured status"
                        >
                          {movie.featured ? "🔥 Featured" : "☆ Standard"}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            className="btn-action edit"
                            onClick={() => openEditModal(movie)}
                            title="Edit Movie"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => deleteMovie(movie._id || movie.id)}
                            title="Delete Movie"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER ROLE MANAGEMENT */}
      {activeTab === "users" && (
        <div className="admin-panel-card">
          <div className="panel-header-flex">
            <div>
              <h2>Registered Users & Access Roles</h2>
              <p>Promote users to Administrator or manage accounts</p>
            </div>
            
            <button className="btn-add-movie-primary" onClick={fetchAdminUsers}>
              🔄 Refresh List
            </button>
          </div>

          {adminUsersLoading ? (
            <div className="state-card loading">
              <div className="spinner"></div>
              <p>Loading registered users...</p>
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Watchlist Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table-cell">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="movie-title-cell">
                          <div className="table-user-avatar">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="avatar-img" />
                            ) : (
                              (u.name || u.email).charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="movie-name">{u.name || "User"}</span>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`table-badge ${u.role === 'admin' ? 'admin-role' : 'user-role'}`}>
                            {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                          </span>
                        </td>
                        <td>{u.watchlist?.length || 0} movies</td>
                        <td>
                          <div className="action-buttons-group">
                            {u.role === 'admin' ? (
                              <button
                                className="btn-action user-demote"
                                onClick={() => updateUserRole(u._id, 'user')}
                              >
                                Demote to User
                              </button>
                            ) : (
                              <button
                                className="btn-action admin-promote"
                                onClick={() => updateUserRole(u._id, 'admin')}
                              >
                                👑 Promote to Admin
                              </button>
                            )}

                            <button
                              className="btn-action delete"
                              onClick={() => deleteUser(u._id)}
                            >
                              🗑️ Remove User
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MOVIE MODAL */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMovie ? "✏️ Edit Movie Entry" : "➕ Add New Movie"}</h3>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label htmlFor="movie-title">Movie Title *</label>
                  <input
                    id="movie-title"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Interstellar"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="movie-genre">Genre *</label>
                  <input
                    id="movie-genre"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sci-Fi"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="movie-year">Release Year *</label>
                  <input
                    id="movie-year"
                    type="number"
                    min="1888"
                    max="2030"
                    className="form-input"
                    placeholder="2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="movie-director">Director *</label>
                  <input
                    id="movie-director"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Christopher Nolan"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="movie-rating">Rating Score (0 - 10)</label>
                  <input
                    id="movie-rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    className="form-input"
                    placeholder="8.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="movie-poster">Poster URL</label>
                  <input
                    id="movie-poster"
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="movie-cast">Cast (comma separated actors)</label>
                <input
                  id="movie-cast"
                  type="text"
                  className="form-input"
                  placeholder="Leonardo DiCaprio, Tom Hardy, Cillian Murphy"
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="movie-synopsis">Synopsis *</label>
                <textarea
                  id="movie-synopsis"
                  rows="3"
                  className="form-input text-area"
                  placeholder="Provide a detailed movie synopsis..."
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  required
                />
              </div>

              <div className="checkbox-group">
                <input
                  id="movie-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <label htmlFor="movie-featured">Mark as Featured (Display in top hero banner)</label>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                
                <button type="submit" className="btn-submit-modal">
                  {editingMovie ? "Save Changes" : "Create Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;

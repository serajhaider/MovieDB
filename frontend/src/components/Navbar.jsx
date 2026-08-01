import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { watchlist, user, isAuthenticated, isAdmin, logout, search, searchMovies } = useMovie();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setImgError(false);
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const userInitial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand-link">
          <div className="navbar-brand">
            <span className="brand-icon">M</span>
            <span className="brand-title">Movie<span className="brand-accent">DB</span></span>
          </div>
        </Link>

        {/* Quick Search Input */}
        <form onSubmit={handleSearchSubmit} className="nav-search-form">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search movies, directors..."
            value={search}
            onChange={(e) => searchMovies(e.target.value)}
            className="nav-search-input"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => searchMovies("")}
            >
              x
            </button>
          )}
        </form>

        {/* Links Navigation */}
        <ul className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>Browse</li>
            )}
          </NavLink>

          <NavLink to="/watchlist" onClick={() => setMobileMenuOpen(false)}>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>
                My Watchlist
                {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
              </li>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
              {({ isActive }) => (
                <li className={`admin-nav-item ${isActive ? "active" : ""}`}>
                  Admin Panel
                </li>
              )}
            </NavLink>
          )}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="auth-nav-btns">
              <Link to="/login" className="btn-nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-register">
                Register
              </Link>
            </div>
          ) : (
            <div className="user-menu-wrapper">
              <button
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User Menu"
              >
                {user?.avatar && !imgError ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User Avatar"}
                    className="user-avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {userInitial}
                  </div>
                )}
                <span className="user-display-name">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
                <span className="dropdown-arrow">v</span>
              </button>

              {userDropdownOpen && (
                <div
                  className="user-dropdown-menu"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      {user?.avatar && !imgError ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="user-avatar-lg"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          referrerPolicy="no-referrer"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="avatar-placeholder" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                          {userInitial}
                        </div>
                      )}
                      <div>
                        <p className="info-name" style={{ margin: 0 }}>{user?.name || 'User'}</p>
                        <p className="info-email" style={{ margin: 0 }}>{user?.email}</p>
                      </div>
                    </div>

                    <span className={`role-pill ${isAdmin ? 'admin' : 'user'}`}>
                      {isAdmin ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />

                  <Link
                    to="/watchlist"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    My Watchlist ({watchlist.length})
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item admin-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Admin Console
                    </Link>
                  )}

                  <hr className="dropdown-divider" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="dropdown-item logout-item"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "x" : "="}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
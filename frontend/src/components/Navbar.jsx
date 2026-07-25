import { NavLink, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { watchlist, user, isAuthenticated, logout } = useMovie();

  const isAdmin = isAuthenticated && (user?.role === "admin" || user?.email?.toLowerCase().includes("admin"));

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-link-btn">
          <div className="navbar-brand">
            <span className="brand-icon">🎬</span>
            <span>Movie Database</span>
          </div>
        </Link>

        <ul className="navbar-links">
          <NavLink to="/" end>
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>Browse</li>
            )}
          </NavLink>

          <NavLink to="/watchlist">
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>My Watchlist</li>
            )}
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink to="/login">
                {({ isActive }) => (
                  <li className={isActive ? "active" : ""}>Login</li>
                )}
              </NavLink>
              <NavLink to="/register">
                {({ isActive }) => (
                  <li className={isActive ? "active" : ""}>Register</li>
                )}
              </NavLink>
            </>
          ) : (
            isAdmin && (
              <NavLink to="/admin">
                {({ isActive }) => (
                  <li className={isActive ? "active" : ""}>⚙️ Admin Panel</li>
                )}
              </NavLink>
            )
          )}
        </ul>

        <div className="navbar-actions">
          <ThemeToggle />

          <Link to="/watchlist" className="nav-link-btn">
            <button className="watchlist-badge">
              ❤️ Watchlist
              <span className="badge-count">{watchlist.length}</span>
            </button>
          </Link>

          {isAuthenticated && user && (
            <div className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="user-name" style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                {isAdmin ? "👑" : "👤"} {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="btn-logout"
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid currentColor',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { NavLink, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { watchlist } = useMovie();

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
              <li className={isActive ? "active" : ""}>Watchlist</li>
            )}
          </NavLink>
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
          <NavLink to="/admin">
            {({ isActive }) => (
              <li className={isActive ? "active" : ""}>Admin Panel</li>
            )}
          </NavLink>
        </ul>

        <div className="navbar-actions">
          <ThemeToggle />
          <Link to="/watchlist" className="nav-link-btn">
            <button className="watchlist-badge">
              ❤️ Watchlist
              <span className="badge-count">{watchlist.length}</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
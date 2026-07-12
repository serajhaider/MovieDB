import { Outlet, Link } from "react-router-dom";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

function AdminLayout() {
  return (
    <div className="app-root admin-root">
      <nav className="navbar admin-navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-icon">⚙️</span>
            <span>Admin Console</span>
          </div>

          <ul className="navbar-links">
            <li>
              <Link to="/" className="nav-link-btn">
                🏠 View Main Site
              </Link>
            </li>
            <li>
              <Link to="/admin" className="nav-link-btn active-admin">
                📊 Dashboard
              </Link>
            </li>
          </ul>

          <div className="admin-nav-actions">
            <ThemeToggle />
            <Link to="/login" className="btn-logout">
              🚪 Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="admin-header-badge">
          <h2>Welcome to Admin Control Panel</h2>
          <p>Manage the entire movie database catalog, view statistics, and add new entries.</p>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AdminLayout;

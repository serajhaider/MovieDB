import { Outlet, Link, Navigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

function AdminLayout() {
  const { user, isAuthenticated, logout } = useMovie();

  const isAdmin = isAuthenticated && (user?.role === "admin" || user?.email?.toLowerCase().includes("admin"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

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

          <div className="admin-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <span className="user-name" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>
              👑 {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="btn-logout"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "6px"
              }}
            >
              🚪 Logout
            </button>
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

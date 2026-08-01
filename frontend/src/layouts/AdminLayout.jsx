import { Outlet, Link, Navigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

function AdminLayout() {
  const { user, isAuthenticated, isAdmin, logout } = useMovie();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-root admin-root">
      <header className="admin-global-header">
        <div className="admin-header-inner">
          <div className="admin-brand-box">
            <span className="brand-icon">⚡</span>
            <span className="brand-title">Admin Console</span>
            <span className="platform-tag">MovieDB Control</span>
          </div>

          <div className="admin-header-nav">
            <Link to="/" className="btn-nav-outline">
              🏠 View Main Platform
            </Link>
            <ThemeToggle />
            <div className="admin-user-pill">
              <span className="user-icon">👑</span>
              <span>{user?.name || user?.email}</span>
            </div>
            <button onClick={logout} className="btn-nav-logout">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content admin-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default AdminLayout;

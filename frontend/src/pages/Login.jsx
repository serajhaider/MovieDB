import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, isAdmin, user } = useMovie();

  const from = location.state?.from?.pathname || "/";

  // Auto redirect if already authenticated (including after Google OAuth)
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, isAdmin, navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login service unavailable. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-backdrop"></div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">M</div>
          <h2>Welcome Back</h2>
          <p>Sign in to manage your watchlist, submit reviews & explore 20+ movies</p>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="btn-google-auth"
        >
          <svg className="google-svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        <div className="auth-divider">
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-flex">
              <label htmlFor="login-password">Password</label>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn-auth-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In to Account"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet? <Link to="/register">Create an Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

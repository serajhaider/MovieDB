function Navbar({ watchlistCount, activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <div className="navbar-brand">
          <span className="brand-icon">🎬</span>
          <span>Movie Database</span>
        </div>

        <ul className="navbar-links">
          <li
            className={activeTab === "browse" ? "active" : ""}
            onClick={() => setActiveTab("browse")}
          >
            Browse
          </li>
          <li
            className={activeTab === "watchlist" ? "active" : ""}
            onClick={() => setActiveTab("watchlist")}
          >
            Watchlist
          </li>
          <li
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Movie
          </li>
        </ul>

        <button
          className="watchlist-badge"
          onClick={() => setActiveTab("watchlist")}
        >
          ❤️ Watchlist
          <span className="badge-count">{watchlistCount}</span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
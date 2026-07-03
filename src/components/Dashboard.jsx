function Dashboard({ totalMovies, averageRating }) {
  return (
    <div className="dashboard">

      <div className="stat-card blue">
        <span className="stat-icon">🎞️</span>
        <div className="stat-info">
          <div className="stat-label">Total Movies</div>
          <div className="stat-value">{totalMovies}</div>
          <div className="stat-sub">in collection</div>
        </div>
      </div>

      <div className="stat-card green">
        <span className="stat-icon">⭐</span>
        <div className="stat-info">
          <div className="stat-label">Avg Rating</div>
          <div className="stat-value">{averageRating}</div>
          <div className="stat-sub">out of 10</div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
import { useMovie } from "../context/MovieContext";
import AddMovieForm from "../components/AddMovieForm";

function Dashboard() {
  const { movies, addMovie, deleteMovie } = useMovie();

  // Statistics calculation
  const total = movies.length;
  const avg = total > 0
    ? (movies.reduce((sum, m) => sum + Number(m.avgRating), 0) / total).toFixed(1)
    : 0;
  
  // Find highest rated movie
  const highest = movies.reduce((max, m) => (Number(m.avgRating) > Number(max.avgRating) ? m : max), movies[0] || { title: "N/A", avgRating: 0 });

  return (
    <div className="admin-dashboard-page">
      {/* Admin Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card bg-slate">
          <h3>Total Titles</h3>
          <div className="admin-stat-val">{total}</div>
          <p>Movies in database</p>
        </div>
        <div className="admin-stat-card bg-gold">
          <h3>Average Rating</h3>
          <div className="admin-stat-val">⭐ {avg}</div>
          <p>Score out of 10</p>
        </div>
        <div className="admin-stat-card bg-purple">
          <h3>Highest Rated</h3>
          <div className="admin-stat-val">{highest.title}</div>
          <p>Rating: {highest.avgRating}/10</p>
        </div>
      </div>

      <div className="admin-content-split">
        {/* Table of movies */}
        <div className="admin-table-container">
          <div className="table-header">
            <h3>Catalog Inventory</h3>
            <span className="badge">{total} Movies</span>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Director</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No movies in the catalog yet. Use the form to add one!
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td className="td-movie-title">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="table-poster-thumb"
                        onError={(e) => {
                          e.target.src = "/posters/interstellar.jpg";
                        }}
                      />
                      <span>{movie.title}</span>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{movie.year}</td>
                    <td>{movie.director}</td>
                    <td>
                      <span className="table-rating-badge">
                        ⭐ {movie.avgRating}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="btn-action-delete"
                        title="Delete Movie"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add movie form side */}
        <div className="admin-form-container">
          <AddMovieForm addMovie={addMovie} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

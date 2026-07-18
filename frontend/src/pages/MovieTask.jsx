import { useState } from "react";
import { useMovie } from "../context/MovieContext";
import MovieHeader from "../components/MovieHeader";
import MovieModal from "../components/MovieModal";
import MovieForm from "../components/MovieForm";

function MovieTask() {
  const { movies, addMovie, deleteMovie } = useMovie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? movies
    : movies.filter((m) => m.genre.toLowerCase() === filter.toLowerCase());

  const genres = ["all", ...new Set(movies.map((m) => m.genre))];

  const handleAddMovie = (data) => {
    addMovie(data);
    setIsModalOpen(false);
  };

  return (
    <div className="movie-task-page">
      <MovieHeader
        title="🎬 Movie Tasks"
        subtitle={`${movies.length} movies in your collection`}
      >
        <button className="btn-submit" onClick={() => setIsModalOpen(true)}>
          + Add Movie
        </button>
      </MovieHeader>

      {/* Filter by Genre */}
      <div className="task-filter-bar">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`filter-btn ${filter === genre ? "active" : ""}`}
            onClick={() => setFilter(genre)}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Movie Task List */}
      <div className="task-list">
        {filtered.length === 0 ? (
          <div className="no-data">
            No movies found. Click <strong>+ Add Movie</strong> to get started!
          </div>
        ) : (
          filtered.map((movie) => (
            <div key={movie.id} className="task-item">
              <div className="task-poster">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = "/posters/interstellar.jpg";
                  }}
                />
              </div>
              <div className="task-info">
                <h3 className="task-title">{movie.title}</h3>
                <p className="task-meta">
                  🎭 {movie.genre} &nbsp;|&nbsp; 📅 {movie.year} &nbsp;|&nbsp; 🎬 {movie.director}
                </p>
                <p className="task-synopsis">{movie.synopsis}</p>
              </div>
              <div className="task-actions">
                <span className="table-rating-badge">⭐ {movie.rating}</span>
                <button
                  className="btn-action-delete"
                  onClick={() => deleteMovie(movie.id)}
                  title="Delete Movie"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Movie Modal */}
      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Movie"
      >
        <MovieForm onSubmit={handleAddMovie} />
      </MovieModal>
    </div>
  );
}

export default MovieTask;

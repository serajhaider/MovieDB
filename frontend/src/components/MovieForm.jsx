import { useState } from "react";

function MovieForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    genre: initialData.genre || "",
    year: initialData.year || "",
    director: initialData.director || "",
    rating: initialData.rating || "",
    synopsis: initialData.synopsis || "",
    poster: initialData.poster || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      genre: "",
      year: "",
      director: "",
      rating: "",
      synopsis: "",
      poster: "",
    });
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Movie Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter movie title"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            id="genre"
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g. Sci-Fi, Action"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="director">Director</label>
          <input
            id="director"
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Director name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating (0-10)</label>
          <input
            id="rating"
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="e.g. 8.5"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="synopsis">Synopsis</label>
        <textarea
          id="synopsis"
          name="synopsis"
          value={formData.synopsis}
          onChange={handleChange}
          placeholder="Brief movie description..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="poster">Poster URL</label>
        <input
          id="poster"
          type="text"
          name="poster"
          value={formData.poster}
          onChange={handleChange}
          placeholder="/posters/movie.jpg"
        />
      </div>

      <button type="submit" className="btn-submit">
        🎬 {initialData.title ? "Update Movie" : "Add Movie"}
      </button>
    </form>
  );
}

export default MovieForm;

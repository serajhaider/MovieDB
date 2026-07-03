import { useState } from "react";

function AddMovieForm({ addMovie }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState("");
  const [cast, setCast] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    addMovie({
      title,
      genre,
      year: Number(year),
      director,
      synopsis,
      rating: rating ? Number(rating) : 5,
      poster: poster || "/posters/interstellar.jpg",
      cast: cast
        ? cast.split(",").map((name) => name.trim()).filter(Boolean)
        : [],
    });

    // Reset all fields
    setTitle("");
    setGenre("");
    setYear("");
    setDirector("");
    setSynopsis("");
    setPoster("");
    setRating("");
    setCast("");
  };

  return (
    <div className="add-movie-section">

      <div className="section-heading">
        <div className="heading-icon">➕</div>
        <h2>Add New Movie</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-movie-form">

        {/* Row 1: Title, Genre, Year, Director */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-input"
          min="1888"
          max="2030"
          required
        />
        <input
          type="text"
          placeholder="Director"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
          className="form-input"
          required
        />

        {/* Row 2: Poster URL, Rating */}
        <input
          type="text"
          placeholder="Poster URL (https://...)"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
          className="form-input"
          style={{ gridColumn: "span 3" }}
        />
        <input
          type="number"
          placeholder="Rating (0–10)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-input"
          min="0"
          max="10"
          step="0.1"
        />

        {/* Row 3: Cast */}
        <input
          type="text"
          placeholder="Cast (comma-separated, e.g. Christian Bale, Heath Ledger)"
          value={cast}
          onChange={(e) => setCast(e.target.value)}
          className="form-input form-textarea"
          style={{ gridColumn: "1 / -1" }}
        />

        {/* Row 4: Synopsis */}
        <textarea
          placeholder="Synopsis"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          className="form-input form-textarea"
          rows="3"
          required
        />

        <button type="submit" className="btn-add-movie">
          ➕ Add Movie
        </button>

      </form>
    </div>
  );
}

export default AddMovieForm;
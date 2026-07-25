import { useState } from "react";
import { useMovie } from "../context/MovieContext";
import { Link } from "react-router-dom";

function MovieDetail({ movie, watchlist, toggleWatchlist, onClose }) {
  const { isAuthenticated, addReview, user } = useMovie();

  const isWatchlisted = watchlist.some(
    (item) => (item._id || item.id) === (movie._id || movie.id)
  );

  const [rating, setRating] = useState(8);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMsg({ text: "", type: "" });

    if (!comment.trim()) {
      setReviewMsg({ text: "Please enter a comment.", type: "error" });
      return;
    }

    setSubmitting(true);
    const targetId = movie._id || movie.id;
    const res = await addReview(targetId, Number(rating), comment);
    setSubmitting(false);

    if (res.success) {
      setReviewMsg({ text: "Review added! Average rating updated.", type: "success" });
      setComment("");
    } else {
      setReviewMsg({ text: res.message || "Failed to submit review.", type: "error" });
    }
  };

  return (
    <div className="movie-detail">
      {/* Header bar */}
      <div className="detail-top-bar">
        <h3>Movie Details</h3>
        <button className="detail-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Poster + Info side by side */}
      <div className="detail-content">
        <div className="detail-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>

        <div className="detail-info">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <h2 className="detail-title">{movie.title}</h2>
            <span className="detail-rating-pill">⭐ {movie.avgRating || movie.rating || 0} / 10</span>
          </div>

          <div className="detail-meta">
            <div className="detail-meta-row">
              <span className="meta-label">Genre:</span>
              <span className="meta-value">{movie.genre}</span>
            </div>
            <div className="detail-meta-row">
              <span className="meta-label">Year:</span>
              <span className="meta-value">{movie.year}</span>
            </div>
            <div className="detail-meta-row">
              <span className="meta-label">Director:</span>
              <span className="meta-value">{movie.director}</span>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title">Synopsis</div>
            <p className="detail-synopsis">{movie.synopsis}</p>
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-title">Cast</div>
              <div className="cast-chips">
                {movie.cast.map((actor, i) => (
                  <span key={i} className="cast-chip">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Watchlist status */}
      <div
        className={`watchlist-status ${
          isWatchlisted ? "in-list" : "not-in-list"
        }`}
        style={{ margin: "16px 0" }}
      >
        <span className={`status-text ${isWatchlisted ? "in" : "out"}`}>
          {isWatchlisted ? "❤️ In Your Watchlist" : "🎬 Not in Watchlist"}
        </span>
        <button
          className={`btn-toggle-watchlist ${
            isWatchlisted ? "remove" : "add"
          }`}
          onClick={() => toggleWatchlist(movie)}
        >
          {isWatchlisted ? "🗑 Remove from Watchlist" : "+ Add to Watchlist"}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section" style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <h4 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>💬 User Reviews ({movie.reviews?.length || 0})</span>
          <span style={{ fontSize: "0.9rem", color: "#e5a00d" }}>Avg: ⭐ {movie.avgRating || 0}</span>
        </h4>

        {/* Existing Reviews List */}
        <div className="reviews-list" style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", marginBottom: "16px" }}>
          {movie.reviews && movie.reviews.length > 0 ? (
            movie.reviews.map((rev, idx) => (
              <div key={idx} style={{ background: "rgba(255, 255, 255, 0.05)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "bold", color: "#e0e0e0" }}>👤 {rev.user || "Anonymous"}</span>
                  <span style={{ color: "#f39c12", fontWeight: "bold" }}>⭐ {rev.rating}/10</span>
                </div>
                <p style={{ fontSize: "0.9rem", margin: 0, color: "#d0d0d0" }}>"{rev.comment}"</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>No reviews yet. Be the first to leave a review!</p>
          )}
        </div>

        {/* Add Review Form (Scoped to logged-in user) */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} style={{ background: "rgba(0, 0, 0, 0.2)", padding: "14px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <h5 style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>✍️ Leave a Review as {user?.name || user?.email}</h5>

            {reviewMsg.text && (
              <div style={{
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                background: reviewMsg.type === "success" ? "rgba(46, 204, 113, 0.2)" : "rgba(231, 76, 60, 0.2)",
                color: reviewMsg.type === "success" ? "#2ecc71" : "#e74c3c",
                border: `1px solid ${reviewMsg.type === "success" ? "#2ecc71" : "#e74c3c"}`
              }}>
                {reviewMsg.text}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem" }}>Rating (0-10):</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={{ width: "70px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #444", background: "#111", color: "#fff" }}
                required
              />
              <span style={{ fontSize: "0.85rem", color: "#f39c12" }}>⭐ {rating}/10</span>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <textarea
                placeholder="Write your review comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#111", color: "#fff", resize: "vertical", fontSize: "0.9rem" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 16px",
                background: "#e50914",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div style={{ padding: "12px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", textAlign: "center", fontSize: "0.9rem" }}>
            🔒 <Link to="/login" style={{ color: "#3498db", textDecoration: "underline" }}>Log in</Link> to write a review and update avg rating.
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
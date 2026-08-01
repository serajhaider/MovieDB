import { useState } from "react";
import { useMovie } from "../context/MovieContext";
import { Link } from "react-router-dom";

function MovieDetail({ movie, onClose }) {
  const { isAuthenticated, addReview, user, watchlist, toggleWatchlist } = useMovie();

  const targetId = movie._id || movie.id;
  const isWatchlisted = watchlist.some(
    (item) => (item._id || item.id) === targetId
  );

  const [rating, setRating] = useState(8.5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });

  const fallbackPoster = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMsg({ text: "", type: "" });

    if (!comment.trim()) {
      setReviewMsg({ text: "Please enter a comment for your review.", type: "error" });
      return;
    }

    setSubmitting(true);
    const res = await addReview(targetId, Number(rating), comment);
    setSubmitting(false);

    if (res.success) {
      setReviewMsg({ text: "Review published! Movie score updated.", type: "success" });
      setComment("");
    } else {
      setReviewMsg({ text: res.message || "Failed to submit review.", type: "error" });
    }
  };

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-modal" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="detail-close-btn" onClick={onClose} aria-label="Close">
          x
        </button>

        {/* Hero Header Banner */}
        <div className="detail-hero-banner">
          <img
            src={movie.poster || fallbackPoster}
            alt={movie.title}
            className="detail-hero-bg"
            onError={(e) => { e.target.src = fallbackPoster; }}
          />
          <div className="hero-gradient-overlay"></div>

          <div className="hero-content">
            {movie.featured && <span className="featured-chip">Featured Blockbuster</span>}
            <h1 className="hero-title">{movie.title}</h1>

            <div className="hero-meta-row">
              <span className="meta-badge genre">{movie.genre}</span>
              <span className="meta-badge year">{movie.year}</span>
              <span className="meta-badge rating">{movie.avgRating || movie.rating || 0} / 10</span>
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="detail-modal-body">
          <div className="detail-grid">

            {/* Left Column: Poster + Actions */}
            <div className="detail-left-col">
              <img
                src={movie.poster || fallbackPoster}
                alt={movie.title}
                className="detail-poster-img"
                onError={(e) => { e.target.src = fallbackPoster; }}
              />

              <button
                className={`btn-detail-watchlist ${isWatchlisted ? "remove" : "add"}`}
                onClick={() => toggleWatchlist(movie)}
              >
                {isWatchlisted ? "In Watchlist (Remove)" : "+ Add to Watchlist"}
              </button>
            </div>

            {/* Right Column: Information & Cast */}
            <div className="detail-right-col">

              <div className="info-block">
                <h3>Director</h3>
                <p className="director-name">{movie.director}</p>
              </div>

              <div className="info-block">
                <h3>Synopsis</h3>
                <p className="synopsis-text">{movie.synopsis || "No synopsis available."}</p>
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div className="info-block">
                  <h3>Cast &amp; Crew</h3>
                  <div className="cast-chips-grid">
                    {movie.cast.map((actor, idx) => (
                      <span key={idx} className="cast-chip-tag">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="detail-section-divider" />

          {/* User Reviews Section */}
          <div className="reviews-section-container">
            <div className="reviews-header">
              <h2>User Reviews ({movie.reviews?.length || 0})</h2>
              <div className="score-summary">
                Average Rating: <strong>{movie.avgRating || 0} / 10</strong>
              </div>
            </div>

            {/* Existing Reviews List */}
            <div className="reviews-feed">
              {movie.reviews && movie.reviews.length > 0 ? (
                movie.reviews.map((rev, idx) => (
                  <div key={idx} className="review-card-item">
                    <div className="review-card-header">
                      <span className="reviewer-name">{rev.user || "Anonymous"}</span>
                      <span className="review-rating-score">{rev.rating} / 10</span>
                    </div>
                    <p className="review-comment-text">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews-state">
                  <p>No reviews yet for this movie. Be the first to leave your thoughts!</p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="add-review-card-form">
                <h3>Leave a Review as {user?.name || user?.email}</h3>

                {reviewMsg.text && (
                  <div className={`review-alert ${reviewMsg.type}`}>
                    {reviewMsg.text}
                  </div>
                )}

                <div className="rating-input-row">
                  <label htmlFor="rating-range">Rating Score (0 to 10):</label>
                  <input
                    id="rating-range"
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="rating-slider"
                  />
                  <span className="rating-slider-value">{rating} / 10</span>
                </div>

                <div className="form-group">
                  <textarea
                    placeholder="Write your review and thoughts about the movie..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    className="form-input text-area"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-submit-review"
                >
                  {submitting ? "Publishing Review..." : "Publish Review"}
                </button>
              </form>
            ) : (
              <div className="login-prompt-box">
                Want to review this movie? <Link to="/login">Sign in to your account</Link> to rate &amp; comment.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
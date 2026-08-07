import { useState } from "react";
import axios from "axios";
import { useMovie } from "../context/MovieContext";

const VITE_API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AI_API = `${VITE_API.replace(/\/$/, '')}/api/ai`;

function AIRecommender({ watchlist }) {
  const { token, movies, setSelectedMovie, showToast } = useMovie();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  // Teacher's pattern: summaries state + loadingTaskId
  const [summaries, setSummaries] = useState({});
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const handleRecommend = async () => {
    if (!token) {
      showToast("Please sign in to get AI recommendations", "warning");
      return;
    }

    setLoading(true);
    setError(null);
    setHasRun(true);

    // Extract genres from watchlist
    const favouriteGenres = [...new Set(watchlist.map(m => m.genre).filter(Boolean))];

    try {
      const response = await axios.post(
        `${AI_API}/recommend`,
        { favouriteGenres, watchlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      console.error("AI Recommendation Error:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to get recommendations.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Teacher's summarizeTask pattern
  const expandMovie = async (idx) => {
    setLoadingTaskId(idx);
    try {
      setSummaries(prev => ({
        ...prev,
        [idx]: recommendations[idx]?.reason
      }));
    } catch (err) {
      console.error("Error expanding movie:", err);
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="ai-recommender-section">
      {/* Header */}
      <div className="ai-recommender-header">
        <div className="ai-header-text">
          <h3 className="ai-section-title">AI Movie Recommender</h3>
          <p className="ai-section-sub">
            Powered by Google Gemini — personalized picks based on your watchlist
          </p>
        </div>
        <button
          className={`btn-ai-recommend ${loading ? "loading" : ""}`}
          onClick={handleRecommend}
          disabled={loading}
        >
          {loading ? (
            <span className="ai-btn-inner">
              <span className="ai-spinner"></span>
              Thinking...
            </span>
          ) : (
            <span className="ai-btn-inner">
              <span className="ai-gemini-icon">AI</span>
              Recommend Me Something
            </span>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="ai-error-card">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="ai-loading-panel">
          <div className="ai-loading-spinner"></div>
          <p>Gemini is analyzing your taste...</p>
        </div>
      )}

      {/* Recommendations Panel */}
      {!loading && recommendations.length > 0 && (
        <div className="ai-results-panel">
          <p className="ai-results-label">Gemini recommends these 3 movies for you:</p>
          <div className="ai-cards-grid">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="ai-rec-card">
                {/* Movie Poster */}
                {rec.movie?.poster && (
                  <div className="ai-rec-poster-wrap">
                    <img
                      src={rec.movie.poster}
                      alt={rec.title}
                      className="ai-rec-poster"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="ai-rec-content">
                  <div className="ai-rec-meta">
                    {rec.movie && (
                      <span className="ai-rec-genre-badge">{rec.movie.genre}</span>
                    )}
                    {rec.movie?.year && (
                      <span className="ai-rec-year">{rec.movie.year}</span>
                    )}
                    {rec.movie?.avgRating && (
                      <span className="ai-rec-rating">{rec.movie.avgRating} / 10</span>
                    )}
                  </div>

                  <h4 className="ai-rec-title">{rec.title}</h4>

                  {/* Teacher's summaries pattern */}
                  <div className="ai-reason-box">
                    <span className="ai-reason-label">Why Gemini picked this:</span>
                    <p className="ai-reason-text">{rec.reason}</p>
                  </div>

                  {rec.movie && (
                    <button
                      className="btn-ai-view-movie"
                      onClick={() => setSelectedMovie(rec.movie)}
                    >
                      View Details
                    </button>
                  )}
                </div>

                <div className="ai-rec-badge">AI Pick #{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state after run with no results */}
      {!loading && hasRun && recommendations.length === 0 && !error && (
        <div className="ai-empty-state">
          <p>No recommendations returned. Try adding movies to your watchlist first.</p>
        </div>
      )}
    </div>
  );
}

export default AIRecommender;

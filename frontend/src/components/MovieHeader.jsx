function MovieHeader({ title, subtitle, children }) {
  return (
    <div className="movie-header">
      <div className="movie-header-text">
        <h1 className="movie-header-title">{title}</h1>
        {subtitle && <p className="movie-header-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="movie-header-actions">{children}</div>}
    </div>
  );
}

export default MovieHeader;

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrap">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search movies by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
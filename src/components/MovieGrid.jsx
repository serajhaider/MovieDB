import movies from "../data/movies";
import MovieCard from "./MovieCard";

function MovieGrid() {
  return (
    <section className="max-w-[1700px] mx-auto px-10 py-12">
      <h1 className="text-6xl font-bold text-center mb-14">
        Popular Movies
      </h1>

      <div className="flex justify-center gap-8 flex-wrap">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;
import RatingBadge from "./RatingBadge";

function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      <div className="overflow-hidden">

        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-[430px] object-cover hover:scale-110 duration-500"
        />

      </div>

      <div className="p-6">

        <h2 className="text-3xl font-bold mb-4">
          {movie.title}
        </h2>

        <p className="mb-2">
          <strong>Genre:</strong> {movie.genre}
        </p>

        <p className="mb-4">
          <strong>Year:</strong> {movie.year}
        </p>

        <RatingBadge rating={movie.rating} />

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold">
          View Details
        </button>

      </div>

    </div>
  );
}

export default MovieCard;
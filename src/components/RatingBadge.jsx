function RatingBadge({ rating }) {
  let color = "";

  if (rating >= 8) {
    color = "bg-green-500";
  } else if (rating >= 5) {
    color = "bg-yellow-500";
  } else {
    color = "bg-red-500";
  }

  return (
    <span
      className={`${color} text-white px-3 py-1 rounded-full text-sm font-bold`}
    >
      ⭐ {rating}
    </span>
  );
}

export default RatingBadge;
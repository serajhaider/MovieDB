function RatingBadge({ rating }) {
  const cls =
    rating >= 8 ? "card-rating high" : rating >= 5 ? "card-rating mid" : "card-rating low";

  return (
    <span className={cls}>
      ⭐ {rating}
    </span>
  );
}

export default RatingBadge;
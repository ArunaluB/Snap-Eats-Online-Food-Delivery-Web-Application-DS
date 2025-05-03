import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Review {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  active: boolean;
}

export default function MenuItemReviews() {
  const { menuItemId } = useParams<{ menuItemId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!menuItemId) return;

      try {
        const res = await fetch(
          `http://localhost:8222/restaurant-service/api/reviews/target/${menuItemId}`
        );
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [menuItemId]);

  if (loading) return <p className="text-center mt-4">Loading reviews...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet for this item.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">{review.userName}</span>
                <span className="text-yellow-600 font-medium">
                  ⭐ {review.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

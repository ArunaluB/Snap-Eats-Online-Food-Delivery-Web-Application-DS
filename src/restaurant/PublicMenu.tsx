import { useEffect, useState } from "react";
import { MenuItem } from "./MenuItem";
import { useNavigate } from "react-router-dom";

export default function PublicMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(
          "http://localhost:8222/restaurant-service/api/menu-items/restaurant/67fde55233027910028186e3"
        );
        const data = await res.json();
        setItems(data);

        const reviewMap: Record<string, number> = {};

        await Promise.all(
          data.map(async (item: MenuItem) => {
            try {
              const res = await fetch(
                `http://localhost:8222/restaurant-service/api/reviews/target/${item.id}`
              );
              const reviews = await res.json();
              reviewMap[item.id] = reviews.length;
            } catch {
              reviewMap[item.id] = 0;
            }
          })
        );

        setReviewCounts(reviewMap);
      } catch (err) {
        console.error("Failed to fetch menu items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading menu...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items
        .filter((item) => item.available)
        .map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={item.imageUrls[0]}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  Rs. {item.price.toFixed(2)}
                </span>

                <span
                  className="flex items-center gap-1 text-yellow-600 font-medium cursor-pointer"
                  onClick={() => navigate(`/restaurant/review/${item.id}`)}
                >
                  ⭐ 4.8{" "}
                  <span className="text-gray-500 text-xs">
                    ({reviewCounts[item.id] ?? 0})
                  </span>
                </span>


                {item.discountPrice > 0 && (
                  <span className="text-green-600 font-medium">
                    -{item.discountPrice.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

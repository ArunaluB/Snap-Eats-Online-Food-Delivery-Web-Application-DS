// src/components/RestaurantList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RestaurantCard from "./RestaurantCard";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  latitude: number;
  longitude: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: Address;
  cuisineType: string;
  phoneNumber: string;
  email: string;
  averageRating: number;
  reviewCount: number;
  estimatedDeliveryTime: number;
  deliveryFee: number;
  operatingHours: string[];
  imageUrls: string[];
  logoUrl: string;
  isPromoted: boolean;
  dietaryPreferences: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:8222/restaurant-service/api/restaurants");
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleCardClick = (shopid: string) => {
    navigate(`/fod-order/Shop/${shopid}`); // Navigate to the shop page
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <input
        type="text"
        placeholder="Search restaurants or addresses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-6 border rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurantId={restaurant.id} // Pass the restaurant id
              name={restaurant.name}
              address={`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zipCode}`}
              imageUrl={restaurant.imageUrls[0] || restaurant.logoUrl}
              rating={restaurant.averageRating}
              onClick={() => handleCardClick(restaurant.id)} // Pass the click handler
            />
          ))
        ) : (
          <div className="col-span-full text-center">No restaurants found</div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
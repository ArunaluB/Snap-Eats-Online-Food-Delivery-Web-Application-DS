// src/components/RestaurantCard.tsx
import React from "react";

interface RestaurantCardProps {
  restaurantId: string; // Add id prop
  name: string;
  address: string;
  imageUrl: string;
  rating: number;
  onClick?: () => void; // Add onClick prop
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurantId, name, address, imageUrl, rating, onClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick} // Make the card clickable
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()} // Support keyboard navigation
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-40 w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
        }}
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-500 text-sm">{address}</p>
        <p className="text-yellow-500 mt-2">⭐ {rating}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
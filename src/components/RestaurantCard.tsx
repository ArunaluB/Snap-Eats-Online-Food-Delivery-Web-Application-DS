// src/components/RestaurantCard.tsx
import React from "react";

interface RestaurantCardProps {
  name: string;
  address: string;
  imageUrl: string;
  rating: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ name, address, imageUrl, rating }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
      <img src={imageUrl} alt={name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-500 text-sm">{address}</p>
        <p className="text-yellow-500 mt-2">⭐ {rating}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;

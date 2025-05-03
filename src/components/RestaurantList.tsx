// src/components/RestaurantList.tsx
import React, { useState } from "react";
import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    id: 1,
    name: "Burger Palace",
    address: "123 Main Street",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Pizza World",
    address: "456 Elm Avenue",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp6CYX_4_hlMp0gqOOXOtClqs8ETXjcAkVOw&s",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Sushi Central",
    address: "789 Oak Drive",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvzFs7NFL1a-FYKJFtbyM2XLbicbZ6TWCrew&s",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Taco Fiesta",
    address: "321 Pine Lane",
    imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA==",
    rating: 4.3,
  },
  {
    id: 5,
    name: "Healthy Bites",
    address: "654 Cedar Road",
    imageUrl: "data:image/jpeg;bq9UIYYjqPyFYHt+Ver1UESAV4x1r1eqFGDbXrUZsDrWa9RAnlsr5V42BXq9ULIzgx/c1kYU/2K9Xqoh//9k=",
    rating: 4.7,
  },
  {
    id: 2,
    name: "Pizza Hut",
    address: "456 Elm Avenue",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVWGXWBXvY1FfR57LZWUJlZUCO0fllZoMag&s",
    rating: 4.2,
  },
];

const RestaurantList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            imageUrl={restaurant.imageUrl}
            rating={restaurant.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;

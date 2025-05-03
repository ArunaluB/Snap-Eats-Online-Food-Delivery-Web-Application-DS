import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Eye, EyeOff } from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark: string;
  latitude: number;
  longitude: number;
}

interface RestaurantData {
  name: string;
  password: string;
  address: Address;
  cuisineType: string;
  phoneNumber: string;
  email: string;
  operatingHours: string[];
  averageRating: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  imageUrls: string[];
  logoUrl: string;
  isPromoted: boolean;
  dietaryPreferences: string[];
}

const RestaurantRegistration: React.FC = () => {
  const [formData, setFormData] = useState<RestaurantData>({
    name: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: '',
      latitude: 0,
      longitude: 0,
    },
    cuisineType: '',
    phoneNumber: '',
    email: '',
    operatingHours: [''],
    averageRating: 0,
    deliveryFee: 0,
    estimatedDeliveryTime: 0,
    imageUrls: [''],
    logoUrl: '',
    isPromoted: false,
    dietaryPreferences: [],
  });

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA'; // Replace with your token

    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [79.8612, 6.9271], // Colombo, Sri Lanka
      zoom: 12,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: 'Search location',
    });

    mapInstance.addControl(geocoder);

    geocoder.on('result', (e: { result: { geometry: { coordinates: [number, number] } } }) => {
      const coords = e.result.geometry.coordinates;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          latitude: coords[1],
          longitude: coords[0],
        },
      }));
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
    nestedField?: keyof Address
  ) => {
    if (nestedField) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [nestedField]: e.target.value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: 'operatingHours' | 'imageUrls' | 'dietaryPreferences'
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8222/restaurant-service/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Restaurant registered successfully!');
      } else {
        alert('Failed to register restaurant.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while registering the restaurant.');
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Registration</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4">
          <div>
            <label className="block text-sm font-medium">Restaurant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
                className="w-full p-2 pr-10 border rounded"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleInputChange(e, 'address', 'street')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleInputChange(e, 'address', 'city')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleInputChange(e, 'address', 'state')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange(e, 'address', 'zipCode')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Landmark</label>
            <input
              type="text"
              value={formData.address.landmark}
              onChange={(e) => handleInputChange(e, 'address', 'landmark')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              value={formData.address.latitude}
              onChange={(e) => handleInputChange(e, 'address', 'latitude')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              value={formData.address.longitude}
              onChange={(e) => handleInputChange(e, 'address', 'longitude')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cuisine Type</label>
            <select
              value={formData.cuisineType}
              onChange={(e) => handleInputChange(e, 'cuisineType')}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Cuisine</option>
              <option value="INDIAN">Indian</option>
              <option value="AMERICAN">American</option>
              <option value="ITALIAN">Italian</option>
              <option value="CHINESE">Chinese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l border border-r-0 bg-gray-100 text-gray-700 text-sm">
                +94
              </span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{9}" // Optional: enforce 9 digits for Sri Lankan numbers
                value={formData.phoneNumber.replace("+94", "")} // only store the part after +94
                onChange={(e) => handleInputChange({
                  ...e,
                  target: { ...e.target, value: "+94" + e.target.value }
                }, 'phoneNumber')}
                className="w-full p-2 border border-l-0 rounded-r"
                placeholder="771234567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Operating Hours</label>
            <input
              type="text"
              value={formData.operatingHours[0]}
              onChange={(e) => handleArrayInputChange(e, 0, 'operatingHours')}
              className="w-full p-2 border rounded"
              placeholder="e.g., Mon-Sun: 11AM-10PM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Average Rating</label>
            <input
              type="number"
              step="0.1"
              value={formData.averageRating}
              onChange={(e) => handleInputChange(e, 'averageRating')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Delivery Fee</label>
            <input
              type="number"
              step="0.01"
              value={formData.deliveryFee}
              onChange={(e) => handleInputChange(e, 'deliveryFee')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Estimated Delivery Time (minutes)</label>
            <input
              type="number"
              value={formData.estimatedDeliveryTime}
              onChange={(e) => handleInputChange(e, 'estimatedDeliveryTime')}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="url"
              value={formData.imageUrls[0]}
              onChange={(e) => handleArrayInputChange(e, 0, 'imageUrls')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Logo URL</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleInputChange(e, 'logoUrl')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dietary Preferences</label>
            <input
              type="text"
              value={formData.dietaryPreferences[0] || ''}
              onChange={(e) => handleArrayInputChange(e, 0, 'dietaryPreferences')}
              className="w-full p-2 border rounded"
              placeholder="e.g., VEGAN, GLUTEN_FREE"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPromoted}
              onChange={(e) => setFormData({ ...formData, isPromoted: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium">Promoted</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register Restaurant
          </button>
        </form>
        <div className="w-full md:w-1/2">
          <div id="map" className="h-[500px] w-full rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegistration;

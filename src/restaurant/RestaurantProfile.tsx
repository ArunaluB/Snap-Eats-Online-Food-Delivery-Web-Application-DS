import { useState } from 'react';
import {
  Phone, MapPin, Mail, Globe, Clock, Pencil,
} from 'lucide-react';
import restaurantImage from '../assets/rest.jpg';

export default function RestaurantProfile() {
  const [formData] = useState({
    name: 'Mango Jango',
    email: 'hello@mangjango.com',
    phone: '+94 712345678',
    address: '45 Flower Road, Colombo 07',
    website: 'www.mangojango.com',
    cuisine: 'Sri Lankan',
    rating: 4.3,
    openHours: '8:00 AM - 10:00 PM',
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row p-8 gap-10 items-center md:items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0 md:ml-[-1rem]">
          <img
            src={restaurantImage}
            alt="Restaurant Logo"
            className="w-56 h-56 object-cover rounded-full border"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-start w-full">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">{formData.name}</h2>
              <p className="text-md text-gray-500">{formData.cuisine} Cuisine</p>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-medium text-sm">Rating</p>
              <p className="text-2xl font-bold text-gray-700 flex items-center gap-1">
                {formData.rating} <span className="text-yellow-500">⭐</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            {/* Phone */}
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold flex justify-between">
                  Phone:
                  <button><Pencil size={14} className="text-gray-500 hover:text-blue-500" /></button>
                </p>
                <p>{formData.phone}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold flex justify-between">
                  Address:
                  <button><Pencil size={14} className="text-gray-500 hover:text-blue-500" /></button>
                </p>
                <p>{formData.address}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 mt-2 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold flex justify-between">
                  Email:
                  <button><Pencil size={14} className="text-gray-500 hover:text-blue-500" /></button>
                </p>
                <p className="text-blue-600">{formData.email}</p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-2">
              <Globe className="w-5 h-5 mt-2 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold flex justify-between">
                  Website:
                  <button><Pencil size={14} className="text-gray-500 hover:text-blue-500" /></button>
                </p>
                <a
                  href={`https://${formData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {formData.website}
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold flex justify-between">
                  Opening Hours:
                  <button><Pencil size={14} className="text-gray-500 hover:text-blue-500" /></button>
                </p>
                <p>{formData.openHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

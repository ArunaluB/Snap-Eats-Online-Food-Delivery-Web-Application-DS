import { useEffect, useState } from 'react';
import {
  Phone, MapPin, Mail, Globe, Clock, Landmark, LocateFixed, Map, Edit
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import OnlineToggleButton from "./OnlineToggleButton"; // path as needed
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await fetch("http://localhost:8222/restaurant-service/api/restaurants/67fde55233027910028186e3");
      const data = await res.json();
      setRestaurant(data);
      setForm(data);
    };
    fetchRestaurant();
  }, []);

  const handleUpdate = async () => {
    await fetch("http://localhost:8222/restaurant-service/api/restaurants/67fde55233027910028186e3", {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setIsModalOpen(false);
    setRestaurant(form);
  };

  if (!restaurant) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row p-8 gap-10 items-center md:items-start">
        {/* Profile Image */}
        <div className="flex-shrink-0 md:ml-[-1rem] relative">
          <img
            src={restaurant.logoUrl}
            alt="Restaurant Logo"
            className="w-56 h-56 object-cover rounded-full border"
          />
          <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${restaurant.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-start w-full">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
                {restaurant.name}
                <button onClick={() => setIsModalOpen(true)}>
                  <Edit className="w-5 h-5 text-gray-500 hover:text-blue-500" />
                </button>
              </h2>
              <p className="text-md text-gray-500">{restaurant.cuisineType} Cuisine</p>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-medium text-sm">Rating</p>
              <p className="text-2xl font-bold text-gray-700 flex items-center gap-1">
                {restaurant.averageRating} <span className="text-yellow-500">⭐</span>
              </p>
            </div>
          </div>

          <OnlineToggleButton
            isActive={restaurant.active}
            onToggle={(newStatus) => setRestaurant({ ...restaurant, active: newStatus })}
          />

          <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Phone:</p>
                <p>{restaurant.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Street:</p>
                <p>{restaurant.address.street}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Landmark className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Landmark:</p>
                <p>{restaurant.address.landmark}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Map className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">City/State/Zip:</p>
                <p>{restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <LocateFixed className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Coordinates:</p>
                <p>{restaurant.address.latitude}, {restaurant.address.longitude}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 mt-2 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Email:</p>
                <p className="text-blue-600">{restaurant.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Globe className="w-5 h-5 mt-2 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Website:</p>
                <p className="text-gray-500">-</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 mt-3 text-gray-500" />
              <div className="flex-1">
                <p className="font-semibold">Opening Hours:</p>
                <p>{restaurant.operatingHours.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-xl p-6 rounded shadow">
            <Dialog.Title className="text-xl font-semibold mb-4">Edit Restaurant Info</Dialog.Title>
            <div className="space-y-4">
              <label className="block">
                Name:
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded mt-1"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                Email:
                <input
                  type="email"
                  className="w-full border px-3 py-1 rounded mt-1"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block">
                Phone Number:
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded mt-1"
                  value={form.phoneNumber || ''}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
              </label>
              <label className="block">
                Operating Hours:
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded mt-1"
                  value={form.operatingHours?.[0] || ''}
                  onChange={(e) => setForm({ ...form, operatingHours: [e.target.value] })}
                />
              </label>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-1 rounded border">Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
}

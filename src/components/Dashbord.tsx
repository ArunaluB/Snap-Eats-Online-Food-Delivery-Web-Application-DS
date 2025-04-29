import { SearchIcon, MapPinIcon } from 'lucide-react';
export const Dashbord = () => {
  return <div className="relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80" alt="Delicious food spread" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="md:w-3/5">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Craving something delicious? We've got you covered.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Browse your favorite eateries and enjoy real-time delivery tracking, 24/7.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="font-medium mb-4 text-gray-900">
              Find restaurants near you
            </h3>
            <div className="space-y-4">
              <div className="flex items-center border-b border-gray-200 pb-2">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input type="text" placeholder="Enter your delivery address" className="w-full focus:outline-none text-gray-700" />
              </div>
              <div className="flex items-center border-b border-gray-200 pb-2">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input type="text" placeholder="Search for restaurants or cuisines" className="w-full focus:outline-none text-gray-700" />
              </div>
              <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition">
                Find Food
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
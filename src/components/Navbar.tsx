import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [] = useState(false);
  const isSignedIn = false;
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-yellow-500 cursor-pointer" onClick={() => navigate("/")}>Snap Eats</span>
          </div>
          <div className="flex items-center space-x-8">
            <button onClick={() => navigate("/")} className="text-gray-700 hover:text-yellow-500 font-medium">
              Restaurants
            </button>
            <button onClick={() => navigate("/deals")} className="text-gray-700 hover:text-yellow-500 font-medium">
              Deals
            </button>
            <button onClick={() => navigate("/partner")} className="text-gray-700 hover:text-yellow-500 font-medium">
              Partner with us
            </button>
            <button onClick={() => navigate("/About")} className="text-gray-700 hover:text-yellow-500 font-medium">
              About
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <button onClick={() => navigate("/login")} className="px-4 py-2 rounded text-gray-700 hover:text-yellow-500 font-medium">
                  Login
                </button>
                <button onClick={() => navigate("/customer-register")} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition">
                  Sign Up
                </button>
              </>
            ) : (
              <button className="px-4 py-2 text-gray-700 hover:text-yellow-500 font-medium">
                My Account
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

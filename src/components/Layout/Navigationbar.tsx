import { BellIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navigationbar() {
  const location = useLocation();

  const [user, setUser] = useState<null | { name: string; image: string }>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('driver');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ? 'text-yellow-600 font-semibold' : 'text-gray-600';

  const handleSignOut = () => {
    localStorage.removeItem('driver');
    setUser(null);
    // Optional: redirect to login page after logout
    // navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <span className="text-2xl font-bold text-yellow-500">Snap Eats Driver</span>

          {/* Nav Links */}
          <div className="text-gray-700 hover:text-yellow-500 font-medium">
            <Link to="/" className={`px-3 py-2 ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/orders" className={`px-3 py-2 ${isActive('/orders')}`}>
              Orders
            </Link>
            <Link to="/earnings" className={`px-3 py-2 ${isActive('/earnings')}`}>
              Earnings
            </Link>
            <Link to="/profile" className={`px-3 py-2 ${isActive('/profile')}`}>
              Profile
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative focus:outline-none">
              <BellIcon className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>

            {/* If user is logged in */}
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // If no user logged in
              <>
                <Link to="/login">
                  <button className="px-4 py-2 rounded text-gray-700 hover:text-yellow-500 font-medium flex items-center">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

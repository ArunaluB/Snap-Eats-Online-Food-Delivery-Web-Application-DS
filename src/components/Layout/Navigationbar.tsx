import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navigationbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Add this line

  const [user, setUser] = useState<null | { username: string; profileImage: string }>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUser({
          username: parsed.username,
          profileImage: parsed.profileImage,
        });
      } catch (err) {
        console.error('Error parsing authData:', err);
      }
    }
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ? 'text-yellow-600 font-semibold' : 'text-gray-600';

  const handleSignOut = () => {
    localStorage.removeItem('authData');
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-500">Snap Eats Driver</span>

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

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.profileImage}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-700 font-medium">{user.username}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
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

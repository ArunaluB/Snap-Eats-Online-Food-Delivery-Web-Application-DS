import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from './fod-order/shop/Cart';

export const Navbar = () => {
  const [user, setUser] = useState<null | { name: string; role: string; userId: string }>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      setUser({ name: parsed.username, role: parsed.role, userId: parsed.id });
    }
  }, []);

  const isLoggedIn = !!user;
  const isUser = user?.role === "USER";
  const isRestaurant = user?.role === "RESTAURANT";
  const userId = user?.userId; // Replace with dynamic ID if needed

  const handleSignOut = () => {
    localStorage.removeItem('authData');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handlePendingOrders = () => {
    navigate(`/fod-order/latest-order/${userId}`);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span
              className="text-2xl font-bold text-yellow-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Snap Eats
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {isRestaurant && (
              <>
                <button onClick={() => navigate("/restaurant/profile")} className="text-gray-700 hover:text-yellow-500 font-medium">
                  Profile
                </button>
                <button onClick={() => navigate("/restaurant/menu")} className="text-gray-700 hover:text-yellow-500 font-medium">
                  Add Menu
                </button>
                <button onClick={() => navigate("/restaurant/viewmenus")} className="text-gray-700 hover:text-yellow-500 font-medium">
                  View Menus
                </button>
                <button onClick={() => navigate("/restaurant/public-menu")} className="text-gray-700 hover:text-yellow-500 font-medium">
                  Public Menu
                </button>
                <button onClick={() => navigate("/restaurant/orders")} className="text-gray-700 hover:text-yellow-500 font-medium">
                  Orders
                </button>
              </>
            )}

            {/* Show 'Restaurants' to everyone if not logged in or if role is USER */}
            {(!isLoggedIn || isUser) && (
              <button onClick={() => navigate("/restaurant/shops")} className="text-gray-700 hover:text-yellow-500 font-medium">
                Restaurants
              </button>
            )}
          </div>

          <button onClick={() => navigate("/fod-order/about-us")} className="text-gray-700 hover:text-yellow-500 font-medium">
            About Us
          </button>
          <button onClick={() => navigate("/fod-order/contact-us")} className="text-gray-700 hover:text-yellow-500 font-medium">
            Contact Us
          </button>

          {/* Right-side actions */}
          <div className="flex items-center">
            {isUser && (
              <div className="ml-4 relative">
                <button
                  className="flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
                  onClick={handlePendingOrders}
                >
                  <span className="material-symbols-outlined text-sm mr-1">pending_actions</span>
                  <span className="text-sm font-medium">Pending Orders</span>
                </button>
              </div>
            )}

            {isUser && (
              <div className="ml-4 relative">
                <button
                  className="relative hover:bg-gray-100 p-2 rounded-full transition-colors"
                  onClick={() => setCartOpen(true)}
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    1
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded text-gray-700 hover:text-yellow-500 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/customer-register")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
            {isCartOpen && <Cart onClose={() => setCartOpen(false)} userId={userId} />}
          </div>

        </div>
      </div>
    </nav>
  );
};

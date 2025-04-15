import { BellIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';

export function Navbar() {
  const location = useLocation();
  const { isSignedIn } = useUser();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-yellow-600 font-semibold' : 'text-gray-600';

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
            <button className="relative focus:outline-none">
              <BellIcon className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>

            {!isSignedIn ? (
              <>
                <SignInButton>
                  <button className="px-4 py-2 rounded text-gray-700 hover:text-yellow-500 font-medium flex items-center">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

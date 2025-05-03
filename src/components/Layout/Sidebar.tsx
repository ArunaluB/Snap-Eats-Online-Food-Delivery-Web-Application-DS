import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    name: 'Drivers',
    path: '/drivers',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Verifications',
    path: '/verifications',
    icon: <FileCheck className="h-5 w-5" />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-white h-screen border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col fixed top-0 left-0 z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="bg-blue-600 text-white p-2 rounded">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          {!collapsed && <span className="ml-2 font-semibold text-lg">Admin Portal</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-800 p-1 rounded transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${
                    collapsed ? 'justify-center' : 'justify-start'
                  } p-3 rounded-md transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
                  }`
                }
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer (Logout) */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.removeItem('authData');
            window.location.href = '/login'; // or use useNavigate
          }}
          className={`flex items-center ${
            collapsed ? 'justify-center w-full' : ''
          } text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

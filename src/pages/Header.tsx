// components/Header.jsx
import { DollarSign } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white p-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
        <div>
          <h2 className="font-medium">Driver</h2>
          <p className="text-xs text-gray-500">ID: #DR12345</p>
        </div>
      </div>
      <div className="bg-gray-100 p-2 rounded-lg">
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 text-yellow-500 mr-1" />
          <span>Today Earning</span>
        </div>
        <p className="font-bold">LKR 0.00</p>
      </div>
    </div>
  );
}
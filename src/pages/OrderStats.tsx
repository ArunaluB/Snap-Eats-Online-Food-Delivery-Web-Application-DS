// components/OrderStats.jsx
import { PackageIcon, MapIcon } from 'lucide-react';

export default function OrderStats() {
  return (
    <div className="px-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-lg shadow">
          <PackageIcon className="h-6 w-6 text-orange-500" />
          <h3 className="mt-1 font-semibold text-sm">Today's Orders</h3>
          <p className="text-xl font-bold text-gray-800">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <MapIcon className="h-6 w-6 text-blue-500" />
          <h3 className="mt-1 font-semibold text-sm">Total Distance</h3>
          <p className="text-xl font-bold text-gray-800">0 km</p>
        </div>
      </div>
    </div>
  );
}
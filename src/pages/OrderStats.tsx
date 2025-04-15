// components/OrderStats.jsx
import { useState, useEffect } from 'react';
import { PackageIcon, MapIcon, CalendarIcon, RouteIcon } from 'lucide-react';
import { OrderTrackingService } from '../utils/OrderTrackingService';

export default function OrderStats() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayDistance: 0,
    weeklyOrders: 0,
    weeklyDistance: 0
  });
  
  useEffect(() => {
    // Load stats on component mount
    const currentStats = OrderTrackingService.getStats();
    setStats({
      todayOrders: currentStats.todayOrders,
      todayDistance: currentStats.todayDistance,
      weeklyOrders: currentStats.weeklyOrders,
      weeklyDistance: currentStats.weeklyDistance
    });
  }, []);

  return (
    <div className="px-4 mt-4">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white p-4 rounded-lg shadow">
          <PackageIcon className="h-6 w-6 text-orange-500" />
          <h3 className="mt-1 font-semibold text-sm">Today's Orders</h3>
          <p className="text-xl font-bold text-gray-800">{stats.todayOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <MapIcon className="h-6 w-6 text-blue-500" />
          <h3 className="mt-1 font-semibold text-sm">Today's Distance</h3>
          <p className="text-xl font-bold text-gray-800">{stats.todayDistance.toFixed(1)} km</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-lg shadow">
          <CalendarIcon className="h-6 w-6 text-green-500" />
          <h3 className="mt-1 font-semibold text-sm">Weekly Orders</h3>
          <p className="text-xl font-bold text-gray-800">{stats.weeklyOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <RouteIcon className="h-6 w-6 text-purple-500" />
          <h3 className="mt-1 font-semibold text-sm">Weekly Distance</h3>
          <p className="text-xl font-bold text-gray-800">{stats.weeklyDistance.toFixed(1)} km</p>
        </div>
      </div>
    </div>
  );
}
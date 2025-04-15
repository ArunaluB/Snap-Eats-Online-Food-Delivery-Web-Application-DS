// components/RecentOrders.jsx
import { PackageIcon } from 'lucide-react';

interface RecentOrdersProps {
  isOnline: boolean;
  nearbyOrders: { id: string; shop: string; distance: string; amount: string }[];
  handleOrderClick: (order: { id: string; shop: string; distance: string; amount: string }) => void;
}

export default function RecentOrders({ isOnline, nearbyOrders, handleOrderClick }: RecentOrdersProps) {
  return (
    <div className="px-4 mt-4">
    <div className="bg-white rounded-lg shadow">
      <h3 className="p-4 border-b font-semibold">Recent Orders</h3>
      {isOnline && nearbyOrders.length > 0 ? (
        <div className="divide-y">
          {nearbyOrders.map(order => (
            <div
              key={order.id}
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order)}
            >
              <div>
                <h4 className="font-medium">{order.shop}</h4>
                <p className="text-sm text-gray-500">{order.distance}</p>
              </div>
              <span className="text-orange-500 font-medium">{order.amount}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <PackageIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p>No recent orders</p>
          <p className="text-sm mt-1">Go online to start receiving orders</p>
        </div>
      )}
    </div>
  </div>
  );
}
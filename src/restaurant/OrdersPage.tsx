import { useEffect, useState } from 'react';
import FilterBar from "./FilterBar";

interface OrderItem {
  id: string;
  userId: string;
  items: { itemName: string }[];
  createdAt: string;
  deliveryAddress: { city: string };
  orderStatus: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(
        'http://localhost:8222/restaurant-service/api/restaurants/orders/restaurant/67fde55233027910028186e3'
      );
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-4">
        <button className="border-b-2 border-black pb-2 font-semibold">All</button>
        <button className="text-gray-500 pb-2">Missed</button>
      </div>

      {/* FilterBar */}
      <FilterBar />

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                🍔
              </div>
              <div>
                <div className="font-semibold">{order.userId}</div>
                <div className="text-gray-500 text-sm">ABC12</div>
              </div>
            </div>

            <div>
              <div className="font-medium">
                {order.items[0]?.itemName || 'Order'} ({order.deliveryAddress.city})
              </div>
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="text-xs text-gray-700 border px-2 py-1 rounded-full">
              {order.orderStatus}
            </div>
            <button className="bg-black text-white px-4 py-1 rounded">Message</button>
          </div>
        ))}
      </div>
    </div>
  );
}
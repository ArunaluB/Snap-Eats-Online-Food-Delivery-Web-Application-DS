import { useEffect, useState } from 'react';
import FilterBar from "./FilterBar";

interface OrderItem {
  id: string;
  userId: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customizations: string[];
  }[];
  createdAt: string;
  deliveryAddress: { city: string };
  orderStatus: string;
}

interface MenuItem {
  id: string;
  imageUrls: string[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "confirmed" | "pending">("all");

  useEffect(() => {
    const fetchOrdersAndMenu = async () => {
      const [ordersRes, menuRes] = await Promise.all([
        fetch('http://localhost:8222/restaurant-service/api/restaurants/orders/restaurant/67fde55233027910028186e3'),
        fetch('http://localhost:8222/restaurant-service/api/menu-items/restaurant/67fde55233027910028186e3')
      ]);

      const ordersData = await ordersRes.json();
      const menuData: MenuItem[] = await menuRes.json();

      setOrders(ordersData);

      const map: Record<string, string> = {};
      menuData.forEach((item) => {
        map[item.id] = item.imageUrls?.[0] || '';
      });

      setImageMap(map);
    };

    fetchOrdersAndMenu();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      tab === "all" ||
      (tab === "confirmed" && order.orderStatus === "CONFIRMED") ||
      (tab === "pending" && order.orderStatus === "PENDING");

    const matchesSearch =
      order.userId.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(i => i.itemName.toLowerCase().includes(search.toLowerCase())) ||
      order.deliveryAddress.city.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex space-x-6 border-b mb-4">
        <button
          onClick={() => setTab("all")}
          className={`pb-2 font-semibold ${tab === "all" ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          All
        </button>
        <button
          onClick={() => setTab("confirmed")}
          className={`pb-2 font-semibold ${tab === "confirmed" ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`pb-2 font-semibold ${tab === "pending" ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Pending
        </button>
      </div>

      <FilterBar search={search} setSearch={setSearch} />

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border p-4 rounded-md shadow-md space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{order.userId}</div>
                <div className="text-gray-500 text-sm">{order.deliveryAddress.city}</div>
              </div>
              <div className="text-xs text-gray-700 border px-2 py-1 rounded-full">
                {order.orderStatus}
              </div>
            </div>

            {order.items.map((item, index) => {
              const imageUrl = imageMap[item.itemId] || '';

              return (
                <div key={index} className="flex items-center space-x-4">
                  {imageUrl ? (
                    <img src={imageUrl} className="w-14 h-14 object-cover rounded-md" />
                  ) : (
                    <div className="w-14 h-14 bg-orange-100 rounded-md flex items-center justify-center text-xl">🍔</div>
                  )}
                  <div>
                    <div className="font-medium text-gray-800">
                      {item.itemName} × {item.quantity}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.customizations.join(', ') || 'No customizations'}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </div>

            <div className="flex justify-end">
              <button className="bg-yellow-300 text-black px-4 py-1 rounded">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

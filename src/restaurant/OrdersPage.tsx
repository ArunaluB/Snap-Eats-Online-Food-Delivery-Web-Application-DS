import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTruck, FaTimes } from 'react-icons/fa';
import FilterBar from '../restaurant/FilterBar'; // Optional if used for tabs/search

// Mock order data
const mockOrders = [
  {
    id: "order1001",
    userId: "Alice Perera",
    items: [
      {
        itemId: "item1",
        itemName: "Chicken Biryani",
        quantity: 2,
        unitPrice: 850,
        totalPrice: 1700,
        customizations: ["Extra spicy", "No onions"],
      },
      {
        itemId: "item2",
        itemName: "Mango Lassi",
        quantity: 2,
        unitPrice: 250,
        totalPrice: 500,
        customizations: ["Less sugar"],
      }
    ],
    createdAt: new Date().toISOString(),
    deliveryAddress: { city: "Kandy" },
    orderStatus: "PENDING",
  },
  {
    id: "order1002",
    userId: "Saman Fernando",
    items: [
      {
        itemId: "item3",
        itemName: "Vegetable Kottu",
        quantity: 1,
        unitPrice: 650,
        totalPrice: 650,
        customizations: ["Add cheese"],
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deliveryAddress: { city: "Colombo" },
    orderStatus: "CONFIRMED",
  },
  {
    id: "order1003",
    userId: "Nimal de Silva",
    items: [
      {
        itemId: "item4",
        itemName: "Prawn Curry",
        quantity: 1,
        unitPrice: 950,
        totalPrice: 950,
        customizations: [],
      },
      {
        itemId: "item5",
        itemName: "Plain Rice",
        quantity: 2,
        unitPrice: 150,
        totalPrice: 300,
        customizations: [],
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    deliveryAddress: { city: "Galle" },
    orderStatus: "PENDING",
  }
];

// Mock image map
const mockImageMap = {
  "item1": "https://via.placeholder.com/150?text=Biryani",
  "item2": "https://via.placeholder.com/150?text=Lassi",
  "item3": "https://via.placeholder.com/150?text=Kottu",
  "item4": "https://via.placeholder.com/150?text=Curry",
  "item5": "https://via.placeholder.com/150?text=Rice"
};

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "confirmed" | "pending">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setOrders(mockOrders);
        setImageMap(mockImageMap);
        setIsLoading(false);
      }, 800);
    };
    loadMockData();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');

      if (newStatus === 'READY_FOR_PICKUP') {
        const payload = {
          orderId: order.id,
          customerName: order.userId,
          customerPhone: "+94712345678",
          shop: "Spicy Kitchen",
          shopLat: 6.870012,
          shopLng: 79.891234,
          customerAddress: order.deliveryAddress.city,
          customerLat: 7.290572,
          customerLng: 80.633728,
          amount: order.items.reduce((total, item) => total + item.totalPrice, 0),
          items: order.items.reduce((acc, item) => {
            acc[item.itemName] = item.quantity;
            return acc;
          }, {} as Record<string, number>)
        };

        console.log("Sending to driver manager API:", payload);
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success('Driver manager notified successfully');
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (order: OrderItem, newStatus: string) => {
    const isFinalStatus = ['READY_FOR_PICKUP', 'CANCELED'].includes(newStatus);
    const confirmationMessage = isFinalStatus
      ? `Are you sure you want to set this order to ${newStatus}? This action cannot be undone.`
      : `Do you want to update the order status to ${newStatus}?`;

    if (window.confirm(confirmationMessage)) {
      updateOrderStatus(order.id, newStatus);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (tab === "confirmed") return order.orderStatus === "CONFIRMED";
    if (tab === "pending") return order.orderStatus === "PENDING";
    return true;
  }).filter(order => order.userId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by customer"
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-x-2">
          <button className={`px-4 py-2 rounded ${tab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("all")}>All</button>
          <button className={`px-4 py-2 rounded ${tab === "confirmed" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("confirmed")}>Confirmed</button>
          <button className={`px-4 py-2 rounded ${tab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setTab("pending")}>Pending</button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
              <p><strong>Customer:</strong> {order.userId}</p>
              <p><strong>City:</strong> {order.deliveryAddress.city}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p className="text-sm text-gray-500 mb-2">Placed on: {new Date(order.createdAt).toLocaleString()}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map((item) => (
                  <div key={item.itemId} className="flex items-center gap-4 border p-2 rounded">
                    <img src={imageMap[item.itemId]} alt={item.itemName} className="w-20 h-20 object-cover rounded" />
                    <div>
                      <p className="font-semibold">{item.itemName}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: Rs. {item.totalPrice}</p>
                      {item.customizations.length > 0 && (
                        <ul className="text-sm text-gray-600 list-disc ml-4">
                          {item.customizations.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => handleStatusChange(order, "CONFIRMED")} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"><FaCheck /> Confirm</button>
                <button onClick={() => handleStatusChange(order, "READY_FOR_PICKUP")} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"><FaTruck /> Ready for Pickup</button>
                <button onClick={() => handleStatusChange(order, "CANCELED")} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

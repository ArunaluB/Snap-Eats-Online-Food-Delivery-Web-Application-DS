import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTruck, FaTimes } from 'react-icons/fa';
import FilterBar from '../restaurant/FilterBar';

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
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
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
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    deliveryAddress: { city: "Galle" },
    orderStatus: "PENDING",
  }
];

// Mock image data
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
    // Simulate API loading time
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
      // Simulate API call delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If status is READY_FOR_PICKUP, call the driver manager API
      if (newStatus === 'READY_FOR_PICKUP') {
        const order = orders.find((o) => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        
        // Mock payload for driver manager API with data matching the specified format
        const payload = {
          orderId: order.id,
          customerName: order.userId, // Use userId as customer name
          customerPhone: "+94712345678", // Mock phone
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
        
        // Mock API call to driver manager
        try {
          // Real API call would be uncommented in production:
          // const driverResponse = await fetch(
          //   'http://localhost:8080/api/drivermanager/api/order',
          //   {
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify(payload),
          //   }
          // );
          
          // For demo, we'll simulate a successful response
          await new Promise(resolve => setTimeout(resolve, 800));
          toast.success('Driver manager notified successfully');
        } catch (error) {
          console.error("Error calling driver manager API:", error);
          toast.error('Failed to notify driver manager');
          throw error;
        }
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (order: OrderItem, newStatus: string) => {
    const isFinalStatus = ['READY_FOR_PICKUP', 'CANCELED'].includes(newStatus);
    const confirmationMessage = isFinalStatus
      ? `Are you sure you want to set this order to ${newStatus}? This action cannot be undone.`
      : `Set order status to ${newStatus}?`;

    if (window.confirm(confirmationMessage)) {
      updateOrderStatus(order.id, newStatus);
    }
  };

  const statusOptions = [
    {
      status: 'CONFIRMED',
      icon: <FaCheck />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      description: 'Confirm Order',
    },
    {
      status: 'READY_FOR_PICKUP',
      icon: <FaTruck />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      description: 'Ready for Pickup',
    },
    {
      status: 'CANCELED',
      icon: <FaTimes />,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      description: 'Cancel Order',
    },
  ];

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

      <FilterBar search={search} setSearch={setSearch} tab={'all'} setTab={function (val: 'all' | 'confirmed' | 'pending'): void {
        throw new Error('Function not implemented.');
      } } />

      <style>{`
        .status-ball {
          transition: transform 0.2s, box-shadow 0.2s;
          animation: pulse 2s infinite;
        }
        .status-ball:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border p-4 rounded-md shadow-md space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{order.userId}</div>
                    <div className="text-gray-500 text-sm">{order.deliveryAddress.city}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'READY_FOR_PICKUP' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.orderStatus}
                    </div>
                    {['READY_FOR_PICKUP', 'CANCELED'].includes(order.orderStatus) ? (
                      <div className="text-sm text-gray-500 italic">
                        Status Locked
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {statusOptions
                          .filter((option) =>
                            order.orderStatus === 'PENDING'
                              ? ['CONFIRMED', 'CANCELED'].includes(option.status)
                              : option.status === 'READY_FOR_PICKUP'
                          )
                          .map((option) => (
                            <div
                              key={option.status}
                              className="relative group"
                            >
                              <button
                                onClick={() => handleStatusChange(order, option.status)}
                                className={`
                                  status-ball
                                  ${option.color} ${option.hoverColor}
                                  w-8 h-8 rounded-full flex items-center justify-center text-white
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${option.color.split('-')[1]}-500
                                `}
                                title={option.description}
                                disabled={isLoading}
                              >
                                {option.icon}
                              </button>
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                {option.description}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium text-gray-700 mb-2">Order Items:</div>
                  {order.items.map((item, index) => {
                    const imageUrl = imageMap[item.itemId] || '';

                    return (
                      <div key={index} className="flex items-center space-x-4 mb-2 last:mb-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.itemName} className="w-14 h-14 object-cover rounded-md" />
                        ) : (
                          <div className="w-14 h-14 bg-orange-100 rounded-md flex items-center justify-center text-xl">🍔</div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {item.itemName} × {item.quantity}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.customizations.length > 0 
                              ? item.customizations.join(', ')
                              : 'No customizations'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Rs. {item.totalPrice}</div>
                          <div className="text-xs text-gray-500">Rs. {item.unitPrice} each</div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
                      Rs. {order.items.reduce((total, item) => total + item.totalPrice, 0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Order placed: {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-yellow-300 text-black px-4 py-1 rounded hover:bg-yellow-400 transition">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
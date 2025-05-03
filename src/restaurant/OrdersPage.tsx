import { useEffect, useState } from 'react';
import FilterBar from "./FilterBar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTruck, FaTimes } from 'react-icons/fa';

export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string; // Optional field
  latitude: number;
  longitude: number;
}

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
  deliveryAddress: AddressDTO;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersAndMenu = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, menuRes] = await Promise.all([
          fetch('http://localhost:8222/order-service/api/orders/restaurant/67fde55233027910028186e3'),
          fetch('http://localhost:8222/restaurant-service/api/menu-items/restaurant/67fde55233027910028186e3')
        ]);

        if (!ordersRes.ok) {
          const errorData = await ordersRes.json();
          console.error('Orders Error Response:', errorData);
          throw new Error(`Failed to fetch orders: ${errorData.error || 'Unknown error'}`);
        }

        if (!menuRes.ok) {
          throw new Error('Failed to fetch menu items');
        }

        const ordersData = await ordersRes.json();
        console.log('Orders Data:', ordersData);
        const menuData: MenuItem[] = await menuRes.json();

        // Handle nested orderStatus
        setOrders(ordersData.map((order: any) => ({
          ...order,
          orderStatus: typeof order.orderStatus === 'object' ? order.orderStatus.orderStatus : order.orderStatus,
        })));

        const map: Record<string, string> = {};
        menuData.forEach((item) => {
          map[item.id] = item.imageUrls?.[0] || '';
        });

        setImageMap(map);
      } catch (error: any) {
        toast.error(error.message || 'Error fetching orders or menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersAndMenu();
  }, []);

  // const updateOrderStatus = async (orderId: string, newStatus: string) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8222/order-service/api/orders/${orderId}/status/${newStatus}`,
  //       {
  //         method: 'PATCH',
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to update status');
  //     }

  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === orderId ? { ...order, orderStatus: newStatus } : order
  //       )
  //     );
  //     toast.success(`Order status updated to ${newStatus}`);
  //   } catch (error) {
  //     toast.error('Error updating order status');
  //   }
  // };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update order status
      const response = await fetch(
        `http://localhost:8222/order-service/api/orders/${orderId}/status/${newStatus}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      // If status is READY_FOR_PICKUP, call the driver manager API
      if (newStatus === 'READY_FOR_PICKUP') {
        const order = orders.find((o) => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
  
        // Construct the payload for the driver manager API
        const payload = {
          orderId: order.id,
          customerName: 'Unknown Customer', 
          customerPhone: '+94771234567',
          shop: 'Restaurant Name',
          shopLat: 6.876773305105909,
          shopLng: 79.92993253878801,
          customerAddress: order.deliveryAddress.city, 
          customerLat: order.deliveryAddress.latitude, 
          customerLng: order.deliveryAddress.longitude, 
          amount: order.items.reduce((total, item) => total + item.totalPrice, 0), 
          items: order.items.reduce((acc, item) => {
            acc[item.itemName] = item.quantity;
            return acc;
          }, {} as Record<string, number>), // Map items to { itemName: quantity }
        };
  
        // Call the driver manager API
        const driverResponse = await fetch(
          'http://localhost:8080/api/drivermanager/api/order',
          {
            method: 'POST', // Assuming POST for creating a driver order
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
  
        if (!driverResponse.ok) {
          const errorData = await driverResponse.json();
          throw new Error(`Failed to notify driver manager: ${errorData.error || 'Unknown error'}`);
        }
  
        toast.success('Driver manager notified successfully');
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

      <FilterBar search={search} setSearch={setSearch} />

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
                    <div className="text-xs text-gray-700 border px-2 py-1 rounded-full">
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
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${option.color.split('-')[1]}
                                `}
                                title={option.description}
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

                <div className="flex justify-end space-x-2">
                  <button className="bg-yellow-300 text-black px-4 py-1 rounded hover:bg-yellow-400 transition">
                    Message
                  </button>
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
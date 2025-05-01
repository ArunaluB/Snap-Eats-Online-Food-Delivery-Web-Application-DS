import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AddressDTO, CartResponseDTO } from '../../utils/fod-order-types';
import Loading from "../../components/fod-order/general/Loading";
import toast from "react-hot-toast";

interface OrderDetails {
  userId: string;
  restaurantId: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customizations: string[];
  }>;
  deliveryFee: number;
  taxAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string | null;
    landmark: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  orderStatus: string;
  paymentMethod: 'CASH' | 'CARD';
  paymentStatus: string;
  estimatedDeliveryTime: string;
  orderId?: string; // Optional unique identifier
}

export const OrderSuccessPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
  const [userAddress, setUserAddress] = useState<AddressDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasPlacedOrder = useRef(false); // Track if order has been placed
  const [orderPlaced, setOrderPlaced] = useState(false); // UI state to prevent duplicate attempts

  // Restore orderDetails and place order
  useEffect(() => {
    console.log('useEffect running, hasPlacedOrder:', hasPlacedOrder.current, 'orderPlaced:', orderPlaced);
    
    const restoreAndPlaceOrder = async () => {
      // Prevent multiple order placements
      if (hasPlacedOrder.current || orderPlaced) {
        console.log('Order already placed or in progress, skipping.');
        setLoading(false);
        return;
      }

      let details = orderDetails;

      // If orderDetails is null, try to restore from localStorage
      if (!details) {
        const storedOrderDetails = localStorage.getItem('orderDetails');
        if (storedOrderDetails) {
          try {
            details = JSON.parse(storedOrderDetails);
            setOrderDetails(details);
            console.log('Restored orderDetails from localStorage:', details);
          } catch (err) {
            console.error('Error parsing orderDetails from localStorage:', err);
            setError("Failed to load order details from storage.");
            toast.error("Failed to load order details from storage.", { duration: 4000 });
            setLoading(false);
            return;
          }
        } else {
          console.warn('No orderDetails found in localStorage');
          setError("No order details found.");
          toast.error("No order details found.", { duration: 4000 });
          setLoading(false);
          return;
        }
      }

      // Log the details being used
      console.log("Calling time:", details);
      console.log("Placing order with details:", details);

      // Clear localStorage to prevent reuse
      localStorage.removeItem('orderDetails');
      console.log('Cleared localStorage.orderDetails');

      // Place the order
      try {
        hasPlacedOrder.current = true; // Mark as placed
        setOrderPlaced(true); // Update UI state
        console.log('Sending order to backend:', details);
        await axios.post(`http://localhost:8222/order-service/api/orders`, {
          ...details,
          orderId: `order-${userId}-${Date.now()}`, // Add unique identifier
        });
        console.log('Order placed successfully');
        toast.success("Order placed successfully!", { duration: 4000 });
      } catch (err: any) {
        console.error('Order Placement Error:', err.response?.data, err.response?.status, err.message);
        setError("Failed to place order. Please try again.");
        toast.error("Failed to place order. Please try again.", { duration: 4000 });
        hasPlacedOrder.current = false; // Allow retry on error
        setOrderPlaced(false);
      } finally {
        setLoading(false);
      }
    };

    restoreAndPlaceOrder();
  }, []); // Empty dependency array to run only once on mount

  // Fetch cart and user address for display
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:8222/order-service/api/cart/${userId}`),
          axios.get(`http://localhost:8222/user-management-service/api/user-details/${userId}`),
        ]);
        setCartResponse(cartResponse.data);
        setUserAddress(userResponse.data.address);
      } catch (err: any) {
        console.error('Fetch Error:', err.response?.data, err.response?.status, err.message);
        setError(`Failed to load order details: ${err.message}`);
        toast.error(`Failed to load order details: ${err.message}`, { duration: 4000 });
      }
    };

    fetchData();
  }, [userId]);

  function GetShopAddress(address: AddressDTO): string {
    return address ? `${address.street}, ${address.city}, ${address.state}` : 'Address not available';
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) return <Loading />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div id="webcrumbs" className="font-sans">
      <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Delivery Details</h2>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-gray-500 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <div>
                <p className="font-medium">{userAddress?.street || "Address not provided"}</p>
                <p className="text-sm text-gray-500">{userAddress?.city || "City not provided"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <div>
                <p className="font-medium">Meet at my door</p>
                <p className="text-gray-500 text-sm">Estimated Delivery: 30-40 mins</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Payment Details</h2>
            <div className="flex items-center gap-3">
              <div className="h-6 w-10 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">Card</span>
              </div>
              <div>
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-gray-500 text-sm">Payment Successful</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 space-y-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {cartResponse ? (
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className="flex-1 flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img
                      src={cartResponse.restaurant.logoUrl || "https://cdn.iconscout.com/icon/free/png-256/free-burger-king-3445964-2879147.png"}
                      alt={cartResponse.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{cartResponse.restaurant.name}</p>
                    <p className="text-gray-500 text-sm">{GetShopAddress(cartResponse.restaurant.address)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-gray-500">Restaurant data not available</div>
            )}
          </div>
          {cartResponse ? (
            <div className="bg-transparent rounded-lg shadow-sm">
              <div className="bg-white mb-1">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined mr-2">shopping_cart</span>
                    <p className="font-medium">Order Summary ({cartResponse.items.length} items)</p>
                  </div>
                  <span
                    className={`material-symbols-outlined transform transition-transform duration-300 cursor-pointer ${isExpanded ? "rotate-180" : ""}`}
                    onClick={toggleExpanded}
                  >
                    expand_more
                  </span>
                </div>
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {cartResponse.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.menuItem.imageUrls[0] || 'https://via.placeholder.com/56'}
                              alt={item.menuItem.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.menuItem.name}</p>
                            {item.customizations.length > 0 && (
                              <p className="text-gray-600 text-sm">
                                Customizations: {item.customizations.join(', ')}
                              </p>
                            )}
                            <p className="text-gray-600 text-sm">LKR {item.netTotalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white p-4 border-t border-gray-100 mb-1">
                <h3 className="font-bold text-lg mb-4">Order Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">
                      LKR {cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <p className="text-gray-600">Delivery Fee</p>
                      <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                    </div>
                    <p className="font-medium">LKR {cartResponse.restaurant.deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <p className="text-gray-600">Taxes & Other Fees</p>
                      <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                    </div>
                    <p className="font-medium">LKR 0.00</p>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <p className="font-bold">Total</p>
                    <p className="font-bold text-primary-600">
                      LKR {(
                        cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) +
                        cartResponse.restaurant.deliveryFee
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm text-gray-500">
              No order data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
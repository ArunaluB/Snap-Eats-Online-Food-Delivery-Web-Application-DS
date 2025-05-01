

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  deliveryAddress: AddressDTO;
  orderStatus: string;
  paymentMethod: 'CASH' | 'CARD';
  paymentStatus: string;
  estimatedDeliveryTime: string;
  orderId?: string;
}

interface OrderStatusResponse {
  id: string;
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
  totalAmount: number;
  deliveryFee: number;
  taxAmount: number;
  deliveryAddress: AddressDTO | null;
  orderStatus: string;
  paymentMethod: 'CASH' | 'CARD';
  paymentStatus: string;
  transactionId: string | null;
  deliveryPersonId: string | null;
  estimatedDeliveryTime: string;
  orderNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export const OrderSuccessPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
  const [userAddress, setUserAddress] = useState<AddressDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const hasPlacedOrder = useRef(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Restore orderDetails and place order
  useEffect(() => {
    const restoreAndPlaceOrder = async () => {
      if (hasPlacedOrder.current || orderPlaced) {
        setLoading(false);
        return;
      }

      let details = orderDetails;

      if (!details) {
        const storedOrderDetails = localStorage.getItem('orderDetails');
        if (storedOrderDetails) {
          try {
            details = JSON.parse(storedOrderDetails);
            setOrderDetails(details);
          } catch (err) {
            setError("Unable to load order details from storage.");
            toast.error("Unable to load order details. Please view your latest order.", { duration: 3000 });
            setLoading(false);
            return;
          }
        } else {
          setError("No order details found.");
          toast.error("No order details found. Please check your latest order.", { duration: 3000 });
          setLoading(false);
          return;
        }
      }

      localStorage.removeItem('orderDetails');

      try {
        hasPlacedOrder.current = true;
        setOrderPlaced(true);
        if (details) {
          details.paymentStatus = "PAID";
        }
        const response = await axios.post(`http://localhost:8222/order-service/api/orders`, {
          ...details,
          orderId: `order-${userId}-${Date.now()}`,
        });
        const newOrderId = response.data?.id || response.data?.orderId;
        if (!newOrderId) {
          throw new Error("Order ID not returned from server.");
        }
        setOrderId(newOrderId);
        toast.success("Order placed successfully!", { duration: 3000 });
      } catch (err: any) {
        setError("Unable to place order.");
        toast.error("Unable to place order. Please view your latest order.", { duration: 3000 });
        hasPlacedOrder.current = false;
        setOrderPlaced(false);
      } finally {
        setLoading(false);
      }
    };

    restoreAndPlaceOrder();
  }, [orderDetails, orderPlaced, userId, navigate]);

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
        setError(`Unable to load order details: ${err.message}`);
        toast.error(`Unable to load order details. Please view your latest order: ${err.message}`, { duration: 3000 });
      }
    };

    fetchData();
  }, [userId]);

  // Fetch order status
  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!userId) {
        setStatusError("User ID not available.");
        return;
      }

      setStatusLoading(true);
      setStatusError(null);

      try {
        const response = await axios.get(`http://localhost:8222/order-service/api/orders/user/${userId}/latest`);
        if (!response.data?.id) {
          throw new Error("Invalid order status response: missing id.");
        }
        setOrderStatus(response.data);
      } catch (err: any) {
        setStatusError(`Unable to fetch order status: ${err.message}`);
        toast.error(`Unable to fetch order status. Please view your latest order: ${err.message}`, { duration: 3000 });
      } finally {
        setStatusLoading(false);
      }
    };

    fetchOrderStatus();
  }, [userId]);

  const getFormattedAddress = (address: AddressDTO | null): string => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.city}, ${address.state}${address.zipCode ? `, ${address.zipCode}` : ''}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewOrder = () => {
    if (userId) {
      navigate(`/fod-order/latest-order/${userId}`); // Navigate to LatestOrderPage
    } else {
      toast.error("User ID not available.", { duration: 3000 });
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={handleViewOrder}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Your Order
        </button>
      </div>
    );
  }

  return (
    <div id="webcrumbs" className="font-sans p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Confirmation</h1>
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="font-bold text-xl text-gray-800 mb-4">Order Status</h2>
            {statusLoading ? (
              <p className="text-gray-500">Fetching order status...</p>
            ) : statusError ? (
              <p className="text-red-500">{statusError}</p>
            ) : orderStatus ? (
              <div className="space-y-3">
                <p className="text-gray-600"><span className="font-medium">Order ID:</span> {orderStatus.id}</p>
                <p className="text-gray-600"><span className="font-medium">Status:</span> {orderStatus.orderStatus}</p>
                <p className="text-gray-600"><span className="font-medium">Estimated Delivery:</span> {orderStatus.estimatedDeliveryTime}</p>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Last Updated:</span>{' '}
                  {orderStatus.updatedAt ? new Date(orderStatus.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No order status available.</p>
            )}
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="font-bold text-xl text-gray-800 mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
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
                <div>
                  <p className="font-medium text-gray-800">{userAddress ? getFormattedAddress(userAddress) : 'Address not provided'}</p>
                  {userAddress?.landmark && (
                    <p className="text-sm text-gray-500">Landmark: {userAddress.landmark}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
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
                <div>
                  <p className="font-medium text-gray-800">Meet at my door</p>
                  <p className="text-sm text-gray-500">
                    Estimated Delivery: {orderStatus?.estimatedDeliveryTime || orderDetails?.estimatedDeliveryTime || '30-40 mins'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="font-bold text-xl text-gray-800 mb-4">Payment Details</h2>
            <div className="flex items-center gap-3">
              <div className="h-8 w-12 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-sm">Card</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Payment Successful</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cartResponse ? (
              <div className="flex items-center gap-4">
                <img
                  src={cartResponse.restaurant.logoUrl || 'https://via.placeholder.com/48'}
                  alt={cartResponse.restaurant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-800">{cartResponse.restaurant.name}</p>
                  <p className="text-sm text-gray-500">{getFormattedAddress(cartResponse.restaurant.address)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Restaurant data not available</p>
            )}
          </div>
          {cartResponse ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="font-bold text-xl">Order Summary ({cartResponse.items.length} items)</p>
                </div>
                <button
                  onClick={toggleExpanded}
                  className={`text-gray-500 hover:text-gray-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {isExpanded && (
                <div className="space-y-4">
                  {cartResponse.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.menuItem.imageUrls[0] || 'https://via.placeholder.com/64'}
                            alt={item.menuItem.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                          {item.customizations.length > 0 && (
                            <p className="text-sm text-gray-500">
                              Customizations: {item.customizations.join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">LKR {item.netTotalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-800">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-xl text-gray-800 mb-4">Order Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <p>Subtotal</p>
                    <p>LKR {cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>Delivery Fee</p>
                    <p>LKR {cartResponse.restaurant.deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>Taxes & Other Fees</p>
                    <p>LKR 0.00</p>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <p>Total</p>
                    <p>LKR {(
                      cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) +
                      cartResponse.restaurant.deliveryFee
                    ).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
              No order data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
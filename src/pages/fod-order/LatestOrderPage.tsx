// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { AddressDTO } from '../../utils/fod-order-types';
// import Loading from "../../components/fod-order/general/Loading";
// import toast from "react-hot-toast";

// interface OrderStatusResponse {
//   id: string;
//   userId: string;
//   restaurantId: string;
//   items: Array<{
//     itemId: string;
//     itemName: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//     customizations: string[];
//   }>;
//   totalAmount: number;
//   deliveryFee: number;
//   taxAmount: number;
//   deliveryAddress: AddressDTO | null;
//   orderStatus: string;
//   paymentMethod: 'CASH' | 'CARD';
//   paymentStatus: string;
//   transactionId: string | null;
//   deliveryPersonId: string | null;
//   estimatedDeliveryTime: string;
//   orderNotes: string | null;
//   cancellationReason: string | null;
//   createdAt: string;
//   updatedAt: string;
//   active: boolean;
// }

// interface RestaurantDetails {
//   name: string;
//   logoUrl: string;
//   address: AddressDTO;
//   deliveryFee: number;
// }

// export const LatestOrderPage = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
//   const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Fetch latest order and restaurant details
//   useEffect(() => {
//     const fetchLatestOrder = async () => {
//       if (!userId) {
//         setError("User ID not available.");
//         setLoading(false);
//         toast.error("User ID not available.", { duration: 4000 });
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         // Fetch latest order
//         const orderResponse = await axios.get(`http://localhost:8222/order-service/api/orders/user/${userId}/latest`);
//         const orderData = orderResponse.data;
//         if (!orderData?.id) {
//           throw new Error("Invalid order data received.");
//         }
//         setOrderStatus(orderData);

//         // Fetch restaurant details
//         const restaurantResponse = await axios.get(`http://localhost:8222/restaurant-service/api/restaurants/${orderData.restaurantId}`);
//         setRestaurantDetails(restaurantResponse.data);

//       } catch (err: any) {
//         console.error('Fetch Error:', {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//         setError(`Failed to load latest order: ${err.message}`);
//         toast.error(`Failed to load latest order: ${err.message}`, { duration: 4000 });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLatestOrder();
//   }, [userId]);

//   // Function to format address
//   const getFormattedAddress = (address: AddressDTO | null): string => {
//     if (!address) return 'Address not available';
//     return `${address.street}, ${address.city}, ${address.state}${address.zipCode ? `, ${address.zipCode}` : ''}`;
//   };

//   // Toggle order items expansion
//   const toggleExpanded = () => {
//     setIsExpanded(!isExpanded);
//   };

//   // Handle retry on error
//   const handleRetry = () => {
//     setError(null);
//     setLoading(true);
//     setOrderStatus(null);
//     setRestaurantDetails(null);
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//         <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <button
//             onClick={handleRetry}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Latest Order</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column: Order Status, Delivery, Payment */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Status Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
//               {orderStatus ? (
//                 <div className="space-y-3">
//                   <p className="text-gray-600"><span className="font-medium">Order ID:</span> {orderStatus.id}</p>
//                   <p className="text-gray-600"><span className="font-medium">Status:</span> {orderStatus.orderStatus}</p>
//                   <p className="text-gray-600"><span className="font-medium">Estimated Delivery:</span> {orderStatus.estimatedDeliveryTime}</p>
//                   <p className="text-gray-500 text-sm">
//                     <span className="font-medium">Last Updated:</span>{' '}
//                     {orderStatus.updatedAt
//                       ? new Date(orderStatus.updatedAt).toLocaleString()
//                       : 'N/A'}
//                   </p>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No order status available.</p>
//               )}
//             </div>

//             {/* Delivery Details Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h2>
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6 text-gray-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                   <div>
//                     <p className="font-medium text-gray-800">
//                       {orderStatus ? getFormattedAddress(orderStatus.deliveryAddress) : 'Address not available'}
//                     </p>
//                     {orderStatus?.deliveryAddress?.landmark && (
//                       <p className="text-sm text-gray-500">Landmark: {orderStatus.deliveryAddress.landmark}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6 text-gray-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                   <div>
//                     <p className="font-medium text-gray-800">Meet at door</p>
//                     <p className="text-sm text-gray-500">
//                       Estimated Delivery: {orderStatus?.estimatedDeliveryTime || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Details Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
//               <div className="flex items-center gap-3">
//                 <div className="h-8 w-12 bg-blue-500 rounded flex items-center justify-center">
//                   <span className="text-white text-sm">{orderStatus?.paymentMethod === 'CARD' ? 'Card' : 'Cash'}</span>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     {orderStatus?.paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'Cash on Delivery'}
//                   </p>
//                   <p className="text-sm text-gray-500">{orderStatus?.paymentStatus || 'Pending'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Restaurant Info and Order Summary */}
//           <div className="space-y-6">
//             {/* Restaurant Info Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant</h2>
//               {restaurantDetails ? (
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={restaurantDetails.logoUrl || 'https://via.placeholder.com/48'}
//                     alt={restaurantDetails.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-800">{restaurantDetails.name}</p>
//                     <p className="text-sm text-gray-500">{getFormattedAddress(restaurantDetails.address)}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">Restaurant details not available.</p>
//               )}
//             </div>

//             {/* Order Summary Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6 text-gray-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     Order Summary ({orderStatus?.items.length || 0} items)
//                   </h2>
//                 </div>
//                 <button
//                   onClick={toggleExpanded}
//                   className="text-gray-500 hover:text-gray-700 transition-transform duration-300"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className={`h-6 w-6 transform ${isExpanded ? 'rotate-180' : ''}`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               {isExpanded && orderStatus?.items && (
//                 <div className="space-y-4">
//                   {orderStatus.items.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                           <img
//                             src={'https://via.placeholder.com/64'} 
//                             alt={item.itemName}
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">{item.itemName}</p>
//                           {item.customizations.length > 0 && (
//                             <p className="text-sm text-gray-500">
//                               Customizations: {item.customizations.join(', ')}
//                             </p>
//                           )}
//                           <p className="text-sm text-gray-500">LKR {item.totalPrice.toFixed(2)}</p>
//                         </div>
//                       </div>
//                       <span className="font-medium text-gray-800">x{item.quantity}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <div className="mt-6 pt-4 border-t border-gray-200">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Total</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-gray-600">
//                     <p>Subtotal</p>
//                     <p>LKR {orderStatus?.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <p>Delivery Fee</p>
//                     <p>LKR {orderStatus?.deliveryFee.toFixed(2)}</p>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <p>Taxes & Fees</p>
//                     <p>LKR {orderStatus?.taxAmount.toFixed(2)}</p>
//                   </div>
//                   <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
//                     <p>Total</p>
//                     <p>LKR {orderStatus?.totalAmount.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddressDTO } from '../../utils/fod-order-types';
import Loading from "../../components/fod-order/general/Loading";
import toast from "react-hot-toast";

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

interface RestaurantDetails {
  name: string;
  logoUrl: string;
  address: AddressDTO;
  deliveryFee: number;
}

interface MenuItem {
  id: string;
  imageUrls: string[];
}

export const LatestOrderPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [orderStatus, setOrderStatus] = useState<OrderStatusResponse | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemImages, setItemImages] = useState<{ [key: string]: string }>({});

  // Fetch latest order, restaurant details, and item images
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!userId) {
        setError("User ID not available.");
        setLoading(false);
        toast.error("User ID not available.", { duration: 4000 });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch latest order
        const orderResponse = await axios.get(`http://localhost:8222/order-service/api/orders/user/${userId}/latest`);
        const orderData = orderResponse.data;
        if (!orderData?.id) {
          throw new Error("Invalid order data received.");
        }
        setOrderStatus(orderData);

        // Fetch restaurant details
        const restaurantResponse = await axios.get(`http://localhost:8222/restaurant-service/api/restaurants/${orderData.restaurantId}`);
        setRestaurantDetails(restaurantResponse.data);

        // Fetch image URLs for each item
        const imagePromises = orderData.items.map(async (item: { itemId: string }) => {
          // Validate itemId
          if (!item.itemId || typeof item.itemId !== 'string' || item.itemId.trim() === '') {
            console.warn(`Invalid itemId for item: ${JSON.stringify(item)}`);
            return { itemId: item.itemId || 'unknown', imageUrl: 'https://via.placeholder.com/64' };
          }

          try {
            const itemResponse = await axios.get(`http://localhost:8222/restaurant-service/api/menu-items/${item.itemId}`);
            const menuItem: MenuItem = itemResponse.data;
            return { itemId: item.itemId, imageUrl: menuItem.imageUrls[0] || 'https://via.placeholder.com/64' };
          } catch (err: any) {
            console.error(`Failed to fetch image for item ${item.itemId}:`, err.message);
            return { itemId: item.itemId, imageUrl: 'https://via.placeholder.com/64' };
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, { itemId, imageUrl }) => {
          acc[itemId] = imageUrl;
          return acc;
        }, {} as { [key: string]: string });
        setItemImages(imageMap);

      } catch (err: any) {
        console.error('Fetch Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(`Failed to load latest order: ${err.message}`);
        toast.error(`Failed to load latest order: ${err.message}`, { duration: 4000 });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [userId]);

  // Function to format address
  const getFormattedAddress = (address: AddressDTO | null): string => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.city}, ${address.state}${address.zipCode ? `, ${address.zipCode}` : ''}`;
  };

  // Toggle order items expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle retry on error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setOrderStatus(null);
    setRestaurantDetails(null);
    setItemImages({});
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Latest Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Status, Delivery, Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status</h2>
              {orderStatus ? (
                <div className="space-y-3">
                  <p className="text-gray-600"><span className="font-medium">Order ID:</span> {orderStatus.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Status:</span> {orderStatus.orderStatus}</p>
                  <p className="text-gray-600"><span className="font-medium">Estimated Delivery:</span> {orderStatus.estimatedDeliveryTime}</p>
                  <p className="text-gray-500 text-sm">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {orderStatus.updatedAt
                      ? new Date(orderStatus.updatedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No order status available.</p>
              )}
            </div>

            {/* Delivery Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h2>
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
                    <p className="font-medium text-gray-800">
                      {orderStatus ? getFormattedAddress(orderStatus.deliveryAddress) : 'Address not available'}
                    </p>
                    {orderStatus?.deliveryAddress?.landmark && (
                      <p className="text-sm text-gray-500">Landmark: {orderStatus.deliveryAddress.landmark}</p>
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
                    <p className="font-medium text-gray-800">Meet at door</p>
                    <p className="text-sm text-gray-500">
                      Estimated Delivery: {orderStatus?.estimatedDeliveryTime || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">{orderStatus?.paymentMethod === 'CARD' ? 'Card' : 'Cash'}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {orderStatus?.paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                  </p>
                  <p className="text-sm text-gray-500">{orderStatus?.paymentStatus || 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Restaurant Info and Order Summary */}
          <div className="space-y-6">
            {/* Restaurant Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant</h2>
              {restaurantDetails ? (
                <div className="flex items-center gap-4">
                  <img
                    src={restaurantDetails.logoUrl || 'https://via.placeholder.com/48'}
                    alt={restaurantDetails.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{restaurantDetails.name}</p>
                    <p className="text-sm text-gray-500">{getFormattedAddress(restaurantDetails.address)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Restaurant details not available.</p>
              )}
            </div>

            {/* Order Summary Card */}
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
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Summary ({orderStatus?.items.length || 0} items)
                  </h2>
                </div>
                <button
                  onClick={toggleExpanded}
                  className="text-gray-500 hover:text-gray-700 transition-transform duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transform ${isExpanded ? 'rotate-180' : ''}`}
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
              {isExpanded && orderStatus?.items && (
                <div className="space-y-4">
                  {orderStatus.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={itemImages[item.itemId] || 'https://via.placeholder.com/64'}
                            alt={item.itemName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.itemName}</p>
                          {item.customizations.length > 0 && (
                            <p className="text-sm text-gray-500">
                              Customizations: {item.customizations.join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">LKR {item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-800">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Total</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <p>Subtotal</p>
                    <p>LKR {orderStatus?.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>Delivery Fee</p>
                    <p>LKR {orderStatus?.deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <p>Taxes & Fees</p>
                    <p>LKR {orderStatus?.taxAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
                    <p>Total</p>
                    <p>LKR {orderStatus?.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
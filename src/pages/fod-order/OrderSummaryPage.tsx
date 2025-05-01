
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { AddressDTO, CartResponseDTO } from '../../utils/fod-order-types';
// import { PaymentModal } from "../../components/fod-order/shop/PaymentModal";
// import Loading from "../../components/fod-order/general/Loading";
// import toast from "react-hot-toast";
// import { AddressModel } from "../../components/fod-order/shop/AddressModel";
// import { CashOrderConfirmationModal } from "../../components/fod-order/general/CashOrderConfirmationModal";

// export const OrderSummaryPage = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isRedirecting, setIsRedirecting] = useState(false);
//   const [redirectError, setRedirectError] = useState<string | null>(null);
//   const [showCashConfirmationModal, setShowCashConfirmationModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [userAddress, setUserAddress] = useState<AddressDTO | null>(null);
//   const [processedSessionIds, setProcessedSessionIds] = useState<Set<string>>(new Set());
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"snap" | "cash" | "card">("cash");

//   // Fetch cart and user address
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [cartResponse, userResponse] = await Promise.all([
//           axios.get(`http://localhost:8222/order-service/api/cart/${userId}`),
//           axios.get(`http://localhost:8222/user-management-service/api/user-details/${userId}`),
//         ]);
//         console.log('Cart API Response:', cartResponse.data);
//         console.log('User API Response:', userResponse.data);
//         setCartResponse(cartResponse.data);
//         setUserAddress(userResponse.data.address);
//       } catch (err: any) {
//         console.error('Fetch Error:', err.response?.data, err.response?.status, err.message);
//         setError(`Failed to load cart or user address: ${err.message}`);
//         toast.error(`Failed to load cart or user address: ${err.message}`, { duration: 3000 });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   // Function to verify payment
//   const verifyAndPlaceOrder = async (
//     sessionId: string,
//     processedSessions: Set<string>,
//     setProcessed: React.Dispatch<React.SetStateAction<Set<string>>>,
//     setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
//     navigate: (path: string, options?: { replace: boolean }) => void
//   ) => {
//     if (processedSessions.has(sessionId)) return;

//     setProcessing(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8222/order-service/api/payment/verify-checkout-session/${sessionId}`
//       );
//       console.log('Payment Verification Response:', response.data);

//       if (response.data.status === 'paid' || response.data.status === 'succeeded') {
//         setProcessed((prev) => new Set(prev).add(sessionId));
//         toast.success("Order placed successfully!", { duration: 3000 });
//         navigate('/order-confirmation', { replace: true });
//       } else {
//         toast.error("Payment verification failed.", { duration: 3000 });
//         navigate(`/order-summary/${userId}`, { replace: true });
//       }
//     } catch (err: any) {
//       console.error('Payment Verification Error:', err.response?.data, err.response?.status, err.message);
//       const errorMessage =
//         err.response?.data?.error || "Failed to verify payment. Please try again.";
//       toast.error(errorMessage, { duration: 3000 });
//       navigate(`/order-summary/${userId}`, { replace: true });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Trigger verifyAndPlaceOrder when sessionId is present
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const sessionId = params.get('sessionId');
//     if (sessionId && !loading) {
//       verifyAndPlaceOrder(
//         sessionId,
//         processedSessionIds,
//         setProcessedSessionIds,
//         setIsProcessingPayment,
//         navigate
//       );
//     }
//   }, [location.search, processedSessionIds, loading]);

//   if (loading) return <Loading />;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   function GetShopAddress(address: AddressDTO): string {
//     return address ? `${address.street}, ${address.city}, ${address.state}` : 'Address not available';
//   }

//   const toggleExpanded = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleNext = async () => {
//     if (!userAddress?.street) {
//       toast.error("Please provide a street address.", { duration: 3000 });
//       return;
//     }
//     if (!userAddress?.city) {
//       toast.error("Please provide a city.", { duration: 3000 });
//       return;
//     }
//     if (!userAddress?.latitude || !userAddress?.longitude) {
//       toast.error("Please select a location on the map.", { duration: 3000 });
//       return;
//     }
//     if (!cartResponse?.restaurant?.id) {
//       toast.error("Cart data is incomplete.", { duration: 3000 });
//       return;
//     }

//     if (selectedPaymentMethod === 'card') {
//       setIsRedirecting(true);
//       setRedirectError(null);
//       try {
//         const totalAmount =
//           (cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) || 0) +
//           (cartResponse.restaurant.deliveryFee || 0);
//         const orderDetails = {
//           userId: userId,
//           restaurantId: cartResponse.restaurant.id,
//           items: cartResponse.items.map((item) => ({
//             itemId: item.menuItem.id,
//             itemName: item.menuItem.name,
//             quantity: item.quantity,
//             unitPrice: Number((item.netTotalPrice / item.quantity).toFixed(2)),
//             totalPrice: Number(item.netTotalPrice.toFixed(2)),
//             customizations: item.customizations,
//           })),
//           deliveryFee: Number(cartResponse.restaurant.deliveryFee.toFixed(2)) || 0,
//           taxAmount: 0,
//           deliveryAddress: {
//             street: userAddress.street,
//             city: userAddress.city,
//             state: userAddress.state,
//             zipCode: userAddress.zipCode || null,
//             landmark: userAddress.landmark || null,
//             latitude: userAddress.latitude || null,
//             longitude: userAddress.longitude || null,
//           },
//           orderStatus: "PENDING",
//           paymentMethod: "CARD",
//           paymentStatus: "PENDING",
//           estimatedDeliveryTime: "30-40 mins",
//         };
//         const response = await axios.post(
//           'http://localhost:8222/order-service/api/payment/create-checkout-session',
//           {
//             amount: Math.round(totalAmount * 100),
//             currency: 'usd',
//             description: `Order for ${cartResponse.restaurant.name || 'Restaurant'}`,
//             userId: userId,
//             restaurantId: cartResponse.restaurant.id,
//             successUrl: `${window.location.origin}/order-summary/${userId}?sessionId={CHECKOUT_SESSION_ID}`,
//             // successUrl:`http://localhost:5173/fod-order/shop`,
//             cancelUrl: `${window.location.origin}/order-summary/${userId}`,
//             orderDetails,
//           }
//         );
//         console.log('Create Checkout Session Response:', response.data);
//         if (!response.data.sessionUrl) {
//           throw new Error('No session URL returned from backend');
//         }
//         window.location.href = response.data.sessionUrl;
//       } catch (err: any) {
//         const errorMessage = err.response?.data?.error || err.message || 'Failed to initiate checkout. Please try again.';
//         console.error('Checkout Error:', err.response?.data, err.response?.status, err.message);
//         setRedirectError(errorMessage);
//         toast.error(errorMessage, { duration: 3000 });
//       } finally {
//         setIsRedirecting(false);
//       }
//     } else if (selectedPaymentMethod === 'cash') {
//       setShowCashConfirmationModal(true);
//     } else {
//       toast.error("Selected payment method is not yet implemented.", { duration: 3000 });
//     }
//   };

//   const handleConfirmCashOrder = async () => {
//     try {
//       const totalAmount =
//         (cartResponse?.items.reduce((sum, item) => sum + item.netTotalPrice, 0) || 0) +
//         (cartResponse?.restaurant.deliveryFee || 0);
//       await axios.post(`http://localhost:8222/order-service/api/orders`, {
//         userId: userId,
//         restaurantId: cartResponse?.restaurant.id,
//         items: cartResponse?.items.map((item) => ({
//           itemId: item.menuItem.id,
//           itemName: item.menuItem.name,
//           quantity: item.quantity,
//           unitPrice: Number((item.netTotalPrice / item.quantity).toFixed(2)),
//           totalPrice: Number(item.netTotalPrice.toFixed(2)),
//           customizations: item.customizations,
//         })),
//         deliveryFee: Number(cartResponse?.restaurant.deliveryFee.toFixed(2)) || 0,
//         taxAmount: 0,
//         deliveryAddress: {
//           street: userAddress?.street,
//           city: userAddress?.city,
//           state: userAddress?.state,
//           zipCode: userAddress?.zipCode || null,
//           landmark: userAddress?.landmark || null,
//           latitude: userAddress?.latitude || null,
//           longitude: userAddress?.longitude || null,
//         },
//         orderStatus: "PENDING",
//         paymentMethod: "CASH",
//         paymentStatus: "PENDING",
//         estimatedDeliveryTime: "30-40 mins",
//       });
//       toast.success("Order placed successfully!", { duration: 3000 });
//       setShowCashConfirmationModal(false);
//       navigate('/order-confirmation', { replace: true });
//     } catch (err: any) {
//       console.error('Cash Order Error:', err.response?.data, err.response?.status, err.message);
//       toast.error("Failed to place order. Please try again.", { duration: 3000 });
//     }
//   };

//   return (
//     <div id="webcrumbs">
//       <div className="flex flex-col lg:flex-row gap-4 font-sans">
//         <div className="lg:w-2/3 space-y-4">
//           <div className="bg-white rounded-lg p-6 shadow-sm">
//             <h2 className="font-bold text-lg mb-4">Delivery details</h2>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-start gap-3">
//                 <span className="text-gray-500 mt-1">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
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
//                 </span>
//                 <div>
//                   <p className={`font-medium ${userAddress?.street ? 'text-black' : 'text-red-500'}`}>
//                     {userAddress?.street || "Address is not given"}
//                   </p>
//                   <p className={`text-sm ${userAddress?.city ? 'text-gray-500' : 'text-red-500'}`}>
//                     {userAddress?.city || "City is not given"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowAddressModal(true)}
//                 className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
//               >
//                 Edit
//               </button>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-start gap-3">
//                 <span className="text-gray-500 mt-1">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
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
//                 </span>
//                 <div>
//                   <p className="font-medium">Meet at my door</p>
//                   <p className="text-blue-600 text-sm hover:underline cursor-pointer">
//                     Add delivery instructions
//                   </p>
//                 </div>
//               </div>
//               <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
//                 Edit
//               </button>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg p-6 shadow-sm">
//             <h2 className="font-bold text-lg mb-4">Delivery options</h2>
//             <div className="border border-gray-200 rounded-lg mb-4">
//               <div className="flex items-center p-4">
//                 <div className="h-6 w-6 flex items-center justify-center border border-gray-300 rounded-md mr-3">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">done</span>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-700">Standard</p>
//                   <p className="text-gray-500 text-sm">Currently closed</p>
//                 </div>
//               </div>
//             </div>
//             <button className="flex items-center text-base font-medium hover:text-primary-600 transition-colors">
//               <span className="material-symbols-outlined mr-2">calendar_today</span>
//               Schedule
//             </button>
//           </div>
//           <div className="bg-white rounded-lg p-6 shadow-sm">
//             <h2 className="font-bold text-lg mb-4">Payment</h2>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 {selectedPaymentMethod === "snap" && (
//                   <>
//                     <div className="h-6 w-10 bg-black rounded flex items-center justify-center">
//                       <span className="text-white text-xs">Snap</span>
//                     </div>
//                     <div>
//                       <p className="font-medium">Snap Cash: LKR 0.00</p>
//                       <p className="text-gray-500 text-sm">+ Cash</p>
//                     </div>
//                   </>
//                 )}
//                 {selectedPaymentMethod === "cash" && (
//                   <>
//                     <div className="h-6 w-10 bg-green-500 rounded flex items-center justify-center">
//                       <span className="text-white text-xs">Cash</span>
//                     </div>
//                     <div>
//                       <p className="font-medium">Cash</p>
//                       <p className="text-gray-500 text-sm">Cash on delivery</p>
//                     </div>
//                   </>
//                 )}
//                 {selectedPaymentMethod === "card" && (
//                   <>
//                     <div className="h-6 w-10 bg-blue-500 rounded flex items-center justify-center">
//                       <span className="text-white text-xs">Card</span>
//                     </div>
//                     <div>
//                       <p className="font-medium">Visa **** 4242</p>
//                       <p className="text-gray-500 text-sm">Credit/Debit Card</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//               <button
//                 onClick={() => setShowPaymentModal(true)}
//                 className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//           {redirectError && (
//             <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//               {redirectError}
//             </div>
//           )}
//           <button
//             onClick={handleNext}
//             disabled={isRedirecting || isProcessingPayment}
//             className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
//           >
//             {isRedirecting ? 'Redirecting...' : isProcessingPayment ? 'Processing Payment...' : selectedPaymentMethod === 'cash' ? 'Place Order' : 'Next'}
//           </button>
//           {showAddressModal && (
//             <AddressModel
//               userId={userId || ""}
//               onClose={() => {
//                 setShowAddressModal(false);
//                 axios
//                   .get(`http://localhost:8222/user-management-service/api/user-details/${userId}`)
//                   .then((response) => {
//                     setUserAddress(response.data.address);
//                     console.log('Refetched address on close:', response.data.address);
//                   })
//                   .catch((err) => {
//                     console.error('Error refetching address:', err.response?.data, err.response?.status, err.message);
//                     toast.error('Failed to refresh address.', { duration: 3000 });
//                   });
//               }}
//               onSave={() => {
//                 setShowAddressModal(false);
//                 axios
//                   .get(`http://localhost:8222/user-management-service/api/user-details/${userId}`)
//                   .then((response) => {
//                     setUserAddress(response.data.address);
//                     console.log('Refetched address on save:', response.data.address);
//                     toast.success('Address updated successfully!', { duration: 2000 });
//                   })
//                   .catch((err) => {
//                     console.error('Error refetching address:', err.response?.data, err.response?.status, err.message);
//                     toast.error('Failed to refresh address.', { duration: 3000 });
//                   });
//               }}
//             />
//           )}
//         </div>
//         <div className="lg:w-1/3 space-y-1">
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             {cartResponse ? (
//               <div className="flex items-center p-4 border-b border-gray-100">
//                 <div className="flex-1 flex items-center">
//                   <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
//                     <img
//                       src={cartResponse.restaurant.logoUrl || "https://cdn.iconscout.com/icon/free/png-256/free-burger-king-3445964-2879147.png"}
//                       alt={cartResponse.restaurant.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-bold">{cartResponse.restaurant.name}</p>
//                     <p className="text-gray-500 text-sm">{GetShopAddress(cartResponse.restaurant.address)}</p>
//                   </div>
//                 </div>
//                 <span className="material-symbols-outlined text-gray-500">chevron_right</span>
//               </div>
//             ) : (
//               <div className="p-4 text-gray-500">Cart data not available</div>
//             )}
//             <div className="bg-yellow-50 mx-5 p-4 flex items-center border-b border-gray-100 rounded-lg">
//               <div className="flex-1">
//                 <p className="font-medium">Save LKR 189.00 on this order with Snap One</p>
//                 <button className="text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
//                   Get yours now
//                 </button>
//               </div>
//               <div className="w-16 h-16">
//                 <img
//                   src="https://cdn.iconscout.com/icon/premium/png-256-thumb/burger-3296982-2748306.png"
//                   alt="Promo"
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//             </div>
//             <div className="ml-1 p-4 flex items-center border-b border-gray-100">
//               <button
//                 onClick={handleNext}
//                 disabled={isRedirecting || isProcessingPayment}
//                 className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg disabled:bg-gray-400"
//               >
//                 {isRedirecting ? 'Redirecting...' : isProcessingPayment ? 'Processing Payment...' : 'Next'}
//               </button>
//             </div>
//           </div>
//           {cartResponse ? (
//             <div className="bg-transparent rounded-lg shadow-sm">
//               <div className="bg-white mb-1">
//                 <div className="flex items-center justify-between p-4 border-b border-gray-100">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">shopping_cart</span>
//                     <p className="font-medium">Cart summary ({cartResponse.items.length} items)</p>
//                   </div>
//                   <span
//                     className={`material-symbols-outlined transform transition-transform duration-300 cursor-pointer ${isExpanded ? "rotate-180" : ""}`}
//                     onClick={toggleExpanded}
//                   >
//                     expand_more
//                   </span>
//                 </div>
//                 {isExpanded && (
//                   <div className="p-4 space-y-4">
//                     {cartResponse.items.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
//                             <img
//                               src={item.menuItem.imageUrls[0] || 'https://via.placeholder.com/56'}
//                               alt={item.menuItem.name}
//                               className="w-full h-full object-contain"
//                             />
//                           </div>
//                           <div>
//                             <p className="font-medium">{item.menuItem.name}</p>
//                             {item.customizations.length > 0 && (
//                               <p className="text-gray-600 text-sm">
//                                 Customizations: {item.customizations.join(', ')}
//                               </p>
//                             )}
//                             <p className="text-gray-600 text-sm">LKR {item.netTotalPrice.toFixed(2)}</p>
//                           </div>
//                         </div>
//                         <span className="font-medium">{item.quantity}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="bg-white p-4 border-t border-gray-100 mb-1">
//                 <h3 className="font-bold text-lg mb-4">Promotion</h3>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-primary-600">
//                     <span className="material-symbols-outlined">local_activity</span>
//                     <p className="font-medium">Add promo code</p>
//                   </div>
//                   <span className="material-symbols-outlined text-gray-500">chevron_right</span>
//                 </div>
//               </div>
//               <div className="bg-white p-4 border-t border-gray-100 mb-1">
//                 <h3 className="font-bold text-lg mb-4">Order total</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <p className="text-gray-600">Subtotal</p>
//                     <p className="font-medium">
//                       LKR {cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0).toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <p className="text-gray-600">Delivery Fee</p>
//                       <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
//                     </div>
//                     <p className="font-medium">LKR {cartResponse.restaurant.deliveryFee.toFixed(2)}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1">
//                       <p className="text-gray-600">Taxes & Other Fees</p>
//                       <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
//                     </div>
//                     <p className="font-medium">LKR 0.00</p>
//                   </div>
//                   <div className="flex justify-between pt-2 border-t border-gray-100">
//                     <p className="font-bold">Total</p>
//                     <p className="font-bold text-primary-600">
//                       LKR {(
//                         cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) +
//                         cartResponse.restaurant.deliveryFee
//                       ).toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="bg-white mt-4 text-xs text-gray-500">
//                   <p>
//                     If you're not around when the delivery person arrives, they'll leave your order
//                     at the door...
//                   </p>
//                 </div>
//               </div>
//               {showPaymentModal && (
//                 <PaymentModal
//                   onClose={() => setShowPaymentModal(false)}
//                   onSelect={(method: "snap" | "cash" | "card") => {
//                     setSelectedPaymentMethod(method);
//                     setShowPaymentModal(false);
//                   }}
//                   currentSelection={selectedPaymentMethod}
//                 />
//               )}
//               {showCashConfirmationModal && (
//                 <CashOrderConfirmationModal
//                   isOpen={showCashConfirmationModal}
//                   onClose={() => setShowCashConfirmationModal(false)}
//                   onConfirm={handleConfirmCashOrder}
//                   cartResponse={cartResponse}
//                   userAddress={userAddress}
//                 />
//               )}
//             </div>
//           ) : (
//             <div className="bg-white p-4 rounded-lg shadow-sm text-gray-500">
//               No cart data available
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AddressDTO, CartResponseDTO } from '../../utils/fod-order-types';
import { PaymentModal } from "../../components/fod-order/shop/PaymentModal";
import Loading from "../../components/fod-order/general/Loading";
import toast from "react-hot-toast";
import { AddressModel } from "../../components/fod-order/shop/AddressModel";
import { CashOrderConfirmationModal } from "../../components/fod-order/general/CashOrderConfirmationModal";

// CashOrderSuccess component (same as Success from previous response)
const CashOrderSuccess: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/fod-order/latest-order/${userId}`, { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center max-w-sm w-full">
        <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">Order Placed Successfully!</h2>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Your order has been received. Redirecting to your latest order...
        </p>
      </div>
    </div>
  );
};

export const OrderSummaryPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [showCashConfirmationModal, setShowCashConfirmationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [userAddress, setUserAddress] = useState<AddressDTO | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"snap" | "cash" | "card">("cash");
  const [showCashOrderSuccess, setShowCashOrderSuccess] = useState(false);

  // Fetch cart and user address
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:8222/order-service/api/cart/${userId}`),
          axios.get(`http://localhost:8222/user-management-service/api/user-details/${userId}`),
        ]);
        console.log('Cart API Response:', cartResponse.data);
        console.log('User API Response:', userResponse.data);
        setCartResponse(cartResponse.data);
        setUserAddress(userResponse.data.address);
      } catch (err: any) {
        console.error('Fetch Error:', err.response?.data, err.response?.status, err.message);
        setError(`Failed to load cart or user address: ${err.message}`);
        toast.error(`Failed to load cart or user address: ${err.message}`, { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError("User ID is missing.");
      setLoading(false);
      toast.error("User ID is missing.", { duration: 3000 });
    }
  }, [userId]);

  function GetShopAddress(address: AddressDTO): string {
    return address ? `${address.street}, ${address.city}, ${address.state}` : 'Address not available';
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleConfirmCashOrder = async () => {
    if (!cartResponse || !userAddress) {
      toast.error("Cart or address data is missing.", { duration: 3000 });
      return;
    }
    try {
      const totalAmount =
        (cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) || 0) +
        (cartResponse.restaurant.deliveryFee || 0);
      await axios.post(`http://localhost:8222/order-service/api/orders`, {
        userId,
        restaurantId: cartResponse.restaurant.id,
        items: cartResponse.items.map((item) => ({
          itemId: item.menuItem.id,
          itemName: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: Number((item.netTotalPrice / item.quantity).toFixed(2)),
          totalPrice: Number(item.netTotalPrice.toFixed(2)),
          customizations: item.customizations,
        })),
        deliveryFee: Number(cartResponse.restaurant.deliveryFee.toFixed(2)) || 0,
        taxAmount: 0,
        deliveryAddress: {
          street: userAddress.street,
          city: userAddress.city,
          state: userAddress.state,
          zipCode: userAddress.zipCode || null,
          landmark: userAddress.landmark || null,
          latitude: userAddress.latitude || null,
          longitude: userAddress.longitude || null,
        },
        orderStatus: "PENDING",
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        estimatedDeliveryTime: "30-40 mins",
      });
      toast.success("Order placed successfully!", { duration: 3000 });
      setShowCashConfirmationModal(false);
      setShowCashOrderSuccess(true); // Show the CashOrderSuccess component
    } catch (err: any) {
      console.error('Cash Order Error:', err.response?.data, err.response?.status, err.message);
      toast.error("Failed to place order. Please try again.", { duration: 3000 });
    }
  };

  const handleNext = async () => {
    if (!userId) {
      toast.error("User ID is missing.", { duration: 3000 });
      return;
    }
    if (!userAddress?.street) {
      toast.error("Please provide a street address.", { duration: 3000 });
      return;
    }
    if (!userAddress?.city) {
      toast.error("Please provide a city.", { duration: 3000 });
      return;
    }
    if (!userAddress?.latitude || !userAddress?.longitude) {
      toast.error("Please select a location on the map.", { duration: 3000 });
      return;
    }
    if (!cartResponse?.restaurant?.id) {
      toast.error("Cart data is incomplete.", { duration: 3000 });
      return;
    }

    const orderDetails = {
      userId,
      restaurantId: cartResponse.restaurant.id,
      items: cartResponse.items.map((item) => ({
        itemId: item.menuItem.id,
        itemName: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: Number((item.netTotalPrice / item.quantity).toFixed(2)),
        totalPrice: Number(item.netTotalPrice.toFixed(2)),
        customizations: item.customizations,
      })),
      deliveryFee: Number(cartResponse.restaurant.deliveryFee.toFixed(2)) || 0,
      taxAmount: 0,
      deliveryAddress: {
        street: userAddress.street,
        city: userAddress.city,
        state: userAddress.state,
        zipCode: userAddress.zipCode || null,
        landmark: userAddress.landmark || null,
        latitude: userAddress.latitude || null,
        longitude: userAddress.longitude || null,
      },
      orderStatus: "PENDING",
      paymentMethod: selectedPaymentMethod === "cash" ? "CASH" : ("CARD" as "CASH" | "CARD"),
      paymentStatus: "PENDING",
      estimatedDeliveryTime: "30-40 mins",
    };

    if (selectedPaymentMethod === 'card') {
      setIsRedirecting(true);
      setRedirectError(null);
      try {
        const totalAmount =
          (cartResponse.items.reduce((sum, item) => sum + item.netTotalPrice, 0) || 0) +
          (cartResponse.restaurant.deliveryFee || 0);
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        console.log("Stored order details in localStorage", orderDetails);
        const response = await axios.post(
          'http://localhost:8222/order-service/api/payment/create-checkout-session',
          {
            amount: Math.round(totalAmount * 100),
            currency: 'usd',
            description: `Order for ${cartResponse.restaurant.name || 'Restaurant'}`,
            userId,
            restaurantId: cartResponse.restaurant.id,
            successUrl: `${window.location.origin}/fod-order/order-success/${userId}?sessionId={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/fod-order/order-summary/${userId}`,
            orderDetails,
          }
        );
        console.log('Create Checkout Session Response:', response.data);
        if (!response.data.sessionUrl) {
          throw new Error('No session URL returned from backend');
        }
        window.location.href = response.data.sessionUrl;
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || "Failed to initiate checkout. Please try again.";
        console.error('Checkout Error:', err.response?.data, err.response?.status, err.message);
        setRedirectError(errorMessage);
        toast.error(errorMessage, { duration: 3000 });
      } finally {
        setIsRedirecting(false);
      }
    } else if (selectedPaymentMethod === 'cash') {
      setShowCashConfirmationModal(true);
    } else {
      toast.error("Selected payment method is not yet implemented.", { duration: 3000 });
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div id="webcrumbs">
      <div className="flex flex-col lg:flex-row gap-4 font-sans">
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Delivery details</h2>
            <div className="flex items-center justify-between mb-4">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <div>
                  <p className={`font-medium ${userAddress?.street ? 'text-black' : 'text-red-500'}`}>
                    {userAddress?.street || "Address is not given"}
                  </p>
                  <p className={`text-sm ${userAddress?.city ? 'text-gray-500' : 'text-red-500'}`}>
                    {userAddress?.city || "City is not given"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
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
                  <p className="text-blue-600 text-sm hover:underline cursor-pointer">
                    Add delivery instructions
                  </p>
                </div>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                Edit
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Delivery options</h2>
            <div className="border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center p-4">
                <div className="h-6 w-6 flex items-center justify-center border border-gray-300 rounded-md mr-3">
                  <span className="material-symbols-outlined text-gray-400 text-sm">done</span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Standard</p>
                  <p className="text-gray-500 text-sm">Currently closed</p>
                </div>
              </div>
            </div>
            <button className="flex items-center text-base font-medium hover:text-primary-600 transition-colors">
              <span className="material-symbols-outlined mr-2">calendar_today</span>
              Schedule
            </button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Payment</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPaymentMethod === "snap" && (
                  <>
                    <div className="h-6 w-10 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs">Snap</span>
                    </div>
                    <div>
                      <p className="font-medium">Snap Cash: LKR 0.00</p>
                      <p className="text-gray-500 text-sm">+ Cash</p>
                    </div>
                  </>
                )}
                {selectedPaymentMethod === "cash" && (
                  <>
                    <div className="h-6 w-10 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">Cash</span>
                    </div>
                    <div>
                      <p className="font-medium">Cash</p>
                      <p className="text-gray-500 text-sm">Cash on delivery</p>
                    </div>
                  </>
                )}
                {selectedPaymentMethod === "card" && (
                  <>
                    <div className="h-6 w-10 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">Card</span>
                    </div>
                    <div>
                      <p className="font-medium">Visa **** 4242</p>
                      <p className="text-gray-500 text-sm">Credit/Debit Card</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
          {redirectError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {redirectError}
            </div>
          )}
          <button
            onClick={handleNext}
            disabled={isRedirecting}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isRedirecting ? 'Redirecting...' : selectedPaymentMethod === 'cash' ? 'Place Order' : 'Next'}
          </button>
          {showAddressModal && (
            <AddressModel
              userId={userId || ""}
              onClose={() => {
                setShowAddressModal(false);
                axios
                  .get(`http://localhost:8222/user-management-service/api/user-details/${userId}`)
                  .then((response) => {
                    setUserAddress(response.data.address);
                    console.log('Refetched address on close:', response.data.address);
                  })
                  .catch((err) => {
                    console.error('Error refetching address:', err.response?.data, err.response?.status, err.message);
                    toast.error('Failed to refresh address.', { duration: 3000 });
                  });
              }}
              onSave={() => {
                setShowAddressModal(false);
                axios
                  .get(`http://localhost:8222/user-management-service/api/user-details/${userId}`)
                  .then((response) => {
                    setUserAddress(response.data.address);
                    console.log('Refetched address on save:', response.data.address);
                    toast.success('Address updated successfully!', { duration: 2000 });
                  })
                  .catch((err) => {
                    console.error('Error refetching address:', err.response?.data, err.response?.status, err.message);
                    toast.error('Failed to refresh address.', { duration: 3000 });
                  });
              }}
            />
          )}
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
                <span className="material-symbols-outlined text-gray-500">chevron_right</span>
              </div>
            ) : (
              <div className="p-4 text-gray-500">Cart data not available</div>
            )}
            <div className="bg-yellow-50 mx-5 p-4 flex items-center border-b border-gray-100 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Save LKR 189.00 on this order with Snap One</p>
                <button className="text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
                  Get yours now
                </button>
              </div>
              <div className="w-16 h-16">
                <img
                  src="https://cdn.iconscLICout.com/icon/premium/png-256-thumb/burger-3296982-2748306.png"
                  alt="Promo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="ml-1 p-4 flex items-center border-b border-gray-100">
              <button
                onClick={handleNext}
                disabled={isRedirecting}
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors rounded-lg disabled:bg-gray-400"
              >
                {isRedirecting ? 'Redirecting...' : 'Next'}
              </button>
            </div>
          </div>
          {cartResponse ? (
            <div className="bg-transparent rounded-lg shadow-sm">
              <div className="bg-white mb-1">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined mr-2">shopping_cart</span>
                    <p className="font-medium">Cart summary ({cartResponse.items.length} items)</p>
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
                <h3 className="font-bold text-lg mb-4">Promotion</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary-600">
                    <span className="material-symbols-outlined">local_activity</span>
                    <p className="font-medium">Add promo code</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                </div>
              </div>
              <div className="bg-white p-4 border-t border-gray-100 mb-1">
                <h3 className="font-bold text-lg mb-4">Order total</h3>
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
                <div className="bg-white mt-4 text-xs text-gray-500">
                  <p>
                    If you're not around when the delivery person arrives, they'll leave your order
                    at the door...
                  </p>
                </div>
              </div>
              {showPaymentModal && (
                <PaymentModal
                  onClose={() => setShowPaymentModal(false)}
                  onSelect={(method: "snap" | "cash" | "card") => {
                    setSelectedPaymentMethod(method);
                    setShowPaymentModal(false);
                  }}
                  currentSelection={selectedPaymentMethod}
                />
              )}
              {showCashConfirmationModal && (
                <CashOrderConfirmationModal
                  isOpen={showCashConfirmationModal}
                  onClose={() => setShowCashConfirmationModal(false)}
                  onConfirm={handleConfirmCashOrder}
                  cartResponse={cartResponse}
                  userAddress={userAddress}
                />
              )}
              {showCashOrderSuccess && userId && <CashOrderSuccess userId={userId} />}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm text-gray-500">
              No cart data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
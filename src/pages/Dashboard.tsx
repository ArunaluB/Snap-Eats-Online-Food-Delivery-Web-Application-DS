// import { useState, useEffect, useCallback, useRef } from 'react';
// import { X, Check } from 'lucide-react';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import type { Feature, LineString } from 'geojson';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import { Order, Location, Destination, PopupInfo } from '../utils/types';
// import RecentOrders from './RecentOrders';
// import IncentiveCard from './IncentiveCard';
// import OrderStats from './OrderStats';
// import Header from './Header';
// import StatusToggle from './StatusToggle';
// import OrderDetails from './OrderDetails';
// import CompletedToast from './CompletedToast';
// import MapComponent from './MapComponent';
// import { getDirections, TurnInstruction } from '../utils/routeService';
// import { getDistance, getEstimatedTravelTime, estimateRouteInfo } from '../utils/routeService';
// import { OrderStore } from '../utils/OrderStore';
// import { OrderTrackingService } from '../utils/OrderTrackingService';
// import { notificationService } from '../utils/NotificationService';
// import { createContext, useContext } from 'react';
// // Create a context for order stats
// export const OrderStatsContext = createContext({
//   stats: {
//     todayOrders: 0,
//     todayDistance: 0,
//     weeklyOrders: 0,
//     weeklyDistance: 0
//   },
//   updateStats: (newStats: any) => { }
// });

// const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
// const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
// let locationSocket: WebSocket | null = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
// const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

// export default function Dashboard() {
//   const [isOnline, setIsOnline] = useState(false);
//   const [stompClient, setStompClient] = useState<Client | null>(null);
//   const [driverId, setDriverId] = useState<number>(1);
//   const [currentLocation, setCurrentLocation] = useState<Location>({
//     lat: 6.8321,
//     lng: 80.3671
//   });
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
//   const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted' | 'pickup' | 'completed' | 'cancelled'>('pending');
//   const [route, setRoute] = useState<Feature<LineString> | null>(null);
//   const [destination, setDestination] = useState<Destination | null>(null);
//   const [isMapFullscreen, setIsMapFullscreen] = useState(false);
//   const [popupInfo, setPopupInfo] =
//     useState<PopupInfo | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [viewState, setViewState] = useState({
//     latitude: 6.8321,
//     longitude: 80.3671,
//     zoom: 8
//   });
//   // Add these state variables to your Dashboard component
//   const [routeInstructions, setRouteInstructions] = useState<TurnInstruction[]>([]);
//   const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
//   const [routeDistance, setRouteDistance] = useState<number>(0);
//   const [routeDuration, setRouteDuration] = useState<number>(0);
//   // Sample nearby orders
//   const [nearbyOrders, setNearbyOrders] = useState<Order[]>([
//     {
//       id: 'order1',
//       lat: 6.8321 + 0.02,
//       lng: 80.3671 - 0.01,
//       customerName: 'Rajith Perera',
//       customerPhone: '+94 77 123 4567',
//       shop: 'Pizza Hut - Elpitiya',
//       shopLat: 6.8321 + 0.02,
//       shopLng: 80.3671 - 0.01,
//       destination: '24 Main St, Elpitiya',
//       customerLat: 6.8321 + 0.03,
//       customerLng: 80.3671 + 0.02,
//       distance: '3.2 km',
//       amount: 'LKR 450',
//       status: 'pending'
//     },
//     {
//       id: 'order2',
//       lat: 6.8321 - 0.01,
//       lng: 80.3671 + 0.015,
//       customerName: 'Sunimal Fernando',
//       customerPhone: '+94 77 987 6543',
//       shop: 'KFC - Ambalangoda',
//       shopLat: 6.8321 - 0.01,
//       shopLng: 80.3671 + 0.015,
//       destination: '78 Beach Road, Ambalangoda',
//       customerLat: 6.8321 - 0.02,
//       customerLng: 80.3671 + 0.03,
//       distance: '4.8 km',
//       amount: 'LKR 780',
//       status: 'pending'
//     }
//   ]);
//   const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';
//   // Add this state to your component
//   const [stats, setStats] = useState({
//     todayOrders: 0,
//     todayDistance: 0,
//     weeklyOrders: 0,
//     weeklyDistance: 0
//   });

//   // Add this useEffect to load stats on component mount
//   useEffect(() => {
//     const currentStats = OrderTrackingService.getStats();
//     setStats({
//       todayOrders: currentStats.todayOrders,
//       todayDistance: currentStats.todayDistance,
//       weeklyOrders: currentStats.weeklyOrders,
//       weeklyDistance: currentStats.weeklyDistance
//     });
//   }, []);

//   // Function to send location updates to the server
//   const sendLocationUpdate = useCallback(() => {
//     if (locationSocket && locationSocket.readyState === WebSocket.OPEN && isOnline) {
//       const locationUpdate = {
//         driverId: driverId,
//         latitude: currentLocation.lat,
//         longitude: currentLocation.lng
//       };

//       try {
//         locationSocket.send(JSON.stringify(locationUpdate));
//         console.log('Sent location update:', locationUpdate);
//       } catch (error) {
//         console.error('Error sending location update:', error);
//       }
//     }
//   }, [isOnline, driverId, currentLocation, locationSocket]);


//   // Add this function to fetch directions
//   const fetchDirections = async (
//     origin: { lat: number; lng: number },
//     dest: { lat: number; lng: number }
//   ) => {
//     setIsLoadingRoute(true);
//     try {
//       const routeResult = await getDirections(origin, dest);

//       if (routeResult) {
//         setRoute(routeResult.route);
//         setRouteInstructions(routeResult.instructions);
//         setRouteDistance(routeResult.distance);
//         setRouteDuration(routeResult.duration);
//       } else {
//         console.error('No route found');
//         // Handle route not found error
//       }
//     } catch (error) {
//       console.error('Error fetching directions:', error);
//       // Handle error
//     } finally {
//       setIsLoadingRoute(false);
//     }
//   };

//   // Get current location on component mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setCurrentLocation(newLocation);
//           setViewState({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             zoom: 14
//           });
//         },
//         (error) => {
//           console.error("Error getting location: ", error);
//         }
//       );
//     }
//     // Initialize notification service
//     //notificationService.init(NOTIFICATION_AUDIO_SRC);
//   }, []);



//   // Initialize WebSocket connection when driver goes online
//   useEffect(() => {
//     if (isOnline) {
//       // Initialize STOMP client for order notifications
//       const socket = new SockJS('http://localhost:8080/api/drivermanager/ws-delivery');

//       const client = new Client({
//         webSocketFactory: () => socket,
//         debug: (str) => {
//           console.log('STOMP:', str);
//         },
//         reconnectDelay: 5000,
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000
//       });

//       client.onConnect = () => {
//         console.log('Connected to STOMP WebSocket');
//         client.subscribe(`/queue/driver/${driverId}/orders`, async (message) => {
//           try {
//             const orderData = JSON.parse(message.body);
//             console.log('Received new order data:', orderData);
//             const order = orderData.order || orderData;

//             // Calculate distanceToShop (from shop to customer)
//             const distanceToShop = await getDistance(
//               currentLocation.lng,  // Driver's current longitude
//               currentLocation.lat,
//               order.customerLat,
//               order.customerLat,
//               MAPBOX_ACCESS_TOKEN
//             );
//             // Calculate distanceToShop (from shop to customer)
//             const distance = await getDistance(
//               currentLocation.lng,
//               currentLocation.lat,
//               order.customerLat,
//               order.customerLat,
//               MAPBOX_ACCESS_TOKEN
//             );

//             // Calculate estimatedTimeToShop (time from shop to customer)
//             const estimatedTimeToShop = await getEstimatedTravelTime(
//               order.shopLng,
//               order.shopLat,
//               order.customerLat,
//               order.customerLat,
//               MAPBOX_ACCESS_TOKEN
//             );
//             console.log(estimatedTimeToShop);
//             console.log(distance);

//             // Convert backend order to frontend format
//             const newOrder: Order = {
//               id: order.id || order.orderid,
//               lat: order.shopLat,
//               lng: order.shopLng,
//               customerName: order.customerName || 'Customer',
//               customerPhone: order.customerPhone || '+94 77 123 4567',
//               shop: order.shopName || 'Shop',
//               shopLat: order.shopLat,
//               shopLng: order.shopLng,
//               destination: order.deliveryAddress || 'Destination',
//               customerLat: order.customerLat,
//               customerLng: order.customerLng,
//               distance: parseFloat(((distance || 0) / 1000).toFixed(2)),
//               amount: `LKR ${order.amount || 0}`,
//               status: order.status || 'pending',
//               distanceToShop: distanceToShop || 0,
//               estimatedMinutes: estimatedTimeToShop || undefined
//             };

//             // Add to nearby orders
//             setNearbyOrders(prevOrders => [...prevOrders, newOrder]);
//             console.log('New order added to nearby orders:', newOrder);
//             // Show notification using our notification service
//             notificationService.show(
//               'New Order Request',
//               `New order from ${newOrder.shop} (${newOrder.distance} km, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`,
//               {
//                 tag: `order-${newOrder.id}`,
//                 renotify: true,
//                 onClick: () => {
//                   console.log('Order notification clicked:', newOrder.id);
//                   window.focus();
//                   // Automatically show order details when notification is clicked
//                   handleOrderClick(newOrder);
//                 }
//               }
//             );
//           } catch (error) {
//             console.error('Error processing order message:', error);
//           }
//         });
//       };

//       client.onStompError = (frame) => {
//         console.error('STOMP error:', frame.headers, frame.body);
//       };

//       client.activate();
//       setStompClient(client);


//       // Initialize raw WebSocket for location updates
//       const locSocket = new WebSocket(DRIVER_LOCATION_WEBSOCKET);

//       locSocket.onopen = () => {
//         console.log('Location WebSocket connected');
//       };

//       locSocket.onerror = (error) => {
//         console.error('Location WebSocket error:', error);
//       };

//       locSocket.onclose = () => {
//         console.log('Location WebSocket closed');
//       };

//       locationSocket = locSocket;

//       // Request notification permission when going online
//       notificationService.requestPermission();

//       // Clean up on unmount or when going offline
//       return () => {
//         if (client.active) {
//           client.deactivate();
//         }

//         if (locSocket.readyState === WebSocket.OPEN) {
//           locSocket.close();
//         }
//       };
//     } else {
//       // Disconnect when driver goes offline
//       if (stompClient && stompClient.active) {
//         stompClient.deactivate();
//         setStompClient(null);
//       }

//       if (locationSocket && locationSocket.readyState === WebSocket.OPEN) {
//         locationSocket.close();
//         locationSocket = null;
//       }
//     }
//   }, [isOnline, driverId]);

//   // Get current location and set up location watching
//   useEffect(() => {
//     let watchId: number;

//     if (navigator.geolocation && isOnline) {
//       // Get initial position
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setCurrentLocation(newLocation);
//           setViewState({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             zoom: 14
//           });
//         },
//         (error) => {
//           console.error("Error getting location: ", error);
//         }
//       );

//       // Set up continuous location watching
//       watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setCurrentLocation(newLocation);
//         },
//         (error) => {
//           console.error("Error watching location: ", error);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 10000,
//           timeout: 5000
//         }
//       );
//     }

//     // Clean up watch on unmount or when going offline
//     return () => {
//       if (watchId) {
//         navigator.geolocation.clearWatch(watchId);
//       }
//     };
//   }, [isOnline]);

//   // Send location updates periodically when online
//   useEffect(() => {
//     let intervalId: number;

//     if (isOnline) {
//       // Send location update every 10 seconds
//       intervalId = window.setInterval(sendLocationUpdate, 10000);

//       // Send an initial update
//       sendLocationUpdate();
//     }

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isOnline, sendLocationUpdate]);

//   // Auto set map to fullscreen when an order is accepted
//   useEffect(() => {
//     if (orderStatus === 'accepted' || orderStatus === 'pickup') {
//       setIsMapFullscreen(true);
//     }
//   }, [orderStatus]);

//   // Toggle online status
//   const toggleStatus = () => {
//     setIsOnline(!isOnline);
//   };

//   // Handle order selection
//   const handleOrderClick = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//     setOrderStatus('pending');
//   };


//   const acceptOrder = (order: Order) => {
//     if (stompClient && stompClient.active) {
//       console.log()
//       setSelectedOrder(order);
//       setOrderStatus('accepted');
//       setShowOrderDetails(true);

//       // Create a destination for the shop
//       const shopDestination = {
//         lat: order.shopLat,
//         lng: order.shopLng,
//         name: order.shop
//       };
//       setDestination(shopDestination);

//       // Fetch directions to the shop
//       fetchDirections(
//         { lat: currentLocation.lat, lng: currentLocation.lng },
//         { lat: order.shopLat, lng: order.shopLng }
//       );

//       stompClient.publish({
//         destination: `/app/driver/response`,
//         body: JSON.stringify({
//           orderId: order.id,
//           driverId: driverId,
//           accepted: true
//         })
//       });



//       console.log('Order accepted:', order.id);
//       stompClient.publish({
//         destination: `/app/orders/orders-details`,
//         body: JSON.stringify({
//           id: order.id,
//           distance: order.distance,
//           distanceToShop: order.distanceToShop,
//           estimatedTimeToShop: order.estimatedMinutes,
//         })
//       });
//       // Remove the order from nearby orders
//       setNearbyOrders(prevOrders =>
//         prevOrders.filter(o => o.id !== order.id)
//       );
//     }
//   };

//   const confirmPickup = () => {
//     if (!selectedOrder) return;

//     // Update order status
//     setOrderStatus('pickup');

//     // Update the order in the list
//     const updatedOrders = nearbyOrders.map(order =>
//       order.id === selectedOrder.id
//         ? { ...order, status: 'pickup' }
//         : order
//     );
//     setNearbyOrders(updatedOrders);

//     // Set customer as destination and calculate directions
//     const customerDestination = {
//       lat: selectedOrder.customerLat,
//       lng: selectedOrder.customerLng,
//       name: selectedOrder.destination
//     };
//     setDestination(customerDestination);

//     // UPDATED: Send pickup confirmation to server
//     if (stompClient && stompClient.active) {
//       stompClient.publish({
//         destination: `/app/orders/driver-response`,
//         body: JSON.stringify({
//           id: selectedOrder.id,
//           status: 'PICKED_UP'
//         })
//       });
//     }

//     // Fetch directions to the customer
//     fetchDirections(
//       { lat: currentLocation.lat, lng: currentLocation.lng },
//       { lat: selectedOrder.customerLat, lng: selectedOrder.customerLng }
//     );
//   };

//   const completeDelivery = () => {
//     if (!selectedOrder) return;

//     // Update order status
//     setOrderStatus('completed');

//     // UPDATED: Send completed status to server
//     if (stompClient && stompClient.active) {
//       stompClient.publish({
//         destination: `/app/orders/driver-response`,
//         body: JSON.stringify({
//           id: selectedOrder.id,

//           status: 'DELIVERED'
//         })
//       });
//     }
//     // Record the completed order in stats
//     const distanceKm = typeof selectedOrder.distance === 'string'
//       ? parseFloat(selectedOrder.distance.replace(' km', ''))
//       : selectedOrder.distance || 0;

//     const updatedStats = OrderTrackingService.recordCompletedOrder(distanceKm);

//     // Update the stats state if you're using it elsewhere
//     setStats(updatedStats); // Make sure to add this state with useState

//     // Record earnings
//     const orderAmount = typeof selectedOrder.amount === 'string'
//       ? parseFloat(selectedOrder.amount.replace('LKR ', ''))
//       : selectedOrder.amount || 0;

//     // Store the earnings
//     OrderStore.addOrderEarnings(selectedOrder.id, orderAmount);
//     // Update the order in the list
//     const updatedOrders = nearbyOrders.filter(order =>
//       order.id !== selectedOrder.id
//     );
//     setNearbyOrders(updatedOrders);

//     // Clear directions and destination
//     setRoute(null);
//     setDestination(null);
//     setIsMapFullscreen(false);

//     // Close order details
//     setShowOrderDetails(false);
//   };
//   // Cancel order
//   const cancelOrder = (order: Order) => {
//     if (stompClient && stompClient.active) {
//       // UPDATED: Send rejection message back to server with new endpoint and status
//       stompClient.publish({
//         destination: `/app/orders/driver-response`,
//         body: JSON.stringify({
//           id: order.id,

//           status: 'REJECTED'
//         })
//       });
//       // Reset the order status to pending
//       setOrderStatus('cancelled');
//       // If you're showing directions or have a destination set, clear those too
//       setRoute(null);
//       setDestination(null);

//       // If map is in fullscreen mode, exit fullscreen
//       setIsMapFullscreen(false);
//       // Remove the order from nearby orders
//       setNearbyOrders(prevOrders =>
//         prevOrders.filter(o => o.id !== order.id)
//       );
//     }
//   };

//   return (
//     <OrderStatsContext.Provider value={{ stats, updateStats: setStats }}>
//       <div className="bg-gray-100 min-h-screen pb-0 ">
//         {/* Header with profile and earnings (hidden when map is fullscreen) */}
//         {!isMapFullscreen && (
//           <Header />
//         )}

//         {/* Map Section - Full screen when isMapFullscreen is true */}
//         <div className={`relative ${isMapFullscreen ? 'h-screen fixed inset-0 z-40' : 'h-72'}`}>
//           {/* Map Component */}
//           <MapComponent
//             viewState={viewState}
//             setViewState={setViewState}
//             currentLocation={currentLocation}
//             destination={destination}
//             customerLat={selectedOrder?.customerLat}
//             customerLng={selectedOrder?.customerLng}
//             route={route ? { type: 'FeatureCollection', features: [route] } : null}
//             isOnline={isOnline}
//             nearbyOrders={nearbyOrders}
//             handleOrderClick={handleOrderClick}
//             selectedOrder={selectedOrder}
//             orderStatus={orderStatus}
//             popupInfo={popupInfo}
//             setPopupInfo={setPopupInfo}
//             isMapFullscreen={isMapFullscreen}
//             setIsMapFullscreen={setIsMapFullscreen}
//             routeInstructions={routeInstructions}
//           />


//           {/* Status toggle - visible in both normal and fullscreen mode */}
//           <StatusToggle
//             isOnline={isOnline}
//             toggleStatus={toggleStatus}
//           />

//           {/* Active Order Status Bar */}
//           {selectedOrder && orderStatus !== 'pending' && (
//             <div className="absolute top-4 left-4 right-16 bg-white p-3 rounded-lg shadow-lg z-20">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="text-xs uppercase font-bold text-gray-500">Current Order</span>
//                   <h3 className="font-medium">
//                     {orderStatus === 'accepted' ? selectedOrder.shop : selectedOrder.customerName}
//                   </h3>
//                 </div>
//                 <div className="flex">
//                   <button
//                     onClick={() => setShowOrderDetails(true)}
//                     className="bg-green-500 text-white p-2 rounded-lg mr-2 hover:bg-green-600 transition-colors"
//                     aria-label="Show order details"
//                   >
//                     <Check className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => cancelOrder(selectedOrder)}
//                     className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
//                     aria-label="Cancel order"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Content sections - Hidden when map is fullscreen */}
//         {!isMapFullscreen && (
//           <>
//             {/* Stats Section */}
//             <OrderStats />
//             {/* Weekly Incentive */}
//             <IncentiveCard />
//             {/* Recent Orders */}
//             <RecentOrders
//               isOnline={isOnline}
//               nearbyOrders={nearbyOrders.map(({ id, shop, distance, amount }) => ({ id, shop, distance, amount }))}
//               handleOrderClick={({ id, shop, distance, amount }) => {
//                 const order = nearbyOrders.find(o => o.id === id);
//                 if (order) {
//                   handleOrderClick(order);
//                 }
//               }}
//             />
//           </>
//         )}
//         {/* Order Details Modal */}
//         {showOrderDetails && selectedOrder && (
//           <OrderDetails
//             selectedOrder={selectedOrder}
//             orderStatus={orderStatus}
//             setShowOrderDetails={setShowOrderDetails}
//             acceptOrder={acceptOrder}
//             confirmPickup={confirmPickup}
//             completeDelivery={completeDelivery}
//             cancelOrder={cancelOrder}
//           />
//         )}

//         {/* Completed Order Toast Notification */}
//         {orderStatus === 'completed' && (
//           <CompletedToast setOrderStatus={setOrderStatus} />
//         )}

//         {isLoadingRoute && (
//           <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//             <div className="bg-white p-4 rounded-lg shadow-lg">
//               <p className="text-center">Calculating best route...</p>
//               <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div className="h-full bg-blue-500 animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </OrderStatsContext.Provider>
//   );
// }

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Check } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, LineString } from 'geojson';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Order, Location, Destination, PopupInfo } from '../utils/types';
import RecentOrders from './RecentOrders';
import IncentiveCard from './IncentiveCard';
import OrderStats from './OrderStats';
import Header from './Header';
import StatusToggle from './StatusToggle';
import OrderDetails from './OrderDetails';
import CompletedToast from './CompletedToast';
import MapComponent from './MapComponent';
import { getDirections, TurnInstruction } from '../utils/routeService';
import { getDistance, getEstimatedTravelTime } from '../utils/routeService';
import { OrderStore } from '../utils/OrderStore';
import { OrderTrackingService } from '../utils/OrderTrackingService';
import { notificationService } from '../utils/NotificationService';
import { createContext } from 'react';

// Context for order stats
export const OrderStatsContext = createContext({
  stats: { todayOrders: 0, todayDistance: 0, weeklyOrders: 0, weeklyDistance: 0 },
  updateStats: (newStats: any) => { },
});

const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
let locationSocket: WebSocket | null = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [driverId, setDriverId] = useState<number>(1);
  const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 6.8321, lng: 80.3671 });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted' | 'pickup' | 'completed' | 'cancelled'>('pending');
  const [route, setRoute] = useState<Feature<LineString> | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [viewState, setViewState] = useState({ latitude: 6.8321, longitude: 80.3671, zoom: 8 });
  const [routeInstructions, setRouteInstructions] = useState<TurnInstruction[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [routeDuration, setRouteDuration] = useState<number>(0);
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([
    {
      id: "2",
      lat: 6.8521,
      lng: 80.3571,
      customerName: 'Rajith Perera',
      customerPhone: '+94 77 123 4567',
      shop: 'Pizza Hut - Elpitiya',
      shopLat: 6.8521,
      shopLng: 80.3571,
      destination: '24 Main St, Elpitiya',
      customerLat: 6.8621,
      customerLng: 80.3871,
      distance: 3,
      amount: 'LKR 450',
      status: 'pending',
      distanceToShop: 0
    },
    {
      id: "1",
      lat: 6.8221,
      lng: 80.3821,
      customerName: 'Sunimal Fernando',
      customerPhone: '+94 77 987 6543',
      shop: 'KFC - Ambalangoda',
      shopLat: 6.8221,
      shopLng: 80.3821,
      destination: '78 Beach Road, Ambalangoda',
      customerLat: 6.8121,
      customerLng: 80.3971,
      distance: 4,
      amount: 'LKR 780',
      status: 'pending',
      distanceToShop: 0
    },
  ]);
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayDistance: 0,
    weeklyOrders: 0,
    weeklyDistance: 0,
  });

  useEffect(() => {
    const currentStats = OrderTrackingService.getStats();
    setStats({
      todayOrders: currentStats.todayOrders,
      todayDistance: currentStats.todayDistance,
      weeklyOrders: currentStats.weeklyOrders,
      weeklyDistance: currentStats.weeklyDistance,
    });
  }, []);

  const sendLocationUpdate = useCallback(() => {
    if (locationSocket && locationSocket.readyState === WebSocket.OPEN && isOnline) {
      const locationUpdate = { driverId, latitude: currentLocation.lat, longitude: currentLocation.lng };
      try {
        locationSocket.send(JSON.stringify(locationUpdate));
        console.log('Sent location update:', locationUpdate);
      } catch (error) {
        console.error('Error sending location update:', error);
      }
    }
  }, [isOnline, driverId, currentLocation]);

  const fetchDirections = async (origin: { lat: number; lng: number }, dest: { lat: number; lng: number }) => {
    setIsLoadingRoute(true);
    try {
      const routeResult = await getDirections(origin, dest);
      if (routeResult) {
        setRoute(routeResult.route);
        setRouteInstructions(routeResult.instructions);
        setRouteDistance(routeResult.distance);
        setRouteDuration(routeResult.duration);
      } else {
        console.error('No route found');
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentLocation(newLocation);
          setViewState({ latitude: newLocation.lat, longitude: newLocation.lng, zoom: 14 });
        },
        (error) => console.error('Error getting location: ', error)
      );
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      const socket = new SockJS('http://localhost:8080/api/drivermanager/ws-delivery');
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP:', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log('Connected to STOMP WebSocket');
        client.subscribe(`/queue/driver/${driverId}/orders`, async (message) => {
          try {
            const orderData = JSON.parse(message.body);
            const order = orderData.order || orderData;
            const distance = await getDistance(currentLocation.lng, currentLocation.lat, order.customerLat, order.customerLng, MAPBOX_ACCESS_TOKEN);
            const estimatedTime = await getEstimatedTravelTime(order.shopLng, order.shopLat, order.customerLat, order.customerLng, MAPBOX_ACCESS_TOKEN);
            const newOrder: Order = {
              id: order.id || order.orderid,
              lat: order.shopLat,
              lng: order.shopLng,
              customerName: order.customerName || 'Customer',
              customerPhone: order.customerPhone || '+94 77 123 4567',
              shop: order.shopName || 'Shop',
              shopLat: order.shopLat,
              shopLng: order.shopLng,
              destination: order.deliveryAddress || 'Destination',
              customerLat: order.customerLat,
              customerLng: order.customerLng,
              distance: parseFloat(((distance || 0) / 1000).toFixed(2)),
              amount: `LKR ${order.amount || 0}`,
              status: order.status || 'pending',
              distanceToShop: distance || 0,
              estimatedMinutes: estimatedTime || undefined,
            };
            setNearbyOrders((prev) => [...prev, newOrder]);
            notificationService.show('New Order Request', `New order from ${newOrder.shop} (${newOrder.distance}, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`, {
              tag: `order-${newOrder.id}`,
              renotify: true,
              onClick: () => {
                window.focus();
                handleOrderClick(newOrder);
              },
            });
          } catch (error) {
            console.error('Error processing order message:', error);
          }
        });
      };

      client.onStompError = (frame) => console.error('STOMP error:', frame.headers, frame.body);
      client.activate();
      setStompClient(client);

      const locSocket = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
      locSocket.onopen = () => console.log('Location WebSocket connected');
      locSocket.onerror = (error) => console.error('Location WebSocket error:', error);
      locSocket.onclose = () => console.log('Location WebSocket closed');
      locationSocket = locSocket;

      notificationService.requestPermission();

      return () => {
        if (client.active) client.deactivate();
        if (locSocket.readyState === WebSocket.OPEN) locSocket.close();
      };
    } else {
      if (stompClient && stompClient.active) {
        stompClient.deactivate();
        setStompClient(null);
      }
      if (locationSocket && locationSocket.readyState === WebSocket.OPEN) {
        locationSocket.close();
        locationSocket = null;
      }
    }
  }, [isOnline, driverId]);

  useEffect(() => {
    let watchId: number;
    if (navigator.geolocation && isOnline) {
      watchId = navigator.geolocation.watchPosition(
        (position) => setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.error('Error watching location: ', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  useEffect(() => {
    const intervalId = isOnline ? window.setInterval(sendLocationUpdate, 10000) : null;
    if (isOnline) sendLocationUpdate();
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, sendLocationUpdate]);

  useEffect(() => {
    if (orderStatus === 'accepted' || orderStatus === 'pickup') setIsMapFullscreen(true);
  }, [orderStatus]);

  const toggleStatus = () => setIsOnline(!isOnline);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    setOrderStatus('pending');
  };

  const acceptOrder = (order: Order) => {
    if (stompClient && stompClient.active) {
      setSelectedOrder(order);
      setOrderStatus('accepted');
      setShowOrderDetails(true);
      const shopDestination = { lat: order.shopLat, lng: order.shopLng, name: order.shop };
      setDestination(shopDestination);
      fetchDirections({ lat: currentLocation.lat, lng: currentLocation.lng }, { lat: order.shopLat, lng: order.shopLng });
      stompClient.publish({
        destination: `/app/driver/response`,
        body: JSON.stringify({ orderId: order.id, driverId, accepted: true }),
      });
      stompClient.publish({
        destination: `/app/orders/orders-details`,
        body: JSON.stringify({ id: order.id, distance: order.distance, distanceToShop: order.distanceToShop, estimatedTimeToShop: order.estimatedMinutes }),
      });
      setNearbyOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  const confirmPickup = () => {
    if (!selectedOrder || !stompClient || !stompClient.active) return;
    setOrderStatus('pickup');
    const customerDestination = { lat: selectedOrder.customerLat, lng: selectedOrder.customerLng, name: selectedOrder.destination };
    setDestination(customerDestination);
    stompClient.publish({
      destination: `/app/orders/driver-response`,
      body: JSON.stringify({ id: selectedOrder.id, status: 'PICKED_UP' }),
    });
    fetchDirections({ lat: currentLocation.lat, lng: currentLocation.lng }, { lat: selectedOrder.customerLat, lng: selectedOrder.customerLng });
  };

  const completeDelivery = () => {
    if (!selectedOrder || !stompClient || !stompClient.active) return;
    setOrderStatus('completed');
    stompClient.publish({
      destination: `/app/orders/driver-response`,
      body: JSON.stringify({ id: selectedOrder.id, status: 'DELIVERED' }),
    });
    const distanceKm = typeof selectedOrder.distance === 'number' && !isNaN(selectedOrder.distance)
      ? selectedOrder.distance
      : 0;

    const updatedStats = OrderTrackingService.recordCompletedOrder(distanceKm);
    setStats(updatedStats);
    const orderAmount = typeof selectedOrder.amount === 'string' ? parseFloat(selectedOrder.amount.replace('LKR ', '')) : selectedOrder.amount || 0;
    OrderStore.addOrderEarnings(selectedOrder.id, orderAmount);
    setNearbyOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    setRoute(null);
    setDestination(null);
    setIsMapFullscreen(false);
    setShowOrderDetails(false);
  };

  const cancelOrder = (order: Order) => {
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({ id: order.id, status: 'REJECTED' }),
      });
      setOrderStatus('cancelled');
      setRoute(null);
      setDestination(null);
      setIsMapFullscreen(false);
      setNearbyOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  return (
    <OrderStatsContext.Provider value={{ stats, updateStats: setStats }}>
      <div className="w-full">
        {!isMapFullscreen && <Header />}
        <div className={`w-full ${isMapFullscreen ? 'fixed inset-0 z-40' : 'relative h-72'}`}>
          <MapComponent
            viewState={viewState}
            setViewState={setViewState}
            currentLocation={currentLocation}
            destination={destination}
            route={route ? { type: 'FeatureCollection', features: [route] } : null}
            isOnline={isOnline}
            nearbyOrders={nearbyOrders}
            handleOrderClick={handleOrderClick}
            selectedOrder={selectedOrder}
            orderStatus={orderStatus}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
            isMapFullscreen={isMapFullscreen}
            setIsMapFullscreen={setIsMapFullscreen}
            routeInstructions={routeInstructions}
          />
          <StatusToggle isOnline={isOnline} toggleStatus={toggleStatus} />
          {selectedOrder && orderStatus !== 'pending' && (
            <div className="absolute top-4 left-4 right-16 bg-white p-3 rounded-lg shadow-lg z-20">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-500">Current Order</span>
                  <h3 className="font-medium">{orderStatus === 'accepted' ? selectedOrder.shop : selectedOrder.customerName}</h3>
                </div>
                <div className="flex">
                  <button onClick={() => setShowOrderDetails(true)} className="bg-green-500 text-white p-2 rounded-lg mr-2 hover:bg-green-600 transition-colors" aria-label="Show order details">
                    <Check className="h-5 w-5" />
                  </button>
                  <button onClick={() => cancelOrder(selectedOrder)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors" aria-label="Cancel order">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {!isMapFullscreen && (
          <>
            <OrderStats />
            <IncentiveCard />
            <RecentOrders
              isOnline={isOnline}
              nearbyOrders={nearbyOrders.map(({ id, shop, distance, amount }) => ({ id: id.toString(), shop, distance, amount }))}
              handleOrderClick={({ id }) => {
                const order = nearbyOrders.find((o) => o.id === id);
                if (order) handleOrderClick(order);
              }}
            />
          </>
        )}
        {showOrderDetails && selectedOrder && (
          <OrderDetails selectedOrder={selectedOrder} orderStatus={orderStatus} setShowOrderDetails={setShowOrderDetails} acceptOrder={acceptOrder} confirmPickup={confirmPickup} completeDelivery={completeDelivery} cancelOrder={cancelOrder} />
        )}
        {orderStatus === 'completed' && (
          <CompletedToast
            setOrderStatus={(status: string) => setOrderStatus(status as 'pending' | 'accepted' | 'pickup' | 'completed' | 'cancelled')}
          />
        )}
        {isLoadingRoute && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-center">Calculating best route...</p>
              <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OrderStatsContext.Provider>
  );
}
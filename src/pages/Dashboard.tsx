import { useState, useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, LineString } from 'geojson';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Order, Location, Destination } from '../utils/types';
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

// Create a context for order stats
export const OrderStatsContext = createContext({
  stats: { todayOrders: 0, todayDistance: 0, weeklyOrders: 0, weeklyDistance: 0 },
  updateStats: (_newStats: any) => { },
});

const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
let locationSocket: WebSocket | null = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [isToggling, setIsToggling] = useState(false); 
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [driverId, setDriverId] = useState<number>(1);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: 6.8321,
    lng: 80.3671,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    'pending' | 'accepted' | 'pickup' | 'completed' | 'cancelled'
  >('pending');
  const [route, setRoute] = useState<Feature<LineString> | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: 6.8321,
    longitude: 80.3671,
    zoom: 8,
  });
  const [routeInstructions, setRouteInstructions] = useState<TurnInstruction[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [routeDuration, setRouteDuration] = useState<number>(0);
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([
    {
      id: 'order1',
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
      id: 'order2',
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

  // Fetch initial stats
  useEffect(() => {
    const currentStats = OrderTrackingService.getStats();
    setStats({
      todayOrders: currentStats.todayOrders,
      todayDistance: currentStats.todayDistance,
      weeklyOrders: currentStats.weeklyOrders,
      weeklyDistance: currentStats.weeklyDistance,
    });
  }, []);

  // Send location updates
  const sendLocationUpdate = useCallback(() => {
    if (locationSocket && locationSocket.readyState === WebSocket.OPEN && isOnline) {
      const locationUpdate = {
        driverId: driverId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      };
      try {
        locationSocket.send(JSON.stringify(locationUpdate));
        console.log('Sent location update:', locationUpdate);
      } catch (error) {
        console.error('Error sending location update:', error);
      }
    }
  }, [isOnline, driverId, currentLocation]);

  // Fetch directions
  const fetchDirections = async (
    origin: { lat: number; lng: number },
    dest: { lat: number; lng: number }
  ) => {
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

  // Initial location fetch
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // WebSocket setup
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

            const distance = await getDistance(
              currentLocation.lng,
              currentLocation.lat,
              order.customerLng,
              order.customerLat,
              MAPBOX_ACCESS_TOKEN
            );
            const distanceToShop = await getDistance(
              order.shopLng,
              order.shopLat,
              order.customerLng,
              order.customerLat,
              MAPBOX_ACCESS_TOKEN
            );
            const estimatedTime = await getEstimatedTravelTime(
              order.shopLng,
              order.shopLat,
              order.customerLng,
              order.customerLat,
              MAPBOX_ACCESS_TOKEN
            );

            const newOrder: Order = {
              id: order.id || order.orderid,
              lat: order.shopLat,
              lng: order.shopLng,
              customerName: order.customerName || 'Customer',
              customerPhone: order.customerPhone || '+94 77 123 4567',
              shop: order.shop || 'Shop',
              shopLat: order.shopLat,
              shopLng: order.shopLng,
              destination: order.deliveryAddress || 'Destination',
              customerLat: order.customerLat,
              customerLng: order.customerLng,
              distance: distance ?? 0,
              amount: `LKR ${order.amount || 0}`,
              status: order.status || 'pending',
              estimatedMinutes: estimatedTime ? Math.round(estimatedTime) : 0,
              distanceToShop: distanceToShop ? parseFloat((distanceToShop / 1000).toFixed(1)) : 0,
            };
            console.log('New order received:', distance, distanceToShop, estimatedTime);
            setNearbyOrders((prev) => [...prev, newOrder]);
            notificationService.init(NOTIFICATION_AUDIO_SRC);
            notificationService.show(
              'New Order Request',
              `New order from ${newOrder.shop} (${newOrder.distance}, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`,
              {
                tag: `order-${newOrder.id}`,
                renotify: true,
                onClick: () => {
                  window.focus();
                  handleOrderClick(newOrder);
                },
              }
            );
          } catch (error) {
            console.error('Error processing order message:', error);
          }
        });
      };

      client.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers, frame.body);
      };

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

  // Location watching
  useEffect(() => {
    let watchId: number;
    if (navigator.geolocation && isOnline) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
        },
        (error) => console.error('Error watching location:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline]);

  // Location update interval
  useEffect(() => {
    let intervalId: number;
    if (isOnline) {
      intervalId = window.setInterval(sendLocationUpdate, 10000);
      sendLocationUpdate();
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, sendLocationUpdate]);

  // Map fullscreen toggle
  useEffect(() => {
    if (orderStatus === 'accepted' || orderStatus === 'pickup') {
      setIsMapFullscreen(true);
    }
  }, [orderStatus]);

  //const toggleStatus = () => setIsOnline(!isOnline);
  // Toggle online/offline status with API call
  const toggleStatus = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      const response = await fetch('http://localhost:8080/api/drivermanager/api/driver/available', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: driverId,
          available: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update driver status: ${response.statusText}`);
      }

      console.log('Driver status updated successfully:', { id: driverId, available: newStatus });
      notificationService.show(
        'Success',
        newStatus ? 'You are now online and ready to receive orders!' : 'You are now offline.',
        { tag: 'status-update-success' }
      );
    } catch (error) {
      console.error('Error updating driver status:', error);
      setIsOnline(!newStatus); 
      notificationService.show(
        'Error',
        `Failed to update ${newStatus ? 'online' : 'offline'} status. Please try again.`,
        { tag: 'status-update-error' }
      );
    } finally {
      setIsToggling(false);
    }
  };

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
      fetchDirections({ lat: currentLocation.lat, lng: currentLocation.lng }, shopDestination);
      stompClient.publish({
        destination: `/app/driver/response`,
        body: JSON.stringify({ orderId: order.id, driverId, accepted: true }),
      });
      if (!selectedOrder || !stompClient || !stompClient.active) return;
      stompClient.publish({
        destination: `/app/orders/orders-details`,
        body: JSON.stringify({ id: selectedOrder.id, distance:order.distance, distanceToShop: order.distanceToShop ,estimatedTimeToShop: order.estimatedMinutes }),
      });

      setNearbyOrders((prev) => prev.filter((o) => o.id !== order.id));
    }
  };

  const confirmPickup = () => {
    if (!selectedOrder || !stompClient || !stompClient.active) return;
    setOrderStatus('pickup');
    const customerDestination = {
      lat: selectedOrder.customerLat,
      lng: selectedOrder.customerLng,
      name: selectedOrder.destination,
    };
    setDestination(customerDestination);
    stompClient.publish({
      destination: `/app/orders/driver-response`,
      body: JSON.stringify({ id: selectedOrder.id, status: 'PICKED_UP' }),
    });
    fetchDirections({ lat: currentLocation.lat, lng: currentLocation.lng }, customerDestination);
  };

  const completeDelivery = () => {
    if (!selectedOrder || !stompClient || !stompClient.active) return;
    setOrderStatus('completed');
    stompClient.publish({
      destination: `/app/orders/driver-response`,
      body: JSON.stringify({ id: selectedOrder.id, status: 'DELIVERED' }),
    });
    const distanceKm = selectedOrder.distance || 0;
    const updatedStats = OrderTrackingService.recordCompletedOrder(distanceKm);
    setStats(updatedStats);
    const orderAmount = parseFloat(selectedOrder.amount.replace('LKR ', '')) || 0;
    OrderStore.addOrderEarnings(selectedOrder.id, orderAmount);
    setNearbyOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
    setRoute(null);
    setDestination(null);
    setIsMapFullscreen(false);
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const cancelOrder = (order: Order) => {
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({ id: order.id, status: 'REJECTED' }),
      });
      setSelectedOrder(null);
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
            nearbyOrders={nearbyOrders.map(order => ({
              ...order,
              distance: typeof order.distance === 'number' ? `${order.distance} km` : order.distance,
            }))}
            handleOrderClick={(order) => {
              const fullOrder = nearbyOrders.find(o => o.id === order.id);
              if (fullOrder) handleOrderClick(fullOrder);
            }}
            selectedOrder={selectedOrder ? { ...selectedOrder, distance: selectedOrder.distance.toString() } : null}
            orderStatus={orderStatus}
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
                  <h3 className="font-medium">
                    {orderStatus === 'accepted' ? selectedOrder.shop : selectedOrder.customerName}
                  </h3>
                </div>
                <div className="flex">
                  <button
                    onClick={() => setShowOrderDetails(true)}
                    className="bg-green-500 text-white p-2 rounded-lg mr-2 hover:bg-green-600 transition-colors"
                    aria-label="Show order details"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => cancelOrder(selectedOrder)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    aria-label="Cancel order"
                  >
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
              nearbyOrders={nearbyOrders.map(({ id, shop, distance, amount }) => ({
                id,
                shop,
                distance,
                amount,
              }))}
              handleOrderClick={({ id }) => {
                const order = nearbyOrders.find((o) => o.id === id);
                if (order) handleOrderClick(order);
              }}
            />
          </>
        )}
        {showOrderDetails && selectedOrder && (
          <OrderDetails
            selectedOrder={selectedOrder}
            orderStatus={orderStatus}
            setShowOrderDetails={setShowOrderDetails}
            acceptOrder={acceptOrder}
            confirmPickup={confirmPickup}
            completeDelivery={completeDelivery}
            cancelOrder={cancelOrder}
          />
        )}
        {orderStatus === 'completed' && (
          <CompletedToast
            setOrderStatus={(status: string) =>
              setOrderStatus(status as 'pending' | 'accepted' | 'pickup' | 'completed' | 'cancelled')
            }
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
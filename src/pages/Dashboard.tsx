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
const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
let locationSocket: WebSocket | null = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [driverId, setDriverId] = useState<number>(1);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    lat: 6.8321,
    lng: 80.3671
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted' | 'pickup' | 'completed'>('pending');
  const [route, setRoute] = useState<Feature<LineString> | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [OrderId, setOrderId] = useState<string | null>(''); // support null if needed

  const [popupInfo, setPopupInfo] =
    useState<PopupInfo | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 6.8321,
    longitude: 80.3671,
    zoom: 8
  });
  // Add these state variables to your Dashboard component
  const [routeInstructions, setRouteInstructions] = useState<TurnInstruction[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeDistance, setRouteDistance] = useState<number>(0);
  const [routeDuration, setRouteDuration] = useState<number>(0);
  // Sample nearby orders
  const [nearbyOrders, setNearbyOrders] = useState<Order[]>([
    {
      id: 'order1',
      lat: 6.8321 + 0.02,
      lng: 80.3671 - 0.01,
      customerName: 'Rajith Perera',
      customerPhone: '+94 77 123 4567',
      shop: 'Pizza Hut - Elpitiya',
      shopLat: 6.8321 + 0.02,
      shopLng: 80.3671 - 0.01,
      destination: '24 Main St, Elpitiya',
      customerLat: 6.8321 + 0.03,
      customerLng: 80.3671 + 0.02,
      distance: '3.2 km',
      amount: 'LKR 450',
      status: 'pending'
    },
    {
      id: 'order2',
      lat: 6.8321 - 0.01,
      lng: 80.3671 + 0.015,
      customerName: 'Sunimal Fernando',
      customerPhone: '+94 77 987 6543',
      shop: 'KFC - Ambalangoda',
      shopLat: 6.8321 - 0.01,
      shopLng: 80.3671 + 0.015,
      destination: '78 Beach Road, Ambalangoda',
      customerLat: 6.8321 - 0.02,
      customerLng: 80.3671 + 0.03,
      distance: '4.8 km',
      amount: 'LKR 780',
      status: 'pending'
    }
  ]);

  // Function to send location updates to the server
  const sendLocationUpdate = useCallback(() => {
    if (locationSocket && locationSocket.readyState === WebSocket.OPEN && isOnline) {
      const locationUpdate = {
        driverId: driverId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng
      };

      try {
        locationSocket.send(JSON.stringify(locationUpdate));
        console.log('Sent location update:', locationUpdate);
      } catch (error) {
        console.error('Error sending location update:', error);
      }
    }
  }, [isOnline, driverId, currentLocation, locationSocket]);


  // Add this function to fetch directions
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
        // Handle route not found error
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      // Handle error
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      const silentAudio = new Audio();
      silentAudio.muted = true;
      silentAudio.play().catch(() => { });
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
  }, []);


  // Initialize notification sound
  useEffect(() => {
    const audio = new Audio(NOTIFICATION_AUDIO_SRC);
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.onerror = () => {
      console.warn('Primary audio failed. Using fallback audio.');
      const fallbackAudio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgA...');
      audioRef.current = fallbackAudio;
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Error playing notification:', err));
    }
  }, []);
  //   if (Notification.permission === 'granted') {
  //     showNotification('Test Notification', 'This is a test notification');
  //   } else if (Notification.permission !== 'denied') {
  //     Notification.requestPermission().then(permission => {
  //       if (permission === 'granted') {
  //         showNotification('Test Notification', 'This is a test notification');
  //       }
  //     });
  //   } else {
  //     console.warn('Notification permission denied by user');
  //     alert('Please enable notifications in your browser settings to receive order alerts.');
  //   }

  // Universal Browser Notification System
  const UniversalNotificationSystem = {
    // Check if notifications are supported
    isSupported() {
      return 'Notification' in window;
    },

    // Get current permission status
    getPermissionStatus() {
      if (!this.isSupported()) return 'unsupported';
      return Notification.permission;
    },

    // Handle permission request for all browsers
    async requestPermission() {
      if (!this.isSupported()) {
        console.warn('Notifications not supported in this browser');
        return false;
      }

      try {
        const permission = await Notification.requestPermission();
        console.log(`Notification permission response: ${permission}`);
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    },

    // Handle service worker registration for all browsers
    async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/notification-sw.js');
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          return registration;
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
          return null;
        }
      }
      return null;
    },

    // Show notification with browser-specific optimizations
    show(title: string, message: string, options: { tag?: string; renotify?: boolean; onClick?: () => void } = {}) {
      if (!this.isSupported()) {
        console.warn('Notifications not supported');
        this.showFallback(title, message);
        return null;
      }

      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        this.showFallback(title, message);
        return null;
      }

      try {
        // Default notification options that work across browsers
        const notificationOptions = {
          body: message,
          icon: '/active.png',
          badge: '/badge-icon.png',
          tag: options.tag || 'default-notification',
          requireInteraction: true,
          renotify: options.renotify || false,
          silent: false,
          ...options
        };

        console.log('Creating notification with options:', notificationOptions);

        // Create notification
        const notification = new Notification(title, notificationOptions);

        // Event handlers for debugging
        notification.onshow = () => console.log('Notification shown successfully');
        notification.onclick = (options as { onClick?: () => void }).onClick || (() => {
          console.log('Notification clicked');
          window.focus();
          notification.close();
        });
        notification.onerror = (err) => {
          console.error('Notification error:', err);
          this.showFallback(title, message);
        };

        return notification;
      } catch (error) {
        console.error('Failed to create notification:', error);
        this.showFallback(title, message);
        return null;
      }
    },

    // Fallback to in-app notification
    showFallback(title: string, message: string) {
      console.log('Using fallback notification method');
      this.showInAppNotification(title, message);
    },

    // Create an in-app notification as fallback
    showInAppNotification(title: string | null, message: string | null, duration = 7000) {
      // Create container if it doesn't exist
      let container = document.getElementById('in-app-notification-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'in-app-notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }

      // Create notification element
      const notification = document.createElement('div');
      notification.style.backgroundColor = '#333';
      notification.style.color = 'white';
      notification.style.padding = '15px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.style.marginBottom = '10px';
      notification.style.width = '300px';
      notification.style.position = 'relative';

      // Add title
      const titleEl = document.createElement('h4');
      titleEl.textContent = title;
      titleEl.style.margin = '0 0 5px 0';
      notification.appendChild(titleEl);

      // Add message
      const messageEl = document.createElement('p');
      messageEl.textContent = message;
      messageEl.style.margin = '0';
      notification.appendChild(messageEl);

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = 'white';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        notification.remove();
      };
      notification.appendChild(closeButton);

      // Add to container
      container.appendChild(notification);

      // Remove after duration
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, duration);
    },

    // Test notifications
    async test() {
      console.log('Testing notification system...');
      console.log('Browser:', this.getBrowserInfo());
      console.log('Notification supported:', this.isSupported());
      console.log('Current permission:', this.getPermissionStatus());

      if (!this.isSupported()) {
        alert('Your browser does not support notifications. Using in-app notifications instead.');
        this.showFallback('Test Notification', 'This is a fallback notification');
        return false;
      }

      if (Notification.permission === 'denied') {
        alert('Notifications are blocked in your browser settings. Please enable them to receive notifications.');
        this.showFallback('Test Notification', 'This is a fallback because notifications are blocked');
        return false;
      }

      if (Notification.permission === 'default') {
        const granted = await this.requestPermission();
        if (!granted) {
          alert('Notification permission was not granted. Using in-app notifications instead.');
          this.showFallback('Test Notification', 'This is a fallback notification');
          return false;
        }
      }

      // Try to register service worker for better reliability
      await this.registerServiceWorker();

      // Show test notification
      const notification = this.show(
        'Test Notification',
        'If you can see this, notifications are working properly!',
        {
          tag: 'test-notification',
          renotify: true
        }
      );

      return notification !== null;
    },

    // Get browser information for debugging
    getBrowserInfo() {
      const userAgent = navigator.userAgent;
      let browserName;

      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
      } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
      } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
      } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
      } else {
        browserName = "Unknown";
      }

      return browserName;
    },

    // Initialize the notification system
    init() {
      console.log('Initializing notification system for', this.getBrowserInfo());

      // If service workers are supported, register one
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          this.registerServiceWorker();
        });
      }

      // Return current permission state
      return this.getPermissionStatus();
    }
  };

  // Initialize WebSocket connection when driver goes online
  useEffect(() => {
    if (isOnline) {
      // Initialize STOMP client for order notifications
      const socket = new SockJS('http://localhost:8080/api/drivermanager/ws-delivery');
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });

      client.onConnect = () => {
        console.log('Connected to STOMP WebSocket');
        client.subscribe(`/queue/driver/${driverId}/orders`, (message) => {
          try {
            const orderData = JSON.parse(message.body);
            console.log('Received new order data:', orderData);

            // Extract order and additional info
            const order = orderData.order || orderData;
            const distanceKm = orderData.distanceKm;
            const estimatedMinutes = orderData.estimatedMinutes;
            console.log(order);
            setOrderId(order.orderId); // this stores the correct string like "ORD12345678"
            console.log('addddddddddd', OrderId);
            // Convert backend order to frontend format
            const newOrder: Order = {
              id: order.orderid,
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
              distance: `${distanceKm ? distanceKm.toFixed(1) : (order.distance || 0).toFixed(1)} km`,
              amount: `LKR ${order.amount || 0}`,
              status: order.status || 'pending',
              estimatedMinutes: estimatedMinutes || undefined
            };

            console.log('New order object:', newOrder);
            // Add to nearby orders
            setNearbyOrders(prevOrders => [...prevOrders, newOrder]);
            console.log('New order added to nearby orders:', newOrder);
            // Play notification sound
            playNotificationSound();

            // Show notification using universal system
            UniversalNotificationSystem.show(
              'New Order Request',
              `New order from ${newOrder.shop} (${newOrder.distance}, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`,
              {
                tag: `order-${newOrder.id}`,
                renotify: true,
                onClick: () => {
                  console.log('Order notification clicked:', newOrder.id);
                  window.focus();
                }
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

      // Initialize raw WebSocket for location updates
      const locSocket = new WebSocket(DRIVER_LOCATION_WEBSOCKET);

      locSocket.onopen = () => {
        console.log('Location WebSocket connected');
      };

      locSocket.onerror = (error) => {
        console.error('Location WebSocket error:', error);
      };

      locSocket.onclose = () => {
        console.log('Location WebSocket closed');
      };

      locationSocket = locSocket;

      // Request notification permission
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }

      // Clean up on unmount or when going offline
      return () => {
        if (client.active) {
          client.deactivate();
        }

        if (locSocket.readyState === WebSocket.OPEN) {
          locSocket.close();
        }
      };
    } else {
      // Disconnect when driver goes offline
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

  // Get current location and set up location watching
  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation && isOnline) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 14
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );

      // Set up continuous location watching
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error("Error watching location: ", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }

    // Clean up watch on unmount or when going offline
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  // Send location updates periodically when online
  useEffect(() => {
    let intervalId: number;

    if (isOnline) {
      // Send location update every 10 seconds
      intervalId = window.setInterval(sendLocationUpdate, 10000);

      // Send an initial update
      sendLocationUpdate();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOnline, sendLocationUpdate]);

  // Auto set map to fullscreen when an order is accepted
  useEffect(() => {
    if (orderStatus === 'accepted' || orderStatus === 'pickup') {
      setIsMapFullscreen(true);
    }
  }, [orderStatus]);

  // Toggle online status
  const toggleStatus = () => {
    setIsOnline(!isOnline);
  };


  // Handle order selection
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    setOrderStatus('pending');
  };

  // // Handle accepting an order
  // const acceptOrder = (order: Order) => {
  //   if (stompClient && stompClient.active) {
  //     setSelectedOrder(order);
  //     setOrderStatus('accepted');
  //     setShowOrderDetails(true);

  //     // Create a destination for the shop
  //     setDestination({
  //       lat: order.shopLat,
  //       lng: order.shopLng,
  //       name: order.shop
  //     });

  //     stompClient.publish({
  //       destination: `/app/driver/response`,
  //       body: JSON.stringify({
  //         orderId: order.id,
  //         driverId: driverId,
  //         accepted: true
  //       })
  //     });


  //     // Remove the order from nearby orders
  //     setNearbyOrders(prevOrders =>
  //       prevOrders.filter(o => o.id !== order.id)
  //     );

  //   }
  // };
  // Update your acceptOrder function
  // const acceptOrder = (order: Order) => {
  //   if (stompClient && stompClient.active) {
  //     setSelectedOrder(order);
  //     setOrderStatus('accepted');
  //     setShowOrderDetails(true);

  //     // Create a destination for the shop
  //     const shopDestination = {
  //       lat: order.shopLat,
  //       lng: order.shopLng,
  //       name: order.shop
  //     };
  //     setDestination(shopDestination);

  //     // Fetch directions to the shop
  //     fetchDirections(
  //       { lat: currentLocation.lat, lng: currentLocation.lng },
  //       { lat: order.shopLat, lng: order.shopLng }
  //     );

  //     stompClient.publish({
  //       destination: `/app/driver/response`,
  //       body: JSON.stringify({
  //         orderId: order.id,
  //         driverId: driverId,
  //         accepted: true
  //       })
  //     });

  //     // Remove the order from nearby orders
  //     setNearbyOrders(prevOrders =>
  //       prevOrders.filter(o => o.id !== order.id)
  //     );
  //   }
  // };
  const acceptOrder = (order: Order) => {
    if (stompClient && stompClient.active) {
      setSelectedOrder(order);
      setOrderStatus('accepted');
      setShowOrderDetails(true);

      // Create a destination for the shop
      const shopDestination = {
        lat: order.shopLat,
        lng: order.shopLng,
        name: order.shop
      };
      setDestination(shopDestination);

      // Fetch directions to the shop
      fetchDirections(
        { lat: currentLocation.lat, lng: currentLocation.lng },
        { lat: order.shopLat, lng: order.shopLng }
      );

      // UPDATED: Changed the destination path to match the new endpoint
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({
          orderId: order.id,
          driverId: driverId,
          status: 'ACCEPTED'
        })
      });

      // Remove the order from nearby orders
      setNearbyOrders(prevOrders =>
        prevOrders.filter(o => o.id !== order.id)
      );
    }
  };

  // // Confirm pickup
  // const confirmPickup = () => {
  //   if (!selectedOrder) return;

  //   // Update order status
  //   setOrderStatus('pickup');

  //   // Update the order in the list
  //   const updatedOrders = nearbyOrders.map(order =>
  //     order.id === selectedOrder.id
  //       ? { ...order, status: 'pickup' }
  //       : order
  //   );
  //   setNearbyOrders(updatedOrders);

  //   // Set customer as destination and calculate directions
  //   setDestination({
  //     lat: selectedOrder.customerLat,
  //     lng: selectedOrder.customerLng,
  //     name: selectedOrder.destination
  //   });

  // };


  // // Update your confirmPickup function
  // const confirmPickup = () => {
  //   if (!selectedOrder) return;

  //   // Update order status
  //   setOrderStatus('pickup');

  //   // Update the order in the list
  //   const updatedOrders = nearbyOrders.map(order =>
  //     order.id === selectedOrder.id
  //       ? { ...order, status: 'pickup' }
  //       : order
  //   );
  //   setNearbyOrders(updatedOrders);

  //   // Set customer as destination and calculate directions
  //   const customerDestination = {
  //     lat: selectedOrder.customerLat,
  //     lng: selectedOrder.customerLng,
  //     name: selectedOrder.destination
  //   };
  //   setDestination(customerDestination);



  //   // Fetch directions to the customer
  //   fetchDirections(
  //     { lat: currentLocation.lat, lng: currentLocation.lng },
  //     { lat: selectedOrder.customerLat, lng: selectedOrder.customerLng }
  //   );


  // };
  // Update your confirmPickup function
  const confirmPickup = () => {
    if (!selectedOrder) return;

    // Update order status
    setOrderStatus('pickup');

    // Update the order in the list
    const updatedOrders = nearbyOrders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: 'pickup' }
        : order
    );
    setNearbyOrders(updatedOrders);

    // Set customer as destination and calculate directions
    const customerDestination = {
      lat: selectedOrder.customerLat,
      lng: selectedOrder.customerLng,
      name: selectedOrder.destination
    };
    setDestination(customerDestination);

    // UPDATED: Send pickup confirmation to server
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({
          orderId: selectedOrder.id,
          driverId: driverId,
          status: 'PICKED_UP'
        })
      });
    }

    // Fetch directions to the customer
    fetchDirections(
      { lat: currentLocation.lat, lng: currentLocation.lng },
      { lat: selectedOrder.customerLat, lng: selectedOrder.customerLng }
    );
  };

  // // Complete delivery
  // const completeDelivery = () => {
  //   if (!selectedOrder) return;

  //   // Update order status
  //   setOrderStatus('completed');

  //   // Update the order in the list
  //   const updatedOrders = nearbyOrders.filter(order =>
  //     order.id !== selectedOrder.id
  //   );
  //   setNearbyOrders(updatedOrders);

  //   // Clear directions and destination
  //   setRoute(null);
  //   setDestination(null);
  //   setIsMapFullscreen(false);

  //   // Close order details
  //   setShowOrderDetails(false);
  // };
  // Complete delivery function
  const completeDelivery = () => {
    if (!selectedOrder) return;

    // Update order status
    setOrderStatus('completed');

    // UPDATED: Send completed status to server
    if (stompClient && stompClient.active) {
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({
          orderId: selectedOrder.id,
          driverId: driverId,
          status: 'DELIVERED'
        })
      });
    }

    // Update the order in the list
    const updatedOrders = nearbyOrders.filter(order =>
      order.id !== selectedOrder.id
    );
    setNearbyOrders(updatedOrders);

    // Clear directions and destination
    setRoute(null);
    setDestination(null);
    setIsMapFullscreen(false);

    // Close order details
    setShowOrderDetails(false);
  };

  // // Cancel order
  // const cancelOrder = (order: Order) => {
  //   if (stompClient && stompClient.active) {
  //     // Send rejection message back to server
  //     stompClient.publish({
  //       destination: `/app/driver/response`,
  //       body: JSON.stringify({
  //         orderId: order.id,
  //         driverId: driverId,
  //         accepted: false
  //       })
  //     });

  //     // Remove the order from nearby orders
  //     setNearbyOrders(prevOrders =>
  //       prevOrders.filter(o => o.id !== order.id)
  //     );
  //   }
  // };

  // Cancel order
  const cancelOrder = (order: Order) => {
    if (stompClient && stompClient.active) {
      // UPDATED: Send rejection message back to server with new endpoint and status
      stompClient.publish({
        destination: `/app/orders/driver-response`,
        body: JSON.stringify({
          orderId: order.id,
          driverId: driverId,
          status: 'REJECTED'
        })
      });

      // Remove the order from nearby orders
      setNearbyOrders(prevOrders =>
        prevOrders.filter(o => o.id !== order.id)
      );
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* Header with profile and earnings (hidden when map is fullscreen) */}
      {!isMapFullscreen && (
        <Header />
      )}

      {/* Map Section - Full screen when isMapFullscreen is true */}
      <div className={`relative ${isMapFullscreen ? 'h-screen fixed inset-0 z-40' : 'h-72'}`}>
        {/* Map Component */}
        <MapComponent
          viewState={viewState}
          setViewState={setViewState}
          currentLocation={currentLocation}
          destination={destination}
          customerLat={selectedOrder?.customerLat}
          customerLng={selectedOrder?.customerLng}
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


        {/* Status toggle - visible in both normal and fullscreen mode */}
        <StatusToggle
          isOnline={isOnline}
          toggleStatus={toggleStatus}
        />

        {/* Active Order Status Bar */}
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

      {/* Content sections - Hidden when map is fullscreen */}
      {!isMapFullscreen && (
        <>
          {/* Stats Section */}
          <OrderStats />
          {/* Weekly Incentive */}
          <IncentiveCard />
          {/* Recent Orders */}
          <RecentOrders
            isOnline={isOnline}
            nearbyOrders={nearbyOrders.map(({ id, shop, distance, amount }) => ({ id, shop, distance, amount }))}
            handleOrderClick={({ id, shop, distance, amount }) => {
              const order = nearbyOrders.find(o => o.id === id);
              if (order) {
                handleOrderClick(order);
              }
            }}
          />
        </>
      )}
      {/* Order Details Modal */}
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

      {/* Completed Order Toast Notification */}
      {orderStatus === 'completed' && (
        <CompletedToast setOrderStatus={setOrderStatus} />
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
  );
}

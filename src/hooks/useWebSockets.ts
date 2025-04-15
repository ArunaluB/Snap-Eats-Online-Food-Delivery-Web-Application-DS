// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Client, IMessage } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
// const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
// const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface OrderData {
//   order: any;
//   distanceKm?: number;
//   estimatedMinutes?: number;
// }

// interface Order {
//   id: string;
//   lat: number;
//   lng: number;
//   customerName: string;
//   customerPhone: string;
//   shop: string;
//   shopLat: number;
//   shopLng: number;
//   destination: string;
//   customerLat: number;
//   customerLng: number;
//   distance: string;
//   amount: string;
//   status: string;
//   estimatedMinutes?: number;
// }

// /**
//  * Hook for managing WebSocket connections for driver location updates
//  */
// export const useLocationWebSocket = (
//   isOnline: boolean,
//   driverId: string,
//   currentLocation: Location
// ) => {
//   const [locationSocket, setLocationSocket] = useState<WebSocket | null>(null);

//   // Function to send location updates to the server
//   const sendLocationUpdate = useCallback(() => {
//     if (locationSocket && locationSocket.readyState === WebSocket.OPEN && isOnline) {
//       const locationUpdate = {
//         driverId: driverId,
//         latitude: currentLocation.lat,
//         longitude: currentLocation.lng,
//       };

//       try {
//         locationSocket.send(JSON.stringify(locationUpdate));
//         console.log('Sent location update:', locationUpdate);
//       } catch (error) {
//         console.error('Error sending location update:', error);
//       }
//     }
//   }, [isOnline, driverId, currentLocation, locationSocket]);

//   // Initialize WebSocket connection when driver goes online
//   useEffect(() => {
//     let locSocket: WebSocket | null = null;

//     if (isOnline) {
//       locSocket = new WebSocket(DRIVER_LOCATION_WEBSOCKET);

//       locSocket.onopen = () => {
//         console.log('Location WebSocket connected');
//       };

//       locSocket.onerror = (error) => {
//         console.error('Location WebSocket error:', error);
//       };

//       locSocket.onclose = () => {
//         console.log('Location WebSocket closed');
//       };

//       setLocationSocket(locSocket);

//       return () => {
//         if (locSocket && locSocket.readyState === WebSocket.OPEN) {
//           locSocket.close();
//         }
//       };
//     } else {
//       if (locationSocket && locationSocket.readyState === WebSocket.OPEN) {
//         locationSocket.close();
//         setLocationSocket(null);
//       }
//     }
//   }, [isOnline, locationSocket]);

//   useEffect(() => {
//     let intervalId: number | undefined;

//     if (isOnline && locationSocket) {
//       intervalId = window.setInterval(sendLocationUpdate, 10000);
//       sendLocationUpdate();
//     }

//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [isOnline, sendLocationUpdate, locationSocket]);

//   return { sendLocationUpdate };
// };

// /**
//  * Hook for managing order notifications via STOMP
//  */
// export const useOrderNotifications = (
//   isOnline: boolean,
//   driverId: string,
//   playNotificationSound: () => void,
//   UniversalNotificationSystem: {
//     show: (title: string, message: string, options?: any) => void;
//   }
// ) => {
//   const [stompClient, setStompClient] = useState<Client | null>(null);
//   //const [nearbyOrders, setNearbyOrders] = useState<Order[]>([]);
//   const [nearbyOrders, setNearbyOrders] = useState<Order[]>([
//     {
//       id: 'order1',
//       lat: 6.8521,
//       lng: 80.3571,
//       customerName: 'Rajith Perera',
//       customerPhone: '+94 77 123 4567',
//       shop: 'Pizza Hut - Elpitiya',
//       shopLat: 6.8521,
//       shopLng: 80.3571,
//       destination: '24 Main St, Elpitiya',
//       customerLat: 6.8621,
//       customerLng: 80.3871,
//       distance: '3.2 km',
//       amount: 'LKR 450',
//       status: 'pending'
//     },
//     {
//       id: 'order2',
//       lat: 6.8221,
//       lng: 80.3821,
//       customerName: 'Sunimal Fernando',
//       customerPhone: '+94 77 987 6543',
//       shop: 'KFC - Ambalangoda',
//       shopLat: 6.8221,
//       shopLng: 80.3821,
//       destination: '78 Beach Road, Ambalangoda',
//       customerLat: 6.8121,
//       customerLng: 80.3971,
//       distance: '4.8 km',
//       amount: 'LKR 780',
//       status: 'pending'
//     }
//   ]);
  

//   useEffect(() => {
//     let client: Client;

//     if (isOnline) {
//       const socket = new SockJS('http://localhost:8080/api/drivermanager/ws-delivery');

//       client = new Client({
//         webSocketFactory: () => socket,
//         debug: (str) => console.log('STOMP:', str),
//         reconnectDelay: 5000,
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000,
//       });

//       client.onConnect = () => {
//         console.log('Connected to STOMP WebSocket');
//         client.subscribe(`/queue/driver/${driverId}/orders`, (message: IMessage) => {
//           try {
//             const orderData: OrderData = JSON.parse(message.body);

//             const order = orderData.order || orderData;
//             const distanceKm = orderData.distanceKm;
//             const estimatedMinutes = orderData.estimatedMinutes;

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
//               distance: `${distanceKm ? distanceKm.toFixed(1) : (order.distance || 0).toFixed(1)} km`,
//               amount: `LKR ${order.amount || 0}`,
//               status: order.status || 'pending',
//               estimatedMinutes: estimatedMinutes,
//             };

//             setNearbyOrders((prevOrders) => [...prevOrders, newOrder]);
//             console.log('New order added to nearby orders:', newOrder);

//             playNotificationSound();

//             UniversalNotificationSystem.show(
//               'New Order Request',
//               `New order from ${newOrder.shop} (${newOrder.distance}, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`,
//               {
//                 tag: `order-${newOrder.id}`,
//                 renotify: true,
//                 onClick: () => {
//                   console.log('Order notification clicked:', newOrder.id);
//                   window.focus();
//                 },
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

//       return () => {
//         if (client.active) {
//           client.deactivate();
//         }
//       };
//     } else {
//       if (stompClient && stompClient.active) {
//         stompClient.deactivate();
//         setStompClient(null);
//       }
//     }
//   }, [isOnline, driverId, playNotificationSound, UniversalNotificationSystem]);

//   const acceptOrder = (order: Order) => {
//     if (stompClient && stompClient.active) {
//       stompClient.publish({
//         destination: `/app/driver/response`,
//         body: JSON.stringify({
//           orderId: order.id,
//           driverId,
//           accepted: true,
//         }),
//       });

//       setNearbyOrders((prevOrders) =>
//         prevOrders.filter((o) => o.id !== order.id)
//       );
//     }
//   };

//   const cancelOrder = (order: Order) => {
//     if (stompClient && stompClient.active) {
//       stompClient.publish({
//         destination: `/app/driver/response`,
//         body: JSON.stringify({
//           orderId: order.id,
//           driverId,
//           accepted: false,
//         }),
//       });

//       setNearbyOrders((prevOrders) =>
//         prevOrders.filter((o) => o.id !== order.id)
//       );
//     }
//   };

//   return { stompClient, nearbyOrders, setNearbyOrders, acceptOrder, cancelOrder };
// };

// /**
//  * Hook for managing notification sounds
//  */
// export const useNotificationSound = () => {
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     const audio = new Audio(NOTIFICATION_AUDIO_SRC);
//     audio.preload = 'auto';
//     audioRef.current = audio;

//     audio.onerror = () => {
//       console.warn('Primary audio failed. Using fallback audio.');
//       const fallbackAudio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgA...');
//       audioRef.current = fallbackAudio;
//     };

//     const unlockAudio = () => {
//       const silentAudio = new Audio();
//       silentAudio.muted = true;
//       silentAudio.play().catch(() => {});
//       window.removeEventListener('click', unlockAudio);
//     };
//     window.addEventListener('click', unlockAudio);

//     return () => {
//       window.removeEventListener('click', unlockAudio);
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   const playNotificationSound = useCallback(() => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play().catch((err) =>
//         console.error('Error playing notification:', err)
//       );
//     }
//   }, []);

//   return playNotificationSound;
// };


import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_BASE_URL = 'ws://localhost:8080/api/drivermanager';
const DRIVER_LOCATION_WEBSOCKET = `${WEBSOCKET_BASE_URL}/ws/driver-location`;
const NOTIFICATION_AUDIO_SRC = '/sweet_but_psycho.mp3';

interface Location {
  lat: number;
  lng: number;
}

interface OrderData {
  order: any;
  distanceKm?: number;
  estimatedMinutes?: number;
}

interface Order {
  id: string;
  lat: number;
  lng: number;
  customerName: string;
  customerPhone: string;
  shop: string;
  shopLat: number;
  shopLng: number;
  destination: string;
  customerLat: number;
  customerLng: number;
  distance: string;
  amount: string;
  status: string;
  estimatedMinutes?: number;
}

/**
 * Hook for managing WebSocket connections for driver location updates
 */
export const useLocationWebSocket = (
  isOnline: boolean,
  driverId: string,
  currentLocation: Location
) => {
  // Use refs for better connection management
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const maxReconnectAttempts = 5;
  
  // Function to close existing socket
  const closeSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      try {
        socketRef.current.close();
        console.log('Location WebSocket closed successfully');
      } catch (err) {
        console.error('Error closing WebSocket:', err);
      }
      socketRef.current = null;
    }
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Function to establish WebSocket connection with reconnection logic
  const connectSocket = useCallback(() => {
    closeSocket();
    
    if (!isOnline) return;
    
    try {
      console.log('Creating location WebSocket connection...');
      const socket = new WebSocket(DRIVER_LOCATION_WEBSOCKET);
      
      socket.onopen = () => {
        console.log('Location WebSocket connected successfully');
        reconnectAttemptRef.current = 0; // Reset reconnect counter on success
      };
      
      socket.onmessage = (event) => {
        console.log('Location WebSocket received message:', event.data);
      };
      
      socket.onerror = (error) => {
        console.error('Location WebSocket error:', error);
      };
      
      socket.onclose = (event) => {
        console.log('Location WebSocket closed with code:', event.code);
        
        // Try to reconnect if still online and not reached max attempts
        if (isOnline && reconnectAttemptRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
          console.log(`Attempting to reconnect location WebSocket in ${delay}ms (attempt ${reconnectAttemptRef.current + 1})`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptRef.current++;
            connectSocket();
          }, delay);
        } else if (reconnectAttemptRef.current >= maxReconnectAttempts) {
          console.error('Max reconnection attempts reached for location WebSocket');
        }
      };
      
      socketRef.current = socket;
    } catch (error) {
      console.error('Error establishing location WebSocket connection:', error);
    }
  }, [isOnline, closeSocket]);

  // Function to send location updates to the server
  const sendLocationUpdate = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && isOnline) {
      const locationUpdate = {
        driverId: driverId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        timestamp: new Date().toISOString()
      };

      try {
        socketRef.current.send(JSON.stringify(locationUpdate));
        console.log('Sent location update:', locationUpdate);
      } catch (error) {
        console.error('Error sending location update:', error);
        
        // If sending fails, try to reconnect
        connectSocket();
      }
    } else if (isOnline && (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)) {
      console.warn('WebSocket not connected. Attempting to reconnect...');
      connectSocket();
    }
  }, [isOnline, driverId, currentLocation, connectSocket]);

  // Initialize WebSocket connection when driver goes online
  useEffect(() => {
    if (isOnline) {
      connectSocket();
    } else {
      closeSocket();
      reconnectAttemptRef.current = 0;
    }

    return () => {
      closeSocket();
    };
  }, [isOnline, connectSocket, closeSocket]);

  // Set up interval for sending location updates
  useEffect(() => {
    let intervalId: number | undefined;

    if (isOnline) {
      // Send location update every 10 seconds
      intervalId = window.setInterval(() => {
        sendLocationUpdate();
      }, 10000);
      
      // Initial delay before sending first update to ensure connection is ready
      const initialUpdateTimeout = window.setTimeout(() => {
        sendLocationUpdate();
      }, 2000);
      
      return () => {
        window.clearInterval(intervalId);
        window.clearTimeout(initialUpdateTimeout);
      };
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isOnline, sendLocationUpdate]);

  return { sendLocationUpdate };
};

/**
 * Hook for managing order notifications via STOMP
 */
export const useOrderNotifications = (
  isOnline: boolean,
  driverId: string,
  playNotificationSound: () => void,
  UniversalNotificationSystem: {
    show: (title: string, message: string, options?: any) => any;
  }
) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
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
      distance: '3.2 km',
      amount: 'LKR 450',
      status: 'pending'
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
      distance: '4.8 km',
      amount: 'LKR 780',
      status: 'pending'
    }
  ]);
  
  // Reference to track connection state
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    let client: Client | null = null;

    const connectStomp = () => {
      if (!isOnline || isConnectingRef.current) return;
      
      isConnectingRef.current = true;
      
      try {
        console.log('Initiating STOMP connection...');
        const socket = new SockJS('http://localhost:8080/api/drivermanager/ws-delivery');
        
        client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => console.log('STOMP:', str),
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          console.log('Connected to STOMP WebSocket');
          isConnectingRef.current = false;
          reconnectAttemptRef.current = 0;
          setStompClient(client);
          
          client?.subscribe(`/queue/driver/${driverId}/orders`, (message: IMessage) => {
            try {
              const orderData: OrderData = JSON.parse(message.body);

              const order = orderData.order || orderData;
              const distanceKm = orderData.distanceKm;
              const estimatedMinutes = orderData.estimatedMinutes;

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
                distance: `${distanceKm ? distanceKm.toFixed(1) : (order.distance || 0).toFixed(1)} km`,
                amount: `LKR ${order.amount || 0}`,
                status: order.status || 'pending',
                estimatedMinutes: estimatedMinutes,
              };

              setNearbyOrders((prevOrders) => [...prevOrders, newOrder]);
              console.log('New order added to nearby orders:', newOrder);

              playNotificationSound();

              UniversalNotificationSystem.show(
                'New Order Request',
                `New order from ${newOrder.shop} (${newOrder.distance}, ETA: ${newOrder.estimatedMinutes || 'N/A'} min)`,
                {
                  tag: `order-${newOrder.id}`,
                  renotify: true,
                  onClick: () => {
                    console.log('Order notification clicked:', newOrder.id);
                    window.focus();
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
          isConnectingRef.current = false;
          
          // Try to reconnect with exponential backoff
          if (isOnline && reconnectAttemptRef.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
            console.log(`Attempting to reconnect STOMP in ${delay}ms (attempt ${reconnectAttemptRef.current + 1})`);
            
            if (reconnectTimeoutRef.current) {
              window.clearTimeout(reconnectTimeoutRef.current);
            }
            
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectAttemptRef.current++;
              connectStomp();
            }, delay);
          }
        };
        
        client.onWebSocketClose = () => {
          console.log('STOMP WebSocket connection closed');
          isConnectingRef.current = false;
          
          // Try to reconnect if closed unexpectedly and still online
          if (isOnline && reconnectAttemptRef.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
            console.log(`Attempting to reconnect STOMP in ${delay}ms (attempt ${reconnectAttemptRef.current + 1})`);
            
            if (reconnectTimeoutRef.current) {
              window.clearTimeout(reconnectTimeoutRef.current);
            }
            
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectAttemptRef.current++;
              connectStomp();
            }, delay);
          }
        };

        client.activate();
      } catch (error) {
        console.error('Error setting up STOMP client:', error);
        isConnectingRef.current = false;
      }
    };

    if (isOnline) {
      connectStomp();
    } else {
      // Disconnect when going offline
      if (stompClient && stompClient.active) {
        stompClient.deactivate();
        setStompClient(null);
      }
      isConnectingRef.current = false;
      reconnectAttemptRef.current = 0;
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }

    return () => {
      if (client && client.active) {
        client.deactivate();
      }
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOnline, driverId, playNotificationSound, UniversalNotificationSystem]);

  const acceptOrder = useCallback((order: Order) => {
    if (stompClient && stompClient.active) {
      try {
        stompClient.publish({
          destination: `/app/driver/response`,
          body: JSON.stringify({
            orderId: order.id,
            driverId,
            accepted: true,
          }),
        });

        setNearbyOrders((prevOrders) =>
          prevOrders.filter((o) => o.id !== order.id)
        );
        
        console.log(`Order ${order.id} accepted successfully`);
      } catch (error) {
        console.error('Error accepting order:', error);
      }
    } else {
      console.warn('STOMP client not connected, unable to accept order');
      // Still update UI to give appearance of acceptance even if connection failed
      setNearbyOrders((prevOrders) =>
        prevOrders.filter((o) => o.id !== order.id)
      );
    }
  }, [stompClient, driverId]);

  const cancelOrder = useCallback((order: Order) => {
    if (stompClient && stompClient.active) {
      try {
        stompClient.publish({
          destination: `/app/driver/response`,
          body: JSON.stringify({
            orderId: order.id,
            driverId,
            accepted: false,
          }),
        });

        setNearbyOrders((prevOrders) =>
          prevOrders.filter((o) => o.id !== order.id)
        );
        
        console.log(`Order ${order.id} cancelled successfully`);
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    } else {
      console.warn('STOMP client not connected, unable to cancel order');
      // Still update UI to give appearance of cancellation even if connection failed
      setNearbyOrders((prevOrders) =>
        prevOrders.filter((o) => o.id !== order.id)
      );
    }
  }, [stompClient, driverId]);

  return { stompClient, nearbyOrders, setNearbyOrders, acceptOrder, cancelOrder };
};

/**
 * Hook for managing notification sounds
 */
export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Create audio element and configure it
    const setupAudio = () => {
      try {
        const audio = new Audio(NOTIFICATION_AUDIO_SRC);
        audio.preload = 'auto';
        
        audio.addEventListener('canplaythrough', () => {
          console.log('Notification audio loaded successfully');
          audioLoadedRef.current = true;
        });
        
        audio.onerror = (error) => {
          console.warn('Primary audio failed. Using fallback audio.', error);
          // Base64 encoded short beep sound as fallback
          const fallbackAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJOnucPa6/Py6trOvamSeGNORDwxJRkQBgMBAwYOGik8VW6FoLnW7/////7wzbabgWBEMiQaEQsGAwEBAwUICxEYIzA/Ulx1kKi/1+z1/v/+9OnozsUsHS4fDQkLCwcBAgUMGRkXKjhCR01TWmh0eX2Mqa3A0tzm9f////jz7OLYzMrJxLam0SMeDwsDAgEAAAMEBAUICw8ZIzA9UmJwgZGlur7T4vD4/////vXw6uDW0NDNwbA+LCcjGxELBQgIBwQDBQ0QFBwhKDQ9SVNldYeaqrfH2+Tu+/////779Orh1c3IvrPPGBYHBAMCAAABBggFBAYKEBYcJjA6QktUZnyHlKOwwtDc6fP8/////vr17eXd1tPPx8EeEgsEAgAAAwUGBwgLDBEWGyAtNj5JVmpxhZepusvX5e/4/////vrz7ebh29XtzxoRCQQBAQABBAcJCgoMEhcbIy44QUhRXG15jK2+tdPl8vj7/v/////7+fX59M8VDwcCAAAAAwYICwwOERYcIisyOUNQWWJzi6Wwvs3a5e/5/v/////28vDr5eDZ0QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
          fallbackAudio.preload = 'auto';
          audioRef.current = fallbackAudio;
        };
        
        audioRef.current = audio;
        
        // Load the audio - this might help with mobile browsers
        audio.load();
      } catch (error) {
        console.error('Error setting up notification audio:', error);
      }
    };
    
    setupAudio();

    // Add audio context unlocking for mobile browsers
    const unlockAudio = () => {
      // Create a silent audio context to unlock audio on mobile
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        // Create empty buffer
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }
      
      // Also try to play the audio element briefly
      if (audioRef.current) {
        audioRef.current.volume = 0.01;
        audioRef.current.play().then(() => {
          audioRef.current!.pause();
          audioRef.current!.volume = 1.0;
          audioRef.current!.currentTime = 0;
          console.log('Audio unlocked successfully');
        }).catch(err => {
          console.warn('Failed to unlock audio:', err);
        });
      }
      
      // Remove event listeners after attempted unlock
      ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
    
    // Add event listeners to unlock audio on user interaction
    ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
      document.addEventListener(event, unlockAudio, false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Notification sound played successfully');
          }).catch(err => {
            console.error('Error playing notification:', err);
            
            // Try to recover by creating a new audio element
            const newAudio = new Audio(NOTIFICATION_AUDIO_SRC);
            newAudio.play().catch(innerErr => {
              console.error('Fallback audio also failed:', innerErr);
            });
          });
        }
      } catch (err) {
        console.error('Error during playback:', err);
      }
    } else {
      console.warn('Audio reference not available, cannot play notification');
    }
  }, []);

  return playNotificationSound;
};
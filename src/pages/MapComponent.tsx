// import React, { useEffect, useRef, useState } from 'react';
// import Map, {
//   Marker,
//   NavigationControl,
//   GeolocateControl,
//   Source,
//   Layer,
//   Popup,
//   MapRef,
//   ViewStateChangeEvent,
// } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { MapIcon, Navigation, Package, ChevronDown, ChevronUp, MapPinHouse } from 'lucide-react';
// import { TurnInstruction } from '../utils/routeService';

// // Type definitions
// type Coordinates = {
//   lat: number;
//   lng: number;
// };

// type Order = {
//   id: string | number;
//   lat: number;
//   lng: number;
//   shop: string;
//   distance: string;
//   amount: string;
// };

// type ViewStateProps = {
//   longitude: number;
//   latitude: number;
//   zoom: number;
// };

// type MapComponentProps = {
//   viewState: ViewStateProps;
//   setViewState: (state: ViewStateProps) => void;
//   currentLocation: Coordinates;
//   destination: Coordinates | null;
//   route: GeoJSON.FeatureCollection | null;
//   isOnline: boolean;
//   nearbyOrders: Order[];
//   handleOrderClick: (order: Order) => void;
//   selectedOrder: Order | null;
//   orderStatus: string;
//   popupInfo: Order | null;
//   setPopupInfo: (order: Order | null) => void;
//   isMapFullscreen: boolean;
//   setIsMapFullscreen: (value: boolean) => void;
//   routeInstructions?: TurnInstruction[];
// };

// const MapComponent: React.FC<MapComponentProps> = ({
//   viewState,
//   setViewState,
//   currentLocation,
//   destination,
//   route,
//   isOnline,
//   nearbyOrders,
//   handleOrderClick,
//   selectedOrder,
//   orderStatus,
//   popupInfo,
//   setPopupInfo,
//   isMapFullscreen,
//   setIsMapFullscreen,
//   routeInstructions = []
// }) => {
//   const mapRef = useRef<MapRef>(null);
//   const [showDirections, setShowDirections] = useState(true);

//   const MAPBOX_ACCESS_TOKEN =
//     'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

//   const routeLayerStyle: mapboxgl.LineLayer = {
//     id: 'route',
//     type: 'line',
//     layout: {
//       'line-join': 'round',
//       'line-cap': 'round',
//     },
//     paint: {
//       'line-color': '#3887be',
//       'line-width': 5,
//       'line-opacity': 0.75,
//     },
//     source: ''
//   };
//   const getManeuverIcon = (maneuver: string, modifier?: string) => {
//     switch (maneuver) {
//       case 'turn':
//         if (modifier === 'right') return '↗️';
//         if (modifier === 'left') return '↖️';
//         return '↪️';
//       case 'straight':
//         return '⬆️';
//       case 'roundabout':
//         return '🔄';
//       case 'merge':
//         return '↩️';
//       case 'fork':
//         return '⋔';
//       case 'arrive':
//         return '🏁';
//       case 'depart':
//         return '🚀';
//       default:
//         return '→';
//     }
//   };
//   useEffect(() => {
//     if (!mapRef.current || !destination) return;

//     const bounds: [number, number, number, number] = [
//       Math.min(currentLocation.lng, destination.lng),
//       Math.min(currentLocation.lat, destination.lat),
//       Math.max(currentLocation.lng, destination.lng),
//       Math.max(currentLocation.lat, destination.lat),
//     ];

//     mapRef.current.fitBounds(bounds, {
//       padding: { top: 100, bottom: 100, left: 50, right: 50 },
//     });
//   }, [destination, currentLocation]);

//   const handleMarkerClick = (order: Order) => {
//     setPopupInfo(order);
//   };

//   return (
//     <div className={`map-container ${isMapFullscreen ? 'w-full h-full' : 'w-full h-72'}`}>
//       <Map
//         ref={mapRef}
//         mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
//         mapStyle="mapbox://styles/mapbox/streets-v12"
//         {...viewState}
//         onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
//         attributionControl={false}
//       >
//         <NavigationControl position="top-right" />
//         <GeolocateControl position="top-right" trackUserLocation showUserHeading />

//         {currentLocation && (
//           <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
//             <div className="relative">
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                 <Navigation className="w-5 h-5 text-white" />
//               </div>
//               <div
//                 className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'
//                   }`}
//               />
//             </div>
//           </Marker>
//         )}

//         {destination && (
//           <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
//             <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//               <MapPinHouse className="w-5 h-5 text-white" />
//             </div>
//           </Marker>
//         )}




//         {isOnline &&
//           nearbyOrders?.map((order) => (
//             <Marker
//               key={order.id}
//               longitude={order.lng}
//               latitude={order.lat}
//               anchor="bottom"
//               onClick={() => handleMarkerClick(order)}
//             >
//               <div
//                 className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors"
//                 onClick={() => handleOrderClick(order)}
//               >
//                 <Package className="w-5 h-5 text-white" />
//               </div>
//             </Marker>
//           ))}

//         {route && (
//           <Source id="route-source" type="geojson" data={route}>
//             <Layer {...routeLayerStyle} />
//           </Source>
//         )}

//         {popupInfo && (
//           <Popup
//             anchor="bottom"
//             longitude={popupInfo.lng}
//             latitude={popupInfo.lat}
//             onClose={() => setPopupInfo(null)}
//             closeButton={true}
//             closeOnClick={false}
//             className="rounded-lg"
//           >
//             <div className="p-2">
//               <h3 className="font-bold">{popupInfo.shop}</h3>
//               <p className="text-sm">{popupInfo.distance}</p>
//               <p className="text-sm font-medium mt-1">{popupInfo.amount}</p>
//               <button
//                 onClick={() => handleOrderClick(popupInfo)}
//                 className="mt-2 bg-green-500 text-white text-sm px-3 py-1 rounded-lg w-full hover:bg-green-600 transition-colors"
//               >
//                 View Details
//               </button>
//             </div>
//           </Popup>
//         )}
//       </Map>

//       {isMapFullscreen && (
//         <>
//           <button
//             className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
//             onClick={() => setIsMapFullscreen(false)}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>

//           // Then replace the turn-by-turn panel with this enhanced version
//           {/* Turn-by-turn instructions panel */}
//           {routeInstructions && routeInstructions.length > 0 && (
//             <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg max-h-1/2 overflow-auto z-20">
//               <div
//                 className="flex justify-between items-center p-3 border-b cursor-pointer"
//                 onClick={() => setShowDirections(!showDirections)}
//               >
//                 <div>
//                   <h3 className="font-bold">Turn-by-Turn Directions</h3>
//                   <p className="text-xs text-gray-500">
//                     {routeInstructions.length} steps •
//                     {' '}{Math.round(routeInstructions.reduce((acc, curr) => acc + curr.distance, 0) * 10) / 10} km •
//                     {' '}{Math.round(routeInstructions.reduce((acc, curr) => acc + curr.duration, 0))} min
//                   </p>
//                 </div>
//                 {showDirections ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
//               </div>

//               {showDirections && (
//                 <div className="p-2 max-h-64 overflow-y-auto">
//                   {routeInstructions.map((instruction, index) => (
//                     <div key={index} className="mb-3 border-b pb-2 last:border-0">
//                       <div className="flex items-start">
//                         <div
//                           className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0"
//                           title={instruction.maneuver}
//                         >
//                           {getManeuverIcon(instruction.type || instruction.maneuver, instruction.modifier)}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">{instruction.text}</p>
//                           <div className="flex text-xs text-gray-500 mt-1">
//                             <span className="mr-3">{instruction.distance.toFixed(1)} km</span>
//                             {instruction.duration && <span>{Math.ceil(instruction.duration)} min</span>}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default MapComponent;

// import React, { useEffect, useRef, useState } from 'react';
// import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer, Popup, MapRef, ViewStateChangeEvent } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { MapIcon, Navigation, Package, ChevronDown, ChevronUp, MapPinHouse } from 'lucide-react';
// import { TurnInstruction } from '../utils/routeService';

// type Coordinates = { lat: number; lng: number };
// type Order = { id: string | number; lat: number; lng: number; shop: string; distance: number; amount: string };
// type ViewStateProps = { longitude: number; latitude: number; zoom: number };
// type MapComponentProps = {
//   viewState: ViewStateProps;
//   setViewState: (state: ViewStateProps) => void;
//   currentLocation: Coordinates;
//   destination: Coordinates | null;
//   route: GeoJSON.FeatureCollection | null;
//   isOnline: boolean;
//   nearbyOrders: Order[];
//   handleOrderClick: (order: import('../utils/types').Order) => void;
//   selectedOrder: Order | null;
//   orderStatus: string;
//   popupInfo: Order | null;
//   setPopupInfo: (order: Order | null) => void;
//   isMapFullscreen: boolean;
//   setIsMapFullscreen: (value: boolean) => void;
//   routeInstructions?: TurnInstruction[];
// };

// const MapComponent: React.FC<MapComponentProps> = ({ viewState, setViewState, currentLocation, destination, route, isOnline, nearbyOrders, handleOrderClick, selectedOrder, orderStatus, popupInfo, setPopupInfo, isMapFullscreen, setIsMapFullscreen, routeInstructions = [] }) => {
//   const mapRef = useRef<MapRef>(null);
//   const [showDirections, setShowDirections] = useState(true);
//   const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

//   const routeLayerStyle: mapboxgl.LineLayer = {
//     id: 'route',
//     type: 'line',
//     layout: { 'line-join': 'round', 'line-cap': 'round' },
//     paint: { 'line-color': '#3887be', 'line-width': 5, 'line-opacity': 0.75 },
//     source: '',
//   };

//   const getManeuverIcon = (maneuver: string, modifier?: string) => {
//     switch (maneuver) {
//       case 'turn': return modifier === 'right' ? '↗️' : modifier === 'left' ? '↖️' : '↪️';
//       case 'straight': return '⬆️';
//       case 'roundabout': return '🔄';
//       case 'merge': return '↩️';
//       case 'fork': return '⋔';
//       case 'arrive': return '🏁';
//       case 'depart': return '🚀';
//       default: return '→';
//     }
//   };

//   useEffect(() => {
//     if (!mapRef.current || !destination) return;
//     const bounds: [number, number, number, number] = [Math.min(currentLocation.lng, destination.lng), Math.min(currentLocation.lat, destination.lat), Math.max(currentLocation.lng, destination.lng), Math.max(currentLocation.lat, destination.lat)];
//     mapRef.current.fitBounds(bounds, { padding: { top: 100, bottom: 100, left: 50, right: 50 } });
//   }, [destination, currentLocation]);

//   useEffect(() => {
//     if (mapRef.current) {
//       const map = mapRef.current.getMap();
//       if (map) map.resize();
//     }
//   }, [isMapFullscreen]);

//   const handleMarkerClick = (order: Order) => setPopupInfo(order);

//   return (
//     <div className={`map-container ${isMapFullscreen ? 'w-full h-full' : 'w-full h-72'}`}>
//       <Map ref={mapRef} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v12" {...viewState} onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)} attributionControl={false}>
//         <NavigationControl position="top-right" />
//         <GeolocateControl position="top-right" trackUserLocation showUserHeading />
//         {currentLocation && (
//           <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
//             <div className="relative">
//               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                 <Navigation className="w-5 h-5 text-white" />
//               </div>
//               <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
//             </div>
//           </Marker>
//         )}
//         {destination && (
//           <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
//             <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//               <MapPinHouse className="w-5 h-5 text-white" />
//             </div>
//           </Marker>
//         )}
//         {isOnline &&
//           nearbyOrders?.map((order) => (
//             <Marker key={order.id} longitude={order.lng} latitude={order.lat} anchor="bottom" onClick={() => handleMarkerClick(order)}>
//               <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors" onClick={() => handleOrderClick(order)}>
//                 <Package className="w-5 h-5 text-white" />
//               </div>
//             </Marker>
//           ))}
//         {route && (
//           <Source id="route-source" type="geojson" data={route}>
//             <Layer {...routeLayerStyle} />
//           </Source>
//         )}
//         {popupInfo && (
//           <Popup anchor="bottom" longitude={popupInfo.lng} latitude={popupInfo.lat} onClose={() => setPopupInfo(null)} closeButton closeOnClick={false} className="rounded-lg">
//             <div className="p-2">
//               <h3 className="font-bold">{popupInfo.shop}</h3>
//               <p className="text-sm">{popupInfo.distance}</p>
//               <p className="text-sm font-medium mt-1">{popupInfo.amount}</p>
//               <button onClick={() => handleOrderClick(popupInfo)} className="mt-2 bg-green-500 text-white text-sm px-3 py-1 rounded-lg w-full hover:bg-green-600 transition-colors">
//                 View Details
//               </button>
//             </div>
//           </Popup>
//         )}
//       </Map>
//       {isMapFullscreen && (
//         <>
//           <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md" onClick={() => setIsMapFullscreen(false)}>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//           {routeInstructions && routeInstructions.length > 0 && (
//             <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg max-h-1/2 overflow-auto z-20">
//               <div className="flex justify-between items-center p-3 border-b cursor-pointer" onClick={() => setShowDirections(!showDirections)}>
//                 <div>
//                   <h3 className="font-bold">Turn-by-Turn Directions</h3>
//                   <p className="text-xs text-gray-500">
//                     {routeInstructions.length} steps • {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.distance, 0) * 10) / 10} km • {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.duration, 0))} min
//                   </p>
//                 </div>
//                 {showDirections ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
//               </div>
//               {showDirections && (
//                 <div className="p-2 max-h-64 overflow-y-auto">
//                   {routeInstructions.map((instruction, index) => (
//                     <div key={index} className="mb-3 border-b pb-2 last:border-0">
//                       <div className="flex items-start">
//                         <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0" title={instruction.maneuver}>
//                           {getManeuverIcon(instruction.type || instruction.maneuver, instruction.modifier)}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">{instruction.text}</p>
//                           <div className="flex text-xs text-gray-500 mt-1">
//                             <span className="mr-3">{instruction.distance.toFixed(1)} km</span>
//                             {instruction.duration && <span>{Math.ceil(instruction.duration)} min</span>}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default MapComponent;


import React, { useEffect, useRef, useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
  MapRef,
  ViewStateChangeEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapIcon, Navigation, Package, ChevronDown, ChevronUp, MapPinHouse } from 'lucide-react';
import { TurnInstruction } from '../utils/routeService';
import { Order } from '../utils/types';

type Coordinates = {
  lat: number;
  lng: number;
};

type ViewStateProps = {
  longitude: number;
  latitude: number;
  zoom: number;
};

type MapComponentProps = {
  viewState: ViewStateProps;
  setViewState: (state: ViewStateProps) => void;
  currentLocation: Coordinates;
  destination: Coordinates | null;
  route: GeoJSON.FeatureCollection | null;
  isOnline: boolean;
  nearbyOrders: Order[];
  handleOrderClick: (order: Order) => void;
  selectedOrder: Order | null;
  orderStatus: string;
  popupInfo: Order | null;
  setPopupInfo: (order: Order | null) => void;
  isMapFullscreen: boolean;
  setIsMapFullscreen: (value: boolean) => void;
  routeInstructions?: TurnInstruction[];
};

const MapComponent: React.FC<MapComponentProps> = ({
  viewState,
  setViewState,
  currentLocation,
  destination,
  route,
  isOnline,
  nearbyOrders,
  handleOrderClick,
  selectedOrder,
  orderStatus,
  popupInfo,
  setPopupInfo,
  isMapFullscreen,
  setIsMapFullscreen,
  routeInstructions = []
}) => {
  const mapRef = useRef<MapRef>(null);
  const [showDirections, setShowDirections] = useState(true);

  const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

  const routeLayerStyle: mapboxgl.LineLayer = {
    id: 'route',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75,
    },
    source: ''
  };

  const getManeuverIcon = (maneuver: string, modifier?: string) => {
    switch (maneuver) {
      case 'turn': return modifier === 'right' ? '↗️' : modifier === 'left' ? '↖️' : '↪️';
      case 'straight': return '⬆️';
      case 'roundabout': return '🔄';
      case 'merge': return '↩️';
      case 'fork': return '⋔';
      case 'arrive': return '🏁';
      case 'depart': return '🚀';
      default: return '→';
    }
  };

  useEffect(() => {
    if (!mapRef.current || !destination) return;
    const bounds: [number, number, number, number] = [
      Math.min(currentLocation.lng, destination.lng),
      Math.min(currentLocation.lat, destination.lat),
      Math.max(currentLocation.lng, destination.lng),
      Math.max(currentLocation.lat, destination.lat),
    ];
    mapRef.current.fitBounds(bounds, {
      padding: { top: 100, bottom: 100, left: 50, right: 50 },
    });
  }, [destination, currentLocation]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.getMap().resize();
    }
  }, [isMapFullscreen]);

  const handleMarkerClick = (order: Order) => setPopupInfo(order);

  return (
    <div className={`map-container ${isMapFullscreen ? 'w-full h-full' : 'w-full h-72'} relative`}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" trackUserLocation showUserHeading />

        <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </Marker>

        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <MapPinHouse className="w-5 h-5 text-white" />
            </div>
          </Marker>
        )}

        {isOnline &&
          nearbyOrders.map((order) => (
            <Marker
              key={order.id}
              longitude={order.lng}
              latitude={order.lat}
              anchor="bottom"
              onClick={() => handleMarkerClick(order)}
            >
              <div
                className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors"
                onClick={() => handleOrderClick(order)}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
            </Marker>
          ))}

        {route && (
          <Source id="route-source" type="geojson" data={route}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="rounded-lg"
          >
            <div className="p-2">
              <h3 className="font-bold">{popupInfo.shop}</h3>
              <p className="text-sm">{popupInfo.distance.toFixed(1)} km</p>
              <p className="text-sm font-medium mt-1">{popupInfo.amount}</p>
              <button
                onClick={() => handleOrderClick(popupInfo)}
                className="mt-2 bg-green-500 text-white text-sm px-3 py-1 rounded-lg w-full hover:bg-green-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {isMapFullscreen && (
        <>
          <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-30"
            onClick={() => setIsMapFullscreen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {routeInstructions.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg max-h-1/2 overflow-auto z-20">
              <div
                className="flex justify-between items-center p-3 border-b cursor-pointer"
                onClick={() => setShowDirections(!showDirections)}
              >
                <div>
                  <h3 className="font-bold">Turn-by-Turn Directions</h3>
                  <p className="text-xs text-gray-500">
                    {routeInstructions.length} steps •{' '}
                    {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.distance, 0) * 10) / 10} km •{' '}
                    {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.duration, 0))} min
                  </p>
                </div>
                {showDirections ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </div>

              {showDirections && (
                <div className="p-2 max-h-64 overflow-y-auto">
                  {routeInstructions.map((instruction, index) => (
                    <div key={index} className="mb-3 border-b pb-2 last:border-0">
                      <div className="flex items-start">
                        <div
                          className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0"
                          title={instruction.maneuver}
                        >
                          {getManeuverIcon(instruction.type || instruction.maneuver, instruction.modifier)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{instruction.text}</p>
                          <div className="flex text-xs text-gray-500 mt-1">
                            <span className="mr-3">{instruction.distance.toFixed(1)} km</span>
                            {instruction.duration && <span>{Math.ceil(instruction.duration)} min</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapComponent;

import React, { useEffect, useRef } from 'react';
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
  MapRef,
  ViewStateChangeEvent,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapIcon, Navigation, Package } from 'lucide-react';

// Type definitions
type Coordinates = {
  lat: number;
  lng: number;
};

type Order = {
  id: string | number;
  lat: number;
  lng: number;
  shop: string;
  distance: string;
  amount: string;
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
  setIsMapFullscreen
}) => {
  const mapRef = useRef<MapRef>(null);

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

  const handleMarkerClick = (order: Order) => {
    setPopupInfo(order);
  };
  
  return (
    <div className={`map-container ${isMapFullscreen ? 'w-full h-full' : 'w-full h-72'}`}>
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

        {currentLocation && (
          <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="center">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </Marker>
        )}

        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-white" />
            </div>
          </Marker>
        )}

        {isOnline &&
          nearbyOrders?.map((order) => (
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
              <p className="text-sm">{popupInfo.distance}</p>
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
        <button
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          onClick={() => setIsMapFullscreen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MapComponent;

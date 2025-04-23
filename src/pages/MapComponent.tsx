import React, { useEffect, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer, MapRef, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Navigation, Package, ChevronDown, ChevronUp, MapPinHouse, Maximize2, Minimize2 } from 'lucide-react';
import { TurnInstruction } from '../utils/routeService';

type Coordinates = { lat: number; lng: number };
type Order = { id: string | number; lat: number; lng: number; shop: string; distance: string; amount: string };
type ViewStateProps = { longitude: number; latitude: number; zoom: number };
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
  isMapFullscreen,
  setIsMapFullscreen,
  routeInstructions = [],
}) => {
  const mapRef = useRef<MapRef>(null);
  const [showDirections, setShowDirections] = useState(true);
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

  const routeLayerStyle: mapboxgl.LineLayer = {
    id: 'route',
    type: 'line',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#3887be', 'line-width': 5, 'line-opacity': 0.75 },
    source: '',
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
    mapRef.current.fitBounds(bounds, { padding: { top: 100, bottom: 100, left: 50, right: 50 } });
  }, [destination, currentLocation]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) map.resize();
    }
  }, [isMapFullscreen]);

  const toggleFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  return (
    <div className={`map-container w-full ${isMapFullscreen ? 'h-screen' : 'h-72'}`}>
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
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
          </Marker>
        )}
        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <MapPinHouse className="w-5 h-5 text-white" />
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
              onClick={() => handleOrderClick(order)}
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
      </Map>
      <button
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md z-20"
        onClick={toggleFullscreen}
        aria-label={isMapFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isMapFullscreen ? (
          <Minimize2 className="h-5 w-5 text-gray-700" />
        ) : (
          <Maximize2 className="h-5 w-5 text-gray-700" />
        )}
      </button>
      {isMapFullscreen && routeInstructions && routeInstructions.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white shadow-lg rounded-t-lg max-h-1/2 overflow-auto z-20">
          <div className="flex justify-between items-center p-3 border-b border-gray-700 cursor-pointer" onClick={() => setShowDirections(!showDirections)}>
            <div>
              <h3 className="text-lg font-bold">Turn-by-Turn Directions</h3>
              <p className="text-xs text-gray-300">
                {routeInstructions.length} steps • {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.distance, 0) * 10) / 10} km • {Math.round(routeInstructions.reduce((acc, curr) => acc + curr.duration, 0))} min
              </p>
            </div>
            {showDirections ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white" />}
          </div>
          <div className={`p-2 overflow-y-auto transition-all duration-300 ${showDirections ? 'max-h-64' : 'max-h-0 overflow-hidden'}`}>
            {routeInstructions.map((instruction, index) => (
              <div key={index} className="mb-3 border-b border-gray-700 pb-2 last:border-0">
                <div className="flex items-start">
                  <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0" title={instruction.maneuver}>
                    {getManeuverIcon(instruction.type || instruction.maneuver, instruction.modifier)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{instruction.text}</p>
                    <div className="flex text-xs text-gray-400 mt-1">
                      <span className="mr-3">{instruction.distance.toFixed(1)} km</span>
                      {instruction.duration && <span>{Math.ceil(instruction.duration)} min</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
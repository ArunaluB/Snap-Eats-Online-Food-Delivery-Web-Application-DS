// import React, { useState, useEffect } from 'react';
// import Map, { Marker, NavigationControl } from 'react-map-gl';
// import { toast } from 'react-hot-toast';
// import 'mapbox-gl/dist/mapbox-gl.css';


// interface LocationPickerModalProps {
//   onClose: () => void;
//   onSave: (location: { lat: number; lng: number }) => void;
// }

// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

// export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onClose, onSave }) => {
//   const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [viewport, setViewport] = useState({
//     latitude: 6.8321, // Default (from Dashboard.tsx)
//     longitude: 80.3671,
//     zoom: 14,
//   });
//   const [mapError, setMapError] = useState<string | null>(null);

//   // Fetch current location on mount
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setSelectedLocation(newLocation);
//           setViewport((prev) => ({
//             ...prev,
//             latitude: newLocation.lat,
//             longitude: newLocation.lng,
//           }));
//           console.log('Current location:', newLocation);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           toast.error('Failed to get current location');
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       console.error('Geolocation not supported');
//       toast.error('Geolocation not supported by browser');
//     }
//   }, []);

//   const handleMapClick = (event: any) => {
//     const { lng, lat } = event.lngLat;
//     setSelectedLocation({ lat, lng });
//     console.log('Pin set at:', { lat, lng });
//   };

//   const handleUseCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setSelectedLocation(newLocation);
//           setViewport((prev) => ({
//             ...prev,
//             latitude: newLocation.lat,
//             longitude: newLocation.lng,
//           }));
//           console.log('Current location selected:', newLocation);
//         },
//         (error) => {
//           console.error('Error getting current location:', error);
//           toast.error('Failed to get current location');
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   };

//   const handleZoomIn = () => {
//     setViewport((prev) => ({ ...prev, zoom: prev.zoom + 1 }));
//   };

//   const handleZoomOut = () => {
//     setViewport((prev) => ({ ...prev, zoom: prev.zoom - 1 }));
//   };

//   const handleSave = () => {
//     if (selectedLocation) {
//       console.log('Saving location:', selectedLocation);
//       onSave(selectedLocation);
//       onClose();
//     } else {
//       toast.error('Please select a location');
//     }
//   };

//   const handleMapLoad = () => {
//     console.log('Map loaded successfully');
//   };

//   const handleMapError = (error: any) => {
//     console.error('Map error:', error);
//     setMapError('Failed to load map');
//     toast.error('Failed to load map: Check token or network');
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg max-w-lg w-full mx-4 relative overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-semibold">Select Location</h2>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
//             <span className="material-symbols-outlined">close</span>
//           </button>
//         </div>
//         <div className="p-4 relative">
//           {mapError ? (
//             <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
//               <p className="text-red-500 text-center">
//                 {mapError}. Please check your Mapbox token or network connection.
//               </p>
//             </div>
//           ) : (
//             <Map
//               {...viewport}
//               onMove={(evt) => setViewport(evt.viewState)}
//               style={{ width: '100%', height: '400px' }}
//               mapStyle="mapbox://styles/mapbox/streets-v11"
//               mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
//               onClick={handleMapClick}
//               onLoad={handleMapLoad}
//               onError={handleMapError}
//             >
//               {selectedLocation && (
//                 <Marker
//                   latitude={selectedLocation.lat}
//                   longitude={selectedLocation.lng}
//                   anchor="bottom"
//                 >
//                   <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white" />
//                 </Marker>
//               )}
//               <NavigationControl position="top-right" />
//               <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
//                 <button
//                   onClick={handleZoomIn}
//                   className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
//                   aria-label="Zoom in"
//                 >
//                   <span className="material-symbols-outlined">add</span>
//                 </button>
//                 <button
//                   onClick={handleZoomOut}
//                   className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
//                   aria-label="Zoom out"
//                 >
//                   <span className="material-symbols-outlined">remove</span>
//                 </button>
//               </div>
//             </Map>
//           )}
//           <div className="mt-4 flex flex-col gap-2">
//             <button
//               onClick={handleUseCurrentLocation}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Use Current Location
//             </button>
//             <p className="text-sm text-gray-500">Or click on the map to set a custom pin.</p>
//           </div>
//         </div>
//         <div className="border-t p-4 flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 font-medium hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-5 py-2 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { toast } from 'react-hot-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationPickerModalProps {
  onClose: () => void;
  onSave: (location: { lat: number; lng: number }) => void;
}

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYXJ1bmFsdSIsImEiOiJjbTllZ3ZleHUxZWlxMmxzN3hyMmlxaXBjIn0.88xrwVeZkSlah-fUY3_3BA';

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onClose, onSave }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 6.8321,
    longitude: 80.3671,
    zoom: 14,
  });
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(newLocation);
          setViewport((prev) => ({
            ...prev,
            latitude: newLocation.lat,
            longitude: newLocation.lng,
          }));
          console.log('LocationPickerModal: Current location:', newLocation);
        },
        (error) => {
          console.error('LocationPickerModal: Error getting location:', error);
          toast.error('Failed to get current location', { duration: 4000 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('LocationPickerModal: Geolocation not supported');
      toast.error('Geolocation not supported by browser', { duration: 4000 });
    }
  }, []);

  const handleMapClick = (event: any) => {
    const { lng, lat } = event.lngLat;
    setSelectedLocation({ lat, lng });
    console.log('LocationPickerModal: Pin set at:', { lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(newLocation);
          setViewport((prev) => ({
            ...prev,
            latitude: newLocation.lat,
            longitude: newLocation.lng,
          }));
          console.log('LocationPickerModal: Current location selected:', newLocation);
        },
        (error) => {
          console.error('LocationPickerModal: Error getting current location:', error);
          toast.error('Failed to get current location', { duration: 4000 });
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleZoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom + 1 }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: prev.zoom - 1 }));
  };

  const handleSave = () => {
    if (selectedLocation) {
      console.log('LocationPickerModal: Saving location:', selectedLocation);
      onSave(selectedLocation);
      onClose();
    } else {
      toast.error('Please select a location', { duration: 4000 });
    }
  };

  const handleMapLoad = () => {
    console.log('LocationPickerModal: Map loaded successfully');
  };

  const handleMapError = (error: any) => {
    console.error('LocationPickerModal: Map error:', error);
    setMapError('Failed to load map');
    toast.error('Failed to load map: Check token or network', { duration: 4000 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 relative overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Select Location</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 relative">
          {mapError ? (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-red-500 text-center">
                {mapError}. Please check your Mapbox token or network connection.
              </p>
            </div>
          ) : (
            <Map
              {...viewport}
              onMove={(evt) => setViewport(evt.viewState)}
              style={{ width: '100%', height: '400px' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
              onError={handleMapError}
            >
              {selectedLocation && (
                <Marker latitude={selectedLocation.lat} longitude={selectedLocation.lng} anchor="bottom">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white" />
                </Marker>
              )}
              <NavigationControl position="top-right" />
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  onClick={handleZoomIn}
                  className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Zoom in"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Zoom out"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>
            </Map>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleUseCurrentLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Use Current Location
            </button>
            <p className="text-sm text-gray-500">Or click on the map to set a custom pin.</p>
          </div>
        </div>
        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
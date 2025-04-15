import { useState, useEffect } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

/**
 * Hook to handle geolocation services
 * @param isOnline - Whether the driver is online
 * @param initialLocation - Initial location coordinates (optional)
 * @returns Location state and view state
 */
export const useGeoLocation = (
  isOnline: boolean,
  initialLocation: Coordinates = { lat: 6.8321, lng: 80.3671 }
): {
  currentLocation: Coordinates;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Coordinates>>;
  viewState: ViewState;
  setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
} => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates>(initialLocation);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: initialLocation.lat,
    longitude: initialLocation.lng,
    zoom: 8
  });

  useEffect(() => {
    let watchId: number | undefined;

    if (navigator.geolocation && isOnline) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          setViewState({
            latitude: newLocation.lat,
            longitude: newLocation.lng,
            zoom: 14
          });
        },
        (error) => {
          console.error('Error getting location: ', error);
        }
      );

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
        },
        (error) => {
          console.error('Error watching location: ', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  return { currentLocation, setCurrentLocation, viewState, setViewState };
};

export default useGeoLocation;

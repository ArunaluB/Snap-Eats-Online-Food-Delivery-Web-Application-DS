import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.748817,  
  lng: -73.985428,
};

export function MapComponent() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDpwy79IM6EjuRUy0-lpf3wrkkfRvjuGsk">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}



export interface Order {
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

export interface Location {
  lat: number;
  lng: number;
}

export interface Destination extends Location {
  name: string;
}

export interface PopupInfo extends Location {
  name: string;
  type: string;
}
export interface DriverLocationDto {
  driverId: number;
  latitude: number;
  longitude: number;
}
export interface Location {
  lat: number;
  lng: number;
}

export interface Destination extends Location {
  name: string;
}

export interface PopupInfo extends Location {
  name: string;
  type: string;
}
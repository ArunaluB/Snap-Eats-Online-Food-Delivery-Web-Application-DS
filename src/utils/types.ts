
export interface Order {
  id: number;
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
  distance: number;
  amount: string;
  status: string;
  distanceToShop:number;
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
  title: ReactNode;
  description: ReactNode;
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

import { Feature, LineString } from 'geojson';
import { ReactNode } from 'react';

export interface Location {
  lat: number;
  lng: number;
}

export interface Destination extends Location {
  name: string;
}



export interface PopupInfo {
  id: string;
  lat: number;
  lng: number;
  shop: string;
  distance: string;
  amount: string;
}

export interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapComponentProps {
  viewState: MapViewState;
  setViewState: (viewState: MapViewState) => void;
  currentLocation: Location;
  destination: Destination | null;
  route: Feature<LineString> | null;
  isOnline: boolean;
  nearbyOrders: Order[];
  handleOrderClick: (order: Order) => void;
  selectedOrder: Order | null;
  orderStatus: 'pending' | 'accepted' | 'pickup' | 'completed';
  popupInfo: PopupInfo | null;
  setPopupInfo: (info: PopupInfo | null) => void;
  isMapFullscreen: boolean;
}

export interface DashboardState {
  isOnline: boolean;
  currentLocation: Location;
  selectedOrder: Order | null;
  showOrderDetails: boolean;
  orderStatus: 'pending' | 'accepted' | 'pickup' | 'completed';
  route: Feature<LineString> | null;
  destination: Destination | null;
  isMapFullscreen: boolean;
  popupInfo: PopupInfo | null;
  viewState: MapViewState;
  nearbyOrders: Order[];
}
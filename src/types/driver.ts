export interface Driver {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  latitude?: number;
  longitude?: number;
  licenseNumber?: string;
  licenseImagePathFront?: string;
  licenseImagePathBack?: string;
  licenseExpiryDate?: string;
  nic?: string;
  nicImagePathFront?: string;
  nicImagePathBack?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  registrationNumber?: string;
  vehicleNo?: string;
  licencePlate?: string;
  licenceNumber?: string;
  vehicleFrontPath?: string;
  vehicleRearPath?: string;
  vehicleSidePath?: string;
  phoneNumber: string;
  available: boolean;
  username: string;
  password: string;
  profileImage?: string;
  addressTestimony?: string;
  isVerified: boolean;
}

export type DriverVerificationStatus = 'verified' | 'pending' | 'rejected';
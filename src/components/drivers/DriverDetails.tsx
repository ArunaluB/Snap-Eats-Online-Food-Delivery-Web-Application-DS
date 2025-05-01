import React from 'react';
import { Driver } from '../../types/driver';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check, X, User, Car, CreditCard, MapPin, Phone, Mail } from 'lucide-react';
import { useDrivers } from '../../context/DriverContext';

interface DriverDetailsProps {
  driver: Driver;
  onClose: () => void;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver, onClose }) => {
  const { verifyDriver, unverifyDriver } = useDrivers();

  const handleVerify = () => {
    verifyDriver(driver.id);
  };

  const handleUnverify = () => {
    unverifyDriver(driver.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Driver Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header with profile info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {driver.profileImage ? (
                  <img 
                    src={driver.profileImage} 
                    alt={driver.name || `${driver.firstName} ${driver.lastName}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <Badge 
                variant={driver.isVerified ? 'success' : 'warning'}
                className="absolute bottom-0 right-0"
              >
                {driver.isVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                {driver.name || `${driver.firstName} ${driver.lastName}`}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{driver.email}</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{driver.phoneNumber}</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-600">
                  {driver.addressTestimony || 'No address provided'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Driver information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p>{driver.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIC</p>
                  <p>{driver.nic || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p>{driver.licenseNumber || driver.licenceNumber || 'Not provided'}</p>
                </div>
                {driver.licenseExpiryDate && (
                  <div>
                    <p className="text-sm text-gray-500">License Expiry Date</p>
                    <p>{driver.licenseExpiryDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type & Model</p>
                  <p>{driver.vehicleType} {driver.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Color</p>
                  <p>{driver.vehicleColor || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p>{driver.registrationNumber || driver.vehicleNo || driver.licencePlate || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Availability Status</p>
                  <Badge variant={driver.available ? 'success' : 'warning'}>
                    {driver.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Document verification section */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {driver.licenseImagePathFront && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">License (Front)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.licenseImagePathFront} 
                        alt="License Front" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.licenseImagePathBack && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">License (Back)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.licenseImagePathBack} 
                        alt="License Back" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.nicImagePathFront && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">NIC (Front)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.nicImagePathFront} 
                        alt="NIC Front" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.nicImagePathBack && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">NIC (Back)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.nicImagePathBack} 
                        alt="NIC Back" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.vehicleFrontPath && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">Vehicle (Front)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.vehicleFrontPath} 
                        alt="Vehicle Front" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.vehicleRearPath && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">Vehicle (Rear)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.vehicleRearPath} 
                        alt="Vehicle Rear" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
                
                {driver.vehicleSidePath && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <p className="p-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">Vehicle (Side)</p>
                    <div className="p-2 h-40">
                      <img 
                        src={driver.vehicleSidePath} 
                        alt="Vehicle Side" 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          
          <div className="space-x-2">
            {driver.isVerified ? (
              <Button 
                variant="danger" 
                icon={<X className="h-4 w-4" />}
                onClick={handleUnverify}
              >
                Unverify Driver
              </Button>
            ) : (
              <Button 
                variant="success" 
                icon={<Check className="h-4 w-4" />}
                onClick={handleVerify}
              >
                Verify Driver
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
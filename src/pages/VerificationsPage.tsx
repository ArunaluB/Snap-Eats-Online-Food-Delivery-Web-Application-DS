import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Eye, Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useDrivers } from '../context/DriverContext';
import DriverDetails from '../components/drivers/DriverDetails';

const VerificationsPage: React.FC = () => {
  const { drivers, verifyDriver, unverifyDriver } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  const pendingDrivers = drivers.filter(driver => !driver.isVerified);
  const selectedDriverObj = drivers.find(driver => driver.id === selectedDriver);

  const handleViewDriver = (id: number) => {
    setSelectedDriver(id);
  };

  const handleCloseDetails = () => {
    setSelectedDriver(null);
  };

  const handleVerify = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    verifyDriver(id);
  };

  const handleUnverify = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    unverifyDriver(id);
  };

  const columns = [
    {
      header: 'Driver',
      accessor: (driver: typeof drivers[0]) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
            {driver.profileImage ? (
              <img
                src={driver.profileImage}
                alt={driver.name || `${driver.firstName} ${driver.lastName}`}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                <span className="text-sm font-medium">
                  {driver.firstName?.charAt(0) || driver.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {driver.name || `${driver.firstName} ${driver.lastName}`}
            </div>
            <div className="text-gray-500">{driver.email}</div>
          </div>
        </div>
      ),
      className: 'min-w-[250px]',
    },
    {
      header: 'Documents',
      accessor: (driver: typeof drivers[0]) => {
        const licenseImages = !!driver.licenseImagePathFront || !!driver.licenseImagePathBack;
        const nicImages = !!driver.nicImagePathFront || !!driver.nicImagePathBack;
        const vehicleImages = !!driver.vehicleFrontPath || !!driver.vehicleRearPath || !!driver.vehicleSidePath;
        
        return (
          <div className="space-x-2">
            {licenseImages && (
              <Badge variant={licenseImages ? 'success' : 'danger'}>
                License
              </Badge>
            )}
            {nicImages && (
              <Badge variant={nicImages ? 'success' : 'danger'}>
                NIC
              </Badge>
            )}
            {vehicleImages && (
              <Badge variant={vehicleImages ? 'success' : 'danger'}>
                Vehicle
              </Badge>
            )}
            {!licenseImages && !nicImages && !vehicleImages && (
              <Badge variant="danger">
                No Documents
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Vehicle',
      accessor: (driver: typeof drivers[0]) => (
        <div>
          <div className="font-medium">{driver.vehicleType} {driver.vehicleModel}</div>
          <div className="text-gray-500">{driver.registrationNumber || driver.vehicleNo || driver.licencePlate || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (driver: typeof drivers[0]) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => handleViewDriver(driver.id)}
          >
            View
          </Button>
          
          <Button
            variant="success"
            size="sm"
            icon={<Check className="h-4 w-4" />}
            onClick={(e) => handleVerify(driver.id, e)}
          >
            Approve
          </Button>
        </div>
      ),
      className: 'w-[200px]',
    },
  ];

  return (
    <AppLayout title="Verifications">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
        <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800">Pending Verifications</h3>
          <p className="text-amber-700 mt-1">
            Review driver documents and information carefully before approving.
            Verification requires checking the authenticity of license, NIC, and vehicle information.
          </p>
        </div>
      </div>
      
      {pendingDrivers.length > 0 ? (
        <DataTable
          columns={columns}
          data={pendingDrivers}
          keyExtractor={(driver) => driver.id}
          emptyMessage="No pending verifications."
          className="border border-gray-200 rounded-lg"
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no pending driver verifications at the moment. All drivers have been reviewed.
          </p>
        </div>
      )}
      
      {selectedDriverObj && (
        <DriverDetails
          driver={selectedDriverObj}
          onClose={handleCloseDetails}
        />
      )}
    </AppLayout>
  );
};

export default VerificationsPage;
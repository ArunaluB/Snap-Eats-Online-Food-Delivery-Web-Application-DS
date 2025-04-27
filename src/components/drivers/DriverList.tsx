import React, { useState } from 'react';
import { DataTable } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Eye, Check, X } from 'lucide-react';
import { useDrivers } from '../../context/DriverContext';
import DriverDetails from './DriverDetails';

const DriverList: React.FC = () => {
  const { drivers, verifyDriver, unverifyDriver } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

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

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      (driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (driver.firstName + ' ' + driver.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
       driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       driver.phoneNumber.includes(searchTerm));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && driver.isVerified;
    if (filter === 'pending') return matchesSearch && !driver.isVerified;
    return matchesSearch;
  });

  const selectedDriverObj = drivers.find(driver => driver.id === selectedDriver);

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
      header: 'Phone',
      accessor: 'phoneNumber',
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
      header: 'Status',
      accessor: (driver: typeof drivers[0]) => (
        <Badge variant={driver.isVerified ? 'success' : 'warning'}>
          {driver.isVerified ? 'Verified' : 'Pending'}
        </Badge>
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
            aria-label="View driver details"
          >
            View
          </Button>
          
          {driver.isVerified ? (
            <Button
              variant="outline"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={(e) => handleUnverify(driver.id, e)}
              aria-label="Unverify driver"
            >
              Unverify
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              icon={<Check className="h-4 w-4" />}
              onClick={(e) => handleVerify(driver.id, e)}
              aria-label="Verify driver"
            >
              Verify
            </Button>
          )}
        </div>
      ),
      className: 'w-[200px]',
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Search drivers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'verified' ? 'primary' : 'outline'}
            onClick={() => setFilter('verified')}
          >
            Verified
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredDrivers}
        keyExtractor={(driver) => driver.id}
        emptyMessage="No drivers found. Try adjusting your search or filters."
        className="border border-gray-200 rounded-lg"
      />
      
      {selectedDriverObj && (
        <DriverDetails
          driver={selectedDriverObj}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default DriverList;
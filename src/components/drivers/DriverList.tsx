// import React, { useState, useEffect } from 'react';
// import { DataTable } from '../ui/DataTable';
// import { Badge } from '../ui/Badge';
// import { Button } from '../ui/Button';
// import { Eye, Check, X } from 'lucide-react';
// import DriverDetails from './DriverDetails';
// import axios from 'axios';

// interface Driver {
//   id: number;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   vehicleType: string;
//   vehicleModel: string;
//   registrationNumber: string | null;
//   verified: boolean;
//   firstName: string;
//   lastName: string;
//   profileImage: string;
//   vehicleColor: string;
//   available: boolean; 
//   username: string;   
//   password: string;  
//   isVerified: boolean; 
// }

// const DriverList: React.FC = () => {
//   const [drivers, setDrivers] = useState<Driver[]>([]);
//   const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

//   useEffect(() => {
//     fetchDrivers();
//   }, []);

//   const fetchDrivers = async () => {
//     try {
//       const response = await axios.get<Driver[]>('http://localhost:8080/api/drivermanager/api/driver');

//       const transformedDrivers: Driver[] = response.data.map(driver => ({
//         ...driver,
//         name: driver.name || '',
//         email: driver.email || '',
//         phoneNumber: driver.phoneNumber || '',
//         vehicleType: driver.vehicleType || '',
//         vehicleModel: driver.vehicleModel || '',
//         registrationNumber: driver.registrationNumber || null,
//         verified: driver.verified ?? false,
//         firstName: driver.firstName || '',
//         lastName: driver.lastName || '',
//         profileImage: driver.profileImage || '',
//         vehicleColor: driver.vehicleColor || '',
//         available: driver.available ?? false,
//         username: driver.username || '',
//         password: driver.password || '',
//         isVerified: driver.isVerified ?? false
//       }));

//       setDrivers(transformedDrivers);
//     } catch (error) {
//       console.error('Failed to fetch drivers:', error);
//     }
//   };

//   const handleViewDriver = (id: number) => {
//     setSelectedDriver(id);
//   };

//   const handleCloseDetails = () => {
//     setSelectedDriver(null);
//   };

//   const handleVerify = async (id: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await axios.patch(`http://localhost:8080/api/drivermanager/api/driver/${id}/verify`, { verified: true });

//       setDrivers(prevDrivers =>
//         prevDrivers.map(driver =>
//           driver.id === id ? { ...driver, verified: true } : driver
//         )
//       );
//     } catch (error) {
//       console.error('Error verifying driver:', error);
//     }
//   };

//   const handleUnverify = async (id: number, e: React.MouseEvent) => {
//     e.stopPropagation();
//     try {
//       await axios.patch(`http://localhost:8080/api/drivermanager/api/driver/${id}/verify`, { verified: false });

//       setDrivers(prevDrivers =>
//         prevDrivers.map(driver =>
//           driver.id === id ? { ...driver, verified: false } : driver
//         )
//       );
//     } catch (error) {
//       console.error('Error unverifying driver:', error);
//     }
//   };

//   const filteredDrivers = drivers.filter(driver => {
//     const search = searchTerm.toLowerCase();
//     const matchesSearch =
//       (driver.name?.toLowerCase().includes(search) || '') ||
//       (driver.email?.toLowerCase().includes(search) || '') ||
//       (driver.phoneNumber?.includes(search) || '');

//     if (filter === 'all') return matchesSearch;
//     if (filter === 'verified') return matchesSearch && driver.verified;
//     if (filter === 'pending') return matchesSearch && !driver.verified;
//     return matchesSearch;
//   });

//   const selectedDriverObj = drivers.find(driver => driver.id === selectedDriver);

//   const columns = [
//     {
//       header: 'Driver',
//       accessor: (driver: Driver) => (
//         <div className="flex items-center">
//           <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
//             {driver.profileImage ? (
//               <img
//                 src={driver.profileImage}
//                 alt={driver.name || 'Driver'}
//                 className="h-10 w-10 object-cover"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.onerror = null;
//                   target.style.display = 'none';
//                 }}
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
//                 <span className="text-sm font-medium">
//                   {driver.firstName?.charAt(0) || 'U'}
//                 </span>
//               </div>
//             )}
//           </div>
//           <div className="ml-4">
//             <div className="font-medium text-gray-900">
//               {driver.firstName} {driver.lastName}
//             </div>
//             <div className="text-gray-500">{driver.email}</div>
//           </div>
//         </div>
//       ),
//       className: 'min-w-[250px]',
//     },
//     {
//       header: 'Phone',
//       accessor: (driver: Driver) => driver.phoneNumber,
//     },
//     {
//       header: 'Vehicle',
//       accessor: (driver: Driver) => (
//         <div>
//           <div className="font-medium">{driver.vehicleType} {driver.vehicleModel}</div>
//           <div className="text-gray-500">{driver.registrationNumber || '-'}</div>
//           <div className="text-gray-500">Color: {driver.vehicleColor}</div>
//         </div>
//       ),
//     },
//     {
//       header: 'Status',
//       accessor: (driver: Driver) => (
//         <Badge variant={driver.verified ? 'success' : 'warning'}>
//           {driver.verified ? 'Verified' : 'Pending'}
//         </Badge>
//       ),
//     },
//     {
//       header: 'Actions',
//       accessor: (driver: Driver) => (
//         <div className="flex space-x-2">
//           <Button
//             variant="secondary"
//             size="sm"
//             icon={<Eye className="h-4 w-4" />}
//             onClick={() => handleViewDriver(driver.id)}
//             aria-label="View driver details"
//           >
//             View
//           </Button>

//           {driver.verified ? (
//             <Button
//               variant="outline"
//               size="sm"
//               icon={<X className="h-4 w-4" />}
//               onClick={(e) => handleUnverify(driver.id, e)}
//               aria-label="Unverify driver"
//             >
//               Unverify
//             </Button>
//           ) : (
//             <Button
//               variant="success"
//               size="sm"
//               icon={<Check className="h-4 w-4" />}
//               onClick={(e) => handleVerify(driver.id, e)}
//               aria-label="Verify driver"
//             >
//               Verify
//             </Button>
//           )}
//         </div>
//       ),
//       className: 'w-[200px]',
//     },
//   ];

//   return (
//     <div>
//       <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center">
//         <input
//           type="text"
//           placeholder="Search drivers..."
//           className="w-full px-4 py-2 border rounded-md focus:outline-none"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All</Button>
//         <Button variant={filter === 'verified' ? 'primary' : 'outline'} onClick={() => setFilter('verified')}>Verified</Button>
//         <Button variant={filter === 'pending' ? 'primary' : 'outline'} onClick={() => setFilter('pending')}>Pending</Button>
//       </div>

//       <DataTable columns={columns} data={filteredDrivers} keyExtractor={(driver) => driver.id} />

//       {selectedDriverObj && <DriverDetails driver={selectedDriverObj} onClose={handleCloseDetails} />}
//     </div>
//   );
// };

// export default DriverList;
import React, { useState, useEffect } from 'react';
import { DataTable } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Eye, Check, X } from 'lucide-react';
import DriverDetails from './DriverDetails';
import axios from 'axios';

interface Driver {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  vehicleModel: string;
  registrationNumber: string | null;
  verified: boolean;
  firstName: string;
  lastName: string;
  profileImage: string;
  vehicleColor: string;
  available: boolean; 
  username: string;   
  password: string;  
  isVerified: boolean; 
}

const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get<Driver[]>('http://localhost:8080/api/drivermanager/api/driver');

      const transformedDrivers: Driver[] = response.data.map(driver => ({
        ...driver,
        verified: driver.verified ?? driver.isVerified,
      }));

      setDrivers(transformedDrivers);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  const handleViewDriver = (id: number) => {
    setSelectedDriver(id);
  };

  const handleCloseDetails = () => {
    setSelectedDriver(null);
  };

  const handleVerify = async (username: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8080/api/drivermanager/api/driver/verify?username=${username}`, { verified: true });

      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.username === username ? { ...driver, verified: true } : driver
        )
      );
    } catch (error) {
      console.error('Error verifying driver:', error);
    }
  };

  const handleUnverify = async (username: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.patch(`http://localhost:8080/api/drivermanager/api/driver/verify?username=${username}`, { verified: false });

      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.username === username ? { ...driver, verified: false } : driver
        )
      );
    } catch (error) {
      console.error('Error unverifying driver:', error);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (driver.name?.toLowerCase().includes(search) ?? false) ||
      (driver.email?.toLowerCase().includes(search) ?? false) ||
      (driver.phoneNumber?.includes(search) ?? false);

    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && driver.verified;
    if (filter === 'pending') return matchesSearch && !driver.verified;
    return matchesSearch;
  });

  const selectedDriverObj = drivers.find(driver => driver.id === selectedDriver);

  const columns = [
    {
      header: 'Driver',
      accessor: (driver: Driver) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
            {driver.profileImage ? (
              <img
                src={driver.profileImage}
                alt={driver.name}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                <span className="text-sm font-medium">
                  {driver.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {driver.firstName} {driver.lastName}
            </div>
            <div className="text-gray-500">{driver.email}</div>
          </div>
        </div>
      ),
      className: 'min-w-[250px]',
    },
    {
      header: 'Phone',
      accessor: (driver: Driver) => driver.phoneNumber,
    },
    {
      header: 'Vehicle',
      accessor: (driver: Driver) => (
        <div>
          <div className="font-medium">{driver.vehicleType} {driver.vehicleModel}</div>
          <div className="text-gray-500">{driver.registrationNumber || '-'}</div>
          <div className="text-gray-500">Color: {driver.vehicleColor}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (driver: Driver) => (
        <Badge variant={driver.verified ? 'success' : 'warning'}>
          {driver.verified ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (driver: Driver) => (
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

          {driver.verified ? (
            <Button
              variant="outline"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={(e) => handleUnverify(driver.username, e)}
              aria-label="Unverify driver"
            >
              Unverify
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              icon={<Check className="h-4 w-4" />}
              onClick={(e) => handleVerify(driver.username, e)}
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
        <input
          type="text"
          placeholder="Search drivers..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'verified' ? 'primary' : 'outline'} onClick={() => setFilter('verified')}>Verified</Button>
        <Button variant={filter === 'pending' ? 'primary' : 'outline'} onClick={() => setFilter('pending')}>Pending</Button>
      </div>

      <DataTable columns={columns} data={filteredDrivers} keyExtractor={(driver) => driver.id} />

      {selectedDriverObj && <DriverDetails driver={selectedDriverObj} onClose={handleCloseDetails} />}
    </div>
  );
};

export default DriverList;

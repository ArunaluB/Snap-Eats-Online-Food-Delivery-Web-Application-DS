import React from 'react';
import AppLayout from '../components/Layout/AppLayout';
import StatsCard from '../components/dashboard/StatsCard';
import { Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useDrivers } from '../context/DriverContext';
import { Link } from '../components/ui/Link';

const Dashboard: React.FC = () => {
  const { drivers } = useDrivers();
  
  const totalDrivers = drivers.length;
  const verifiedDrivers = drivers.filter(driver => driver.isVerified).length;
  const pendingDrivers = totalDrivers - verifiedDrivers;
  const activeDrivers = drivers.filter(driver => driver.available).length;
  
  const verificationRate = totalDrivers > 0 
    ? Math.round((verifiedDrivers / totalDrivers) * 100) 
    : 0;

  const recentDrivers = [...drivers]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Drivers"
          value={totalDrivers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Verified Drivers"
          value={verifiedDrivers}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
          change={{
            value: `${verificationRate}%`,
            isPositive: true
          }}
        />
        <StatsCard
          title="Pending Verification"
          value={pendingDrivers}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-100"
        />
        <StatsCard
          title="Active Drivers"
          value={activeDrivers}
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Driver Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${verificationRate}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-800">Verification Rate</span>
                    <span className="text-sm font-medium text-gray-800">{verificationRate}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Driver Overview</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Drivers</span>
                      <span className="font-medium">{totalDrivers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Verified Drivers</span>
                      <span className="font-medium">{verifiedDrivers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pending Verification</span>
                      <span className="font-medium">{pendingDrivers}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Status</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Active Drivers</span>
                      <span className="font-medium">{activeDrivers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Inactive Drivers</span>
                      <span className="font-medium">{totalDrivers - activeDrivers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Availability Rate</span>
                      <span className="font-medium">
                        {totalDrivers > 0 ? Math.round((activeDrivers / totalDrivers) * 100) : 0}%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link to="/drivers" className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Drivers →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200">
                {recentDrivers.map(driver => (
                  <li key={driver.id} className="py-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {driver.name || `${driver.firstName} ${driver.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {driver.vehicleType} • {driver.registrationNumber || driver.vehicleNo || driver.licencePlate || '-'}
                        </p>
                      </div>
                      <div>
                        {driver.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {recentDrivers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No drivers yet</p>
              )}
              <div className="mt-4 text-center">
                <Link to="/drivers" className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Drivers →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
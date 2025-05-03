import React from 'react';
import AppLayout from '../components/Layout/AppLayout';
import DriverList from '../components/drivers/DriverList';

const DriversPage: React.FC = () => {
  return (
    <AppLayout title="Drivers">
      <DriverList />
    </AppLayout>
  );
};

export default DriversPage;
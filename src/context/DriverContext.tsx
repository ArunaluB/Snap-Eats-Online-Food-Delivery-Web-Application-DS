import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Driver } from '../types/driver';
import { mockDrivers } from '../data/mockDrivers';

interface DriverContextType {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  verifyDriver: (id: number) => void;
  unverifyDriver: (id: number) => void;
  getDriverById: (id: number) => Driver | undefined;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);

  const verifyDriver = (id: number) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, isVerified: true } : driver
      )
    );
  };

  const unverifyDriver = (id: number) => {
    setDrivers(prevDrivers =>
      prevDrivers.map(driver =>
        driver.id === id ? { ...driver, isVerified: false } : driver
      )
    );
  };

  const getDriverById = (id: number) => {
    return drivers.find(driver => driver.id === id);
  };

  return (
    <DriverContext.Provider value={{ drivers, setDrivers, verifyDriver, unverifyDriver, getDriverById }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDrivers = () => {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDrivers must be used within a DriverProvider');
  }
  return context;
};
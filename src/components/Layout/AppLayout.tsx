import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="ml-64 w-full">
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
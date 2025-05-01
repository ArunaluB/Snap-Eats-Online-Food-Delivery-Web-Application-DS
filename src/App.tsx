// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import { Profile } from './pages/Profile';
import Earnings from './pages/Earnings';
import { Navbar } from './components/Navbar';
import EnhancedLayout from './pages/EnhancedLayout';
import { HowItWorks } from './components/HowItWorks';
import { Dashbord } from './components/Dashbord';
import { Features } from './components/Features';
import { Description } from './components/Description';
import { Footer } from './components/Footer';
import { Login } from './pages/login';
import { CustomerRegister } from './pages/customerRegistration';
import { DriverRegister } from './pages/driverRegistration';
import { RestaurantRegister } from './pages/restaurantRegistration';
import { Navigationbar } from './components/Layout/Navigationbar';
import DriversPage from './pages/DriversPage';
import VerificationsPage from './pages/VerificationsPage';
import SettingsPage from './pages/SettingsPage';
import { DriverProvider } from './context/DriverContext';
import DashboardAdmin from './pages/dashboardAdmin';
import RestaurantList from './components/RestaurantList';
import MenuItemsTable from './restaurant/MenuItemsTable';

//Imported new restaurant-related pages
import RestaurantProfile from './restaurant/RestaurantProfile'; 
import AddMenuItem from './restaurant/AddMenuItem';
import PublicMenu from './restaurant/PublicMenu';
import OrdersPage from './restaurant/OrdersPage';
import MenuItemReviews from './restaurant/MenuItemReviews';
import { VerifyOtp } from './components/VerifyOtp';
import { ShopMainPage } from './pages/fod-order/ShopMainPage';
import { LatestOrderPage } from './pages/fod-order/LatestOrderPage';
import OrderSummaryPage from './pages/fod-order/OrderSummaryPage';
import { OrderSuccessPage } from './pages/fod-order/OrderSuccessPage';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user role from localStorage or your auth system
    const token = localStorage.getItem("token");
    if (token) {
      // Ideally decode token or fetch role
      const decodedRole = "USER"; // mock for now, replace with real logic
      setRole(decodedRole);
    } else {
      setRole(null);
    }
  }, []);

  const noNavbarPaths = ['/login', '/customer-register', '/driver-register', '/restaurant-register'];

  if (noNavbarPaths.includes(location.pathname)) {
    return <main>{children}</main>; // no navbar
  }

  if (role === "DRIVER") {
    return (
      <>
        <Navigationbar />
        <main>{children}</main>
      </>
    );
  }

  if (role === "ADMIN") {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = (event: CustomEvent) => {
      setCurrentPath((event as CustomEvent<{ path: string }>).detail.path);
    };

    window.addEventListener('locationchange', handleLocationChange as EventListener);
    return () => {
      window.removeEventListener('locationchange', handleLocationChange as EventListener);
    };
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/drivers':
        return <DriversPage />;
      case '/verifications':
        return <VerificationsPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* User Dashboard */}
          <Route path="/" element={
            <>
              <Dashbord />
              {/* <div className="min-h-screen bg-gray-50">
                <RestaurantList />
              </div> */}
              <Features />
              <HowItWorks />
              <Description />
              <Footer />
            </>
          } />

          {/* Driver Dashboard */}
          <Route path="/driver" element={
            <EnhancedLayout>
              <Dashboard />
            </EnhancedLayout>
          } />

          {/* Restaurant Dashboard */}
          <Route path="/restaurant" element={<MenuItemsTable />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <DriverProvider>
              {renderPage()}
            </DriverProvider>} />

          {/* Common Pages */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/earnings" element={<Earnings />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/driver-register" element={<DriverRegister />} />
          <Route path="/restaurant-register" element={<RestaurantRegister />} />

          {/* ✅ Additional Restaurant Pages */}
          <Route path="/restaurant/profile" element={<RestaurantProfile />} />
          <Route path="/restaurant/menu" element={<AddMenuItem />} />
          <Route path="/restaurant/viewmenus" element={<MenuItemsTable />} />
          <Route path="/restaurant/public-menu" element={<PublicMenu />} />
          <Route path="/restaurant/orders" element={<OrdersPage />} />
          <Route path="/restaurant/review/:menuItemId" element={<MenuItemReviews />} />
          <Route path="/restaurant/shops" element={<RestaurantList/>} />

           {/* fod-order */}
          <Route path="/fod-order/Shop/:shopid" element={<ShopMainPage />} />
          <Route path="/fod-order/order-summary/:userId" element={<OrderSummaryPage />} />
          <Route path="/fod-order/order-success/:userId" element={<OrderSuccessPage />} />
          <Route path="/fod-order/latest-order/:userId" element={<LatestOrderPage />} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

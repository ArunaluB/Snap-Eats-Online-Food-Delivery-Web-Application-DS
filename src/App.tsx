// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Dashboard from './pages/Dashboard';
// import Orders from './pages/Orders';
// import { Profile } from './pages/Profile';
// import Earnings from './pages/Earnings';
// import { Navbar } from './components/Navbar';
// import EnhancedLayout from './pages/EnhancedLayout';
// import { Dashbord } from './components/Dashbord';
// import { Login } from './pages/login';
// import { CustomerRegister } from './pages/customerRegistration';
// import { DriverRegister } from './pages/driverRegistration';
// import { RestaurantRegister } from './pages/restaurantRegistration';
// import { Navigationbar } from './components/Layout/Navigationbar';
// import DashboardAdmin from './pages/dashboardAdmin';
// import MenuItemsTable from './restaurant/MenuItemsTable';
// import RestaurantProfile from './restaurant/RestaurantProfile';
// import AddMenuItem from './restaurant/AddMenuItem';
// import PublicMenu from './restaurant/PublicMenu';
// import OrdersPage from './restaurant/OrdersPage';
// import MenuItemReviews from './restaurant/MenuItemReviews';
// import RestaurantList from './components/RestaurantList';
// import { Features } from './components/Features';
// import { HowItWorks } from './components/HowItWorks';
// import { Description } from './components/Description';
// import { Footer } from './components/Footer';
// import { DriverProvider } from './context/DriverContext';
// import { VerifyOtp } from './components/VerifyOtp';
// import DriversPage from './pages/DriversPage';
// import VerificationsPage from './pages/VerificationsPage';
// import SettingsPage from './pages/SettingsPage';

// function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   const location = useLocation();
//   const [role, setRole] = useState<string | null>(null);
 
//   useEffect(() => {
//     const storedAuthData = localStorage.getItem("authData");
   
//     if (storedAuthData) {
//       try {
//         const parsedAuthData = JSON.parse(storedAuthData);
//         setRole(parsedAuthData.role || null);
//         console.log("Role set from localStorage:", parsedAuthData.role);
//       } catch (error) {
//         console.error("Failed to parse authData from localStorage", error);
//         setRole(null);
//       }
//     } else {
//       setRole(null);
//     }
//   }, [location]); // Re-check role when location changes
 
//   const noNavbarPaths = ['/login', '/customer-register', '/driver-register', '/restaurant-register'];
 
//   if (noNavbarPaths.includes(location.pathname)) {
//     return <main>{children}</main>; // No navbar for login/register paths
//   }
//   const [currentPath, setCurrentPath] = useState(window.location.pathname);


//   const renderPage = () => {
//     switch (currentPath) {
//       case '/drivers':
//         return <DriversPage />;
//       case '/verifications':
//         return <VerificationsPage />;
//       case '/settings':
//         return <SettingsPage />;
//       default:
//         return <DashboardAdmin />;
//     }
//   };
 
//   // Display appropriate navbar based on role
//   return (
//     <>
//       {role === "DRIVER" && <Navigationbar />}
//       {role === "RESTAURANT" && <Navbar />}
//       {role === "USER" && <Navbar />}
//       {role === "ADMIN"} 
//       {!role && <Navbar />} {/* Default navbar when no role is set */}


//       <main>{children}</main>
//     </>
//   );
// }

// export function App() {
  
//   return (
//     <Router>
//       <LayoutWrapper>
//         <Routes>
//           {/* User Dashboard */}
//           <Route path="/" element={
//             <>
//               <Dashbord />
//               <div className="min-h-screen bg-gray-50">
//                 <RestaurantList />
//               </div>
//               <Features />
//               <HowItWorks />
//               <Description />
//               <Footer />
//             </>
//           } />

//           {/* Driver Dashboard */}
//           <Route path="/driver" element={
//             <EnhancedLayout>
//               <Dashboard />
//             </EnhancedLayout>
//           } />

//           {/* Restaurant Dashboard */}
//           <Route path="/restaurant" element={<MenuItemsTable />} />

//           {/* Admin Dashboard */}
//           <Route path="/admin" element={
//             <DriverProvider>
//               <{renderPage()}>
//             </DriverProvider>} />

//           {/* Common Pages */}
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/earnings" element={<Earnings />} />

//           {/* Auth Pages */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/customer-register" element={<CustomerRegister />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/driver-register" element={<DriverRegister />} />
//           <Route path="/restaurant-register" element={<RestaurantRegister />} />

//           {/* ✅ Additional Restaurant Pages */}
//           <Route path="/restaurant/profile" element={<RestaurantProfile />} />
//           <Route path="/restaurant/menu" element={<AddMenuItem />} />
//           <Route path="/restaurant/viewmenus" element={<MenuItemsTable />} />
//           <Route path="/restaurant/public-menu" element={<PublicMenu />} />
//           <Route path="/restaurant/orders" element={<OrdersPage />} />
//           <Route path="/restaurant/review/:menuItemId" element={<MenuItemReviews />} />
//         </Routes>
//       </LayoutWrapper>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import { Profile } from './pages/Profile';
import Earnings from './pages/Earnings';
import { Navbar } from './components/Navbar';
import EnhancedLayout from './pages/EnhancedLayout';
import { Dashbord } from './components/Dashbord';
import { Login } from './pages/login';
import { CustomerRegister } from './pages/customerRegistration';
import { DriverRegister } from './pages/driverRegistration';
import { RestaurantRegister } from './pages/restaurantRegistration';
import { Navigationbar } from './components/Layout/Navigationbar';
import DashboardAdmin from './pages/dashboardAdmin';
import MenuItemsTable from './restaurant/MenuItemsTable';
import RestaurantProfile from './restaurant/RestaurantProfile';
import AddMenuItem from './restaurant/AddMenuItem';
import PublicMenu from './restaurant/PublicMenu';
import OrdersPage from './restaurant/OrdersPage';
import MenuItemReviews from './restaurant/MenuItemReviews';
import RestaurantRegistration from './restaurant/RestaurantRegistration';
import RestaurantList from './components/RestaurantList';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Description } from './components/Description';
import { Footer } from './components/Footer';
import { DriverProvider } from './context/DriverContext';
import { VerifyOtp } from './components/VerifyOtp';
import { ShopMainPage } from './pages/fod-order/ShopMainPage';
import { LatestOrderPage } from './pages/fod-order/LatestOrderPage';
import OrderSummaryPage from './pages/fod-order/OrderSummaryPage';
import { OrderSuccessPage } from './pages/fod-order/OrderSuccessPage';
import DriversPage from './pages/DriversPage';
import SettingsPage from './pages/SettingsPage';
import VerificationsPage from './pages/VerificationsPage';
import { AboutUsPage } from './pages/fod-order/AboutUsPage';
import { ContactUsPage } from './pages/fod-order/ContactUsPage';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      try {
        const parsedAuthData = JSON.parse(storedAuthData);
        setRole(parsedAuthData.role || null);
        console.log("Role set from localStorage:", parsedAuthData.role);
      } catch (error) {
        console.error("Failed to parse authData from localStorage", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }

    setCurrentPath(location.pathname);
  }, [location]);

  const noNavbarPaths = ['/login', '/customer-register', '/driver-register', '/restaurant-register'];

  if (noNavbarPaths.includes(location.pathname)) {
    return <main>{children}</main>; // No navbar for login/register paths
  }

  // Display appropriate navbar based on role
  return (
    <>
      {role === "DRIVER" && <Navigationbar />}
      {(role === "RESTAURANT" || role === "USER") && <Navbar />}
      {!role && <Navbar />} {/* Default navbar when no role is set */}
      <main>{children}</main>
    </>
  );
}

// Separate renderPage to use in Admin Route
function renderPage() {
  const path = window.location.pathname;
  switch (path) {
    case '/drivers':
      return <DriversPage />;
    case '/verifications':
      return <VerificationsPage />;
    case '/settings':
      return <SettingsPage />;
    default:
      return <DashboardAdmin />;
  }
}

export function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Landing Page */}
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

          {/* Admin Dashboard and Subpages */}
          <Route path="/admin" element={
            <DriverProvider>
              {renderPage()}
            </DriverProvider>
          } />

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

          {/* Restaurant Pages */}
          <Route path="/restaurant/profile" element={<RestaurantProfile />} />
          <Route path="/restaurant/menu" element={<AddMenuItem />} />
          <Route path="/restaurant/viewmenus" element={<MenuItemsTable />} />
          <Route path="/restaurant/public-menu" element={<PublicMenu />} />
          <Route path="/restaurant/orders" element={<OrdersPage />} />
          <Route path="/restaurant/reg" element={<RestaurantRegistration />} />
          <Route path="/restaurant/review/:menuItemId" element={<MenuItemReviews />} />
          <Route path="/restaurant/shops" element={<RestaurantList/>} />

           {/* fod-order */}
          <Route path="/fod-order/Shop/:shopid" element={<ShopMainPage />} />
          <Route path="/fod-order/order-summary/:userId" element={<OrderSummaryPage />} />
          <Route path="/fod-order/order-success/:userId" element={<OrderSuccessPage />} />
          <Route path="/fod-order/latest-order/:userId" element={<LatestOrderPage />} />
          <Route path="/fod-order/about-us" element={<AboutUsPage />} />
          <Route path="/fod-order/contact-us" element={<ContactUsPage />} />


          <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/verifications" element={
              <DriverProvider>
                 <VerificationsPage />
              </DriverProvider>} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

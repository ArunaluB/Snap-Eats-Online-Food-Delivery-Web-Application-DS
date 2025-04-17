import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Earnings } from './pages/Earnings';
import { Navbar } from './components/Layout/Navbar';
import EnhancedLayout from './pages/EnhancedLayout';
import { ShopMainPage } from './pages/fod-order/ShopMainPage';
import { UserNavBar } from './components/fod-order/UserNavBar';

export function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

function LayoutWrapper() {
  const location = useLocation();

  // Define paths where you want the UserNavBar instead of the default Navbar
  const isUserSection = location.pathname.startsWith('/fod-order');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {isUserSection ? <UserNavBar /> : <Navbar />}
      <main className="flex-1 container mx-auto px-4 py-4">
        <Routes>
          <Route path="/" element={
            <EnhancedLayout>
              <Dashboard />
            </EnhancedLayout>
          } />

          //fod-delevary
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/earnings" element={<Earnings />} />

          // fod-order
          <Route path="/fod-order/Shop" element={<ShopMainPage />} />

        </Routes>
      </main>
    </div>
  );
}
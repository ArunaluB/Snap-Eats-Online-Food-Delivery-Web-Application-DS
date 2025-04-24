import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Earnings } from './pages/Earnings';
import { Navbar } from './components/Layout/Navbar';
import EnhancedLayout from './pages/EnhancedLayout';
import RestaurantProfile from './restaurant/RestaurantProfile'; 
import AddMenuItem from './restaurant/AddMenuItem';
import MenuItemsTable from './restaurant/MenuItemsTable';
import PublicMenu from './restaurant/PublicMenu';
import OrdersPage from './restaurant/OrdersPage';

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-4">
          <Routes>
            <Route
              path="/"
              element={
                <EnhancedLayout>
                  <Dashboard />
                </EnhancedLayout>
              }
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/earnings" element={<Earnings />} />

            {/* ✅ New Restaurant Profile route */}
            <Route path="/restaurant/profile" element={<RestaurantProfile />} />
            <Route path="/restaurant/menu" element={<AddMenuItem/>} />
            <Route path="/restaurant/viewmenus" element={<MenuItemsTable/>} />
            <Route path="/restaurant/public-menu" element={<PublicMenu />} />
            <Route path="/restaurant/orders" element={<OrdersPage/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

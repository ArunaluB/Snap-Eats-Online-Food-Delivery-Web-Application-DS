import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import Earnings from './pages/Earnings';
import EnhancedLayout from './pages/EnhancedLayout';
import { Navbar } from './components/Navbar';
import { Dashbord } from './components/Dashbord';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Description } from './components/Description';
import { Footer } from './components/Footer';
import { CustomerRegister } from './pages/customerRegistration';
import { DriverRegister } from './pages/driverRegistration';
import { RestaurantRegister } from './pages/restaurantRegistration';
import { Login } from './pages/login';

export function App() {
  return <Router>
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Routes>
        <Route path="/" element={
          <>
            <Dashbord />
            <Features />
            <HowItWorks />
            <Description />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/driver-register" element={<DriverRegister />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/driver" element={<EnhancedLayout>
            <Dashboard />
          </EnhancedLayout>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/earnings" element={<Earnings />} />
        </Routes>
      </main>
    </div>
  </Router>;
}

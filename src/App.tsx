import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import Earnings from './pages/Earnings';
import { Navbar } from './components/Layout/Navbar';
import EnhancedLayout from './pages/EnhancedLayout';

export function App() {
  return <Router>
    <div className=" flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EnhancedLayout>
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

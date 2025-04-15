import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { Earnings } from './pages/Earnings';
import { Navbar } from './components/Layout/Navbar';

export function App() {
  return <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/earnings" element={<Earnings />} />
          </Routes>
        </main>
      </div>
    </Router>;
}

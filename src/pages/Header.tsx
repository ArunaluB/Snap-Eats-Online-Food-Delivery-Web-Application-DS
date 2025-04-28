import { useContext, useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { OrderStatsContext } from './Dashboard';
import { OrderStore } from '../utils/OrderStore';

export default function Header() {
  const { stats } = useContext(OrderStatsContext);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [user, setUser] = useState<null | { username: string; profileImage: string; id: string }>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setUser({
          username: parsed.username,
          profileImage: parsed.profileImage,
          id: parsed.id || 'DR00000', 
        });
      } catch (err) {
        console.error('Error parsing authData:', err);
      }
    }
  }, []);

  useEffect(() => {
    const storeEarnings = OrderStore?.getTodayEarnings?.() || 0;
    setIsAnimating(true);

    if (storeEarnings > 0) {
      setTodayEarnings(storeEarnings);
    } else {
      const averageOrderValue = 500;
      setTodayEarnings(stats.todayOrders * averageOrderValue);
    }

    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [stats.todayOrders]);

  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('LKR', '').trim();
  };

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-blue-100 p-4 md:p-6 flex justify-between items-center shadow-2xl rounded-lg">
      <div className="flex items-center space-x-3">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Driver"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-blue-600 font-bold">D</span>
          </div>
        )}
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-800">{user?.username || 'Driver'}</h2>
          <p className="text-xs text-gray-500">ID: #{user?.id || 'DR00000'}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl shadow-sm border border-blue-200">
        <div className="flex items-center text-sm text-gray-700">
          <DollarSign className="h-4 w-4 text-yellow-500 mr-1" />
          <span>Today's Earnings</span>
        </div>
        <p className={`font-bold text-lg transition-all duration-500 ${isAnimating ? 'scale-110 text-blue-600' : 'text-gray-800'}`}>
          LKR {formatCurrency(todayEarnings)}
        </p>
      </div>
    </div>
  );
}
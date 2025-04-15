// // components/Header.jsx
// import { DollarSign } from 'lucide-react';

// export default function Header() {
//   return (
//     <div className="bg-white p-4 flex justify-between items-center shadow">
//       <div className="flex items-center space-x-2">
//         <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
//         <div>
//           <h2 className="font-medium">Driver</h2>
//           <p className="text-xs text-gray-500">ID: #DR12345</p>
//         </div>
//       </div>
//       <div className="bg-gray-100 p-2 rounded-lg">
//         <div className="flex items-center text-sm">
//           <DollarSign className="h-4 w-4 text-yellow-500 mr-1" />
//           <span>Today Earning</span>
//         </div>
//         <p className="font-bold">LKR 0.00</p>
//       </div>
//     </div>
//   );
// }


// components/Header.jsx
import { useContext, useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { OrderStatsContext } from './Dashboard'; 
import { OrderStore } from '../utils/OrderStore'; 

export default function Header() {
  const { stats } = useContext(OrderStatsContext);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    const storeEarnings = OrderStore?.getTodayEarnings?.() || 0;
    if (storeEarnings > 0) {
      setTodayEarnings(storeEarnings);
    } else {
      const averageOrderValue = 500; 
      setTodayEarnings(stats.todayOrders * averageOrderValue);
    }
  }, [stats.todayOrders]);

  // Format currency
  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('LKR', '').trim();
  };

  return (
    <div className="bg-white p-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-2">
        <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
        <div>
          <h2 className="font-medium">Driver</h2>
          <p className="text-xs text-gray-500">ID: #DR12345</p>
        </div>
      </div>
      <div className="bg-gray-100 p-2 rounded-lg">
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 text-yellow-500 mr-1" />
          <span>Today Earning</span>
        </div>
        <p className="font-bold">LKR {formatCurrency(todayEarnings)}</p>
      </div>
    </div>
  );
}
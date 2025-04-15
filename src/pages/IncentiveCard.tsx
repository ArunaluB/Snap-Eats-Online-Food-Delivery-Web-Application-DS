// // components/IncentiveCard.jsx
// import { Clock } from 'lucide-react';

// export default function IncentiveCard() {
//   return (
//     <div className="px-4 mt-4">
//       <div className="bg-white p-4 rounded-lg shadow">
//         <div className="flex justify-between items-center">
//           <h3 className="font-semibold">WEEKLY INCENTIVE - FOOD DELIVERY</h3>
//           <div className="flex items-center text-sm">
//             <Clock className="h-4 w-4 mr-1 text-orange-500" />
//             <span>2 days left</span>
//           </div>
//         </div>
//         <div className="mt-3">
//           <div className="flex justify-between mb-1 text-sm">
//             <span>Progress</span>
//             <span className="font-medium">0/15</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div className="bg-orange-500 h-2 rounded-full w-0"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// components/IncentiveCard.jsx
import { Clock } from 'lucide-react';
import { useContext } from 'react';
import { OrderStatsContext } from '../pages/Dashboard';

export default function IncentiveCard() {
  const { stats } = useContext(OrderStatsContext);
  const targetOrders = 15;
  const progressPercentage = Math.min((stats.weeklyOrders / targetOrders) * 100, 100);

  // Calculate days remaining in the current week (assuming week ends on Sunday)
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay();
  const daysLeft = daysUntilSunday === 0 ? 7 : daysUntilSunday;

  return (
    <div className="px-4 mt-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">WEEKLY INCENTIVE - FOOD DELIVERY</h3>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-orange-500" />
            <span>{daysLeft} days left</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span className="font-medium">{stats.weeklyOrders}/{targetOrders}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
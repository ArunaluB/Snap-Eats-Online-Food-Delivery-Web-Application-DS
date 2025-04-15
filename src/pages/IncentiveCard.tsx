// components/IncentiveCard.jsx
import { Clock } from 'lucide-react';

export default function IncentiveCard() {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">WEEKLY INCENTIVE - FOOD DELIVERY</h3>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-orange-500" />
            <span>2 days left</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span className="font-medium">0/15</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
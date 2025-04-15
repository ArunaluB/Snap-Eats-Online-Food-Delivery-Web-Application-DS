import { DollarSignIcon, TrendingUpIcon } from 'lucide-react';
export function Earnings() {
  return <div className="mb-16">
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Your Earnings</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Today's Earnings</span>
              <span className="text-xl font-bold">$0.00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <DollarSignIcon className="h-5 w-5 text-green-500" />
            <span>This Week: $0.00</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUpIcon className="h-5 w-5 text-yellow-500" />
            <span>This Month: $0.00</span>
          </div>
        </div>
      </div>
    </div>;
}

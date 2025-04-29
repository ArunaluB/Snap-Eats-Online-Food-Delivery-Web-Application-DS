import { useState, useEffect } from 'react';
import { PackageIcon, TruckIcon, MapPinIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react';

interface RecentOrdersProps {
  isOnline: boolean;
  nearbyOrders: { id: string; shop: string; distance: number; amount: string }[];
  handleOrderClick: (order: { id: string; shop: string; distance: string; amount: string }) => void;
}

export default function RecentOrders({ isOnline, nearbyOrders, handleOrderClick }: RecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [animatedOrders, setAnimatedOrders] = useState<{ id: string; shop: string; distance: string; amount: string }[]>([]);

  useEffect(() => {
    if (nearbyOrders.length > 0) {
      setAnimatedOrders([]);
      const timer = setTimeout(() => {
        return setAnimatedOrders(nearbyOrders.map(order => ({
          ...order,
          distance: order.distance.toString(),
        })));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedOrders([]);
    }
  }, [nearbyOrders]);

  return (
    <div className="px-4 mt-4">
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden transition-all duration-500 hover:shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 bg-orange-400 rounded-full -translate-x-8 -translate-y-8"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300 rounded-full translate-x-8 -translate-y-8"></div>
          </div>

          <div className="relative p-5 flex items-center justify-between border-b border-orange-100">
            <div className="flex items-center space-x-2">
              <PackageIcon className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
            </div>

            <div className="flex items-center">
              {isOnline ? (
                <div className="flex items-center space-x-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Online</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                  </span>
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isOnline && nearbyOrders.length > 0 ? (
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50">
            {animatedOrders.map((order, index) => (
              <div
                key={order.id}
                className={`p-4 transition-all duration-300 animate-fadeIn`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div
                  className={`rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedOrder === order.id ? 'bg-orange-100 shadow-md' : 'bg-white hover:bg-orange-50'
                    }`}
                  onClick={() => {
                    setSelectedOrder(order.id);
                    handleOrderClick(order);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4 text-orange-500" />
                        <h4 className="font-semibold text-gray-800">{order.shop}</h4>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{order.distance}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                        {order.amount}
                      </span>

                      <button className={`mt-2 flex items-center text-xs font-medium rounded-full px-2 py-1 transition-all duration-300 ${selectedOrder === order.id ? 'bg-orange-500 text-white' : 'text-orange-500 hover:bg-orange-100'
                        }`}>
                        <span>Details</span>
                        <ArrowRightIcon className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-orange-100 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isOnline ? (
                  <PackageIcon className="h-12 w-12 text-orange-300 animate-pulse" />
                ) : (
                  <PackageIcon className="h-12 w-12 text-gray-300" />
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-700 text-lg">No recent orders</p>
              <p className="text-gray-500 mt-2 max-w-xs">
                {isOnline ?
                  'Waiting for new orders to come in. You\'ll be notified when they arrive.' :
                  'You\'re currently offline. Go online to start receiving delivery requests.'}
              </p>

              {!isOnline && (
                <button className="mt-6 group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-full shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-500 to-orange-600"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-orange-400 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    <span>Go Online</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #FFF7ED;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #FDBA74;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
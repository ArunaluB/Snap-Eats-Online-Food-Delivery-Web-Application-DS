import { useState, useEffect } from 'react';
import { PackageIcon, MapIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { OrderTrackingService } from '../utils/OrderTrackingService';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderStats() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayDistance: 0,
    weeklyOrders: 0,
    weeklyDistance: 0
  });
  
  useEffect(() => {
    const currentStats = OrderTrackingService.getStats();
    setStats({
      todayOrders: currentStats.todayOrders,
      todayDistance: currentStats.todayDistance,
      weeklyOrders: currentStats.weeklyOrders,
      weeklyDistance: currentStats.weeklyDistance
    });
    
    const intervalId = setInterval(() => {
      const updatedStats = OrderTrackingService.getStats();
      setStats(prevStats => {
        if (JSON.stringify(prevStats) !== JSON.stringify(updatedStats)) {
          return { ...updatedStats };
        }
        return prevStats;
      });
    }, 30000); 
    
    return () => clearInterval(intervalId);
  }, []);
  
  const valueVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="relative w-full bg-gray-50">
      <div className="w-full mt-6 mb-6">
        <div className="flex flex-wrap">
          <motion.div 
            className="w-1/2 lg:w-1/4 p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-amber-50 rounded-lg p-4 h-full">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-amber-100 rounded-full mr-2">
                  <PackageIcon className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              </div>
              <div className="h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={stats.todayOrders}
                    className="text-3xl font-bold text-gray-800"
                    variants={valueVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {stats.todayOrders}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-1/2 lg:w-1/4 p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-blue-50 rounded-lg p-4 h-full">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-blue-100 rounded-full mr-2">
                  <MapIcon className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Today's Distance</p>
              </div>
              <div className="h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={stats.todayDistance}
                    className="text-3xl font-bold text-gray-800"
                    variants={valueVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {stats.todayDistance.toFixed(1)} km
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-1/2 lg:w-1/4 p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-green-50 rounded-lg p-4 h-full">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-100 rounded-full mr-2">
                  <CalendarIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Weekly Orders</p>
              </div>
              <div className="h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={stats.weeklyOrders}
                    className="text-3xl font-bold text-gray-800"
                    variants={valueVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {stats.weeklyOrders}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-1/2 lg:w-1/4 p-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-purple-50 rounded-lg p-4 h-full">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-purple-100 rounded-full mr-2">
                  <TrendingUpIcon className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Weekly Distance</p>
              </div>
              <div className="h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={stats.weeklyDistance}
                    className="text-3xl font-bold text-gray-800"
                    variants={valueVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {stats.weeklyDistance.toFixed(1)} km
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
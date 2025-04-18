import { Clock, Gift, ChevronRight, ChevronDown, Award, Calendar, Target, Check } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { OrderStatsContext } from '../pages/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

export default function IncentiveCard() {
  const { stats } = useContext(OrderStatsContext);
  const targetOrders = 15;
  const progressPercentage = Math.min((stats.weeklyOrders / targetOrders) * 100, 100);
  const [animateProgress, setAnimateProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay();
  const daysLeft = daysUntilSunday === 0 ? 7 : daysUntilSunday;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const weekDateRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

  useEffect(() => {
    setAnimateProgress(0);
    const timer = setTimeout(() => {
      setAnimateProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const reward = progressPercentage >= 100 ? "500" : "Complete target to claim";
  const isComplete = progressPercentage >= 100;

  const milestones = [
    { orders: 5, reward: "100", completed: stats.weeklyOrders >= 5 },
    { orders: 10, reward: "300", completed: stats.weeklyOrders >= 10 },
    { orders: 15, reward: "500", completed: stats.weeklyOrders >= 15 }
  ];

  return (
    <motion.div
      className="mt-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl shadow-md border border-orange-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-full mr-3">
              <Gift className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="font-bold text-gray-800">WEEKLY INCENTIVE</h3>
          </div>
          <motion.div
            className="flex items-center text-sm bg-orange-100 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="h-4 w-4 mr-1 text-orange-500" />
            <span className="font-medium text-gray-700">{daysLeft} days left</span>
          </motion.div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium text-gray-600">Food Delivery Progress</span>
            <motion.span
              className="font-bold text-gray-800"
              key={stats.weeklyOrders}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {stats.weeklyOrders}/{targetOrders}
            </motion.span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-orange-500'}`}
              initial={{ width: "0%" }}
              animate={{ width: `${animateProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Reward</p>
              <motion.p
                className={`font-bold text-lg ${isComplete ? 'text-green-600' : 'text-gray-700'}`}
                key={reward}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {reward}
              </motion.p>
            </div>

            <motion.button
              className={`flex items-center px-4 py-2 rounded-lg text-white ${isComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-400 hover:bg-orange-500'
                }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="mr-1 font-medium">{isComplete ? 'Claim' : 'Details'}</span>
              {isComplete ?
                <ChevronRight className="h-4 w-4" /> :
                <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              }
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                className="mt-5 pt-5 border-t border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Week: {weekDateRange}</span>
                </div>

                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="h-4 w-4 text-orange-500 mr-2" />
                  Milestones & Rewards
                </h4>

                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${milestone.completed ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                          {milestone.completed ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <Target className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium">
                          {milestone.orders} Orders
                        </span>
                      </div>
                      <span className={`font-bold ${milestone.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {milestone.reward}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Complete deliveries within the specified week</li>
                    <li>• Rewards will be credited within 3 working days</li>
                    <li>• Cancellations and returns will not count toward the total</li>
                    <li>• Maximum one incentive per driver per week</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
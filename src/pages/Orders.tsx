import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { 
  Truck, Check, X, Package, Clock, MapPin, 
  Phone, DollarSign, Calendar, ChevronDown, 
  RefreshCw, Filter
} from 'lucide-react';
interface OrderItem {
  [key: string]: number;
}

interface Order {
  id: number;
  orderId: string;
  status: 'PENDING' | 'DELIVERED' | 'REJECTED';
  createdAt: string;
  amount: number;
  shop: string;
  shopLat: number;
  shopLng: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  distance: number;
  distanceToShop: number;
  estimatedTimeToShop: number;
  items: OrderItem;
}

type SortType = 'date' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';
type FilterType = 'ALL' | 'PENDING' | 'DELIVERED' | 'REJECTED';

import { Variant } from 'framer-motion';

interface AnimationVariants {
  [key: string]: Variant; 
  hidden: Variant;
  show: Variant;
}

export function Orders(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Order[]>('http://localhost:8080/api/drivermanager/api/order/driver/1/orders');
        setOrders(response.data);
        setUsingMockData(false);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        // Load mock data as fallback
        setUsingMockData(true);
        
        const mockOrders: Order[] = [
          {
            id: 1,
            orderId: "ORD-9385",
            status: "PENDING",
            createdAt: new Date().toISOString(),
            amount: 32.50,
            shop: "Burger Palace",
            shopLat: 37.7749,
            shopLng: -122.4194,
            customerName: "John Doe",
            customerPhone: "(555) 123-4567",
            customerAddress: "123 Main St, San Francisco, CA",
            distance: 3.4,
            distanceToShop: 1.2,
            estimatedTimeToShop: 420,
            items: { "Cheeseburger": 2, "Fries": 1, "Soda": 2 }
          },
          {
            id: 2,
            orderId: "ORD-8124",
            status: "DELIVERED",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            amount: 45.75,
            shop: "Pizza Express",
            shopLat: 37.7833,
            shopLng: -122.4167,
            customerName: "Jane Smith",
            customerPhone: "(555) 987-6543",
            customerAddress: "456 Oak Ave, San Francisco, CA",
            distance: 2.1,
            distanceToShop: 0.8,
            estimatedTimeToShop: 180,
            items: { "Large Pizza": 1, "Garlic Bread": 1, "Salad": 1 }
          },
          {
            id: 3,
            orderId: "ORD-7231",
            status: "REJECTED",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            amount: 28.90,
            shop: "Sushi Place",
            shopLat: 37.7833,
            shopLng: -122.4167,
            customerName: "Mike Johnson",
            customerPhone: "(555) 555-5555",
            customerAddress: "789 Pine St, San Francisco, CA",
            distance: 4.5,
            distanceToShop: 2.3,
            estimatedTimeToShop: 600,
            items: { "California Roll": 2, "Edamame": 1, "Miso Soup": 2 }
          }
        ];
        
        setOrders(mockOrders);
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Order['status']): JSX.Element => {
    switch (status) {
      case 'DELIVERED':
        return <Check className="text-green-500" />;
      case 'REJECTED':
        return <X className="text-red-500" />;
      case 'PENDING':
        return <Clock className="text-yellow-500" />;
      default:
        return <Clock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusBackground = (status: Order['status']): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50';
      case 'REJECTED':
        return 'bg-red-50';
      case 'PENDING':
        return 'bg-yellow-50';
      default:
        return 'bg-white';
    }
  };

  const toggleOrderExpansion = (id: number): void => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const toggleSort = (sortType: SortType): void => {
    if (sortBy === sortType) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortDirection('desc');
    }
  };

  const sortOrders = (ordersToSort: Order[]): Order[] => {
    return [...ordersToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredOrders = filter === 'ALL' 
    ? sortOrders(orders) 
    : sortOrders(orders.filter(order => order.status === filter));

  // Animation variants
  const container: AnimationVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item: AnimationVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };

  const expandedContent: AnimationVariants = {
    hidden: { opacity: 0, height: 0 },
    show: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const shimmer: AnimationVariants = {
    hidden: { 
      backgroundPosition: "200% 0" 
    },
    show: { 
      backgroundPosition: "-200% 0",
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  const pulseAnimation = {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
      }
    };

  const fadeIn: AnimationVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="mt-10 mb-16 ml-8 mr-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Orders</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center">
            <motion.div
              animate={{ 
                rotate: 360,
                borderRadius: ["50% 50%", "30% 70%", "70% 30%", "50% 50%"]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                borderRadius: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent mb-6"
            />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 font-medium"
            >
              Loading your orders...
            </motion.span>
            <div className="mt-8 w-full max-w-md space-y-4">
              {[1, 2, 3].map((index) => (
                <motion.div 
                  key={index}
                  variants={shimmer}
                  initial="hidden"
                  animate="show"
                  className="h-24 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg"
                  style={{ 
                    backgroundSize: "400% 100%"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mt-10 mb-16 ml-8 mr-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Orders</h2>
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="p-12 text-center"
            animate={pulseAnimation}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="mb-6 bg-blue-50 rounded-full p-6 w-32 h-32 flex items-center justify-center mx-auto"
            >
              <Package size={64} className="text-blue-500" />
            </motion.div>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-medium text-gray-800 mb-2"
            >
              No active orders
            </motion.p>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              New delivery orders will appear here when assigned to you
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-10 mb-16 ml-8 mr-8 ">
      {usingMockData && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-amber-800 flex items-center"
        >
          <Clock size={18} className="mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Using demo data</p>
            <p className="text-sm">Server connection failed. Showing sample orders for demonstration.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-auto bg-amber-100 hover:bg-amber-200 text-amber-800 py-1 px-3 rounded-md text-sm font-medium flex items-center"
          >
            <RefreshCw size={14} className="mr-1" /> Retry
          </button>
        </motion.div>
      )}
      
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Your Orders</h2>
        
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg shadow px-3 py-2 flex items-center">
            <Filter size={16} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-600 mr-2">Sort:</span>
            <div className="flex gap-2">
              {[
                { id: 'date' as SortType, label: 'Date' },
                { id: 'amount' as SortType, label: 'Amount' },
                { id: 'status' as SortType, label: 'Status' }
              ].map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => toggleSort(sort.id)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    sortBy === sort.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {sort.label} 
                  {sortBy === sort.id && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl shadow mb-6 p-3 flex space-x-2 overflow-x-auto"
      >
        {(['ALL', 'PENDING', 'DELIVERED', 'REJECTED'] as FilterType[]).map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              filter === status 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? (
              <>All Orders</>
            ) : status === 'DELIVERED' ? (
              <><Check size={14} className="mr-1" /> {status}</>
            ) : status === 'REJECTED' ? (
              <><X size={14} className="mr-1" /> {status}</>
            ) : (
              <><Clock size={14} className="mr-1" /> {status}</>
            )}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredOrders.map((order) => (
            <motion.div 
              layout
              key={order.id} 
              variants={item}
              className={`rounded-xl shadow-md overflow-hidden border border-gray-100 ${getStatusBackground(order.status)}`}
              whileHover={{ 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -3
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div 
                className="p-5 cursor-pointer"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 260, 
                          damping: 20,
                          delay: 0.1
                        }}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3"
                      >
                        <Truck size={20} className="text-blue-600" />
                      </motion.div>
                      <div>
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="font-bold text-lg text-gray-800"
                        >
                          {order.orderId}
                        </motion.span>
                        <div className="text-gray-500 text-sm flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </motion.span>
                    
                    <motion.div
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-bold text-lg">${order.amount.toFixed(2)}</span>
                    </motion.div>
                    <motion.div
                      animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-100 p-1 rounded-full"
                    >
                      <ChevronDown size={20} className="text-gray-600" />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      key={`expanded-${order.id}`}
                      variants={expandedContent}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="mt-4"
                    >
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Package size={16} className="mr-2 text-blue-500" />
                            Store Details
                          </div>
                          <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                            <div className="font-medium text-lg mb-2">{order.shop}</div>
                            <div className="flex items-start mt-2 text-sm text-gray-600">
                              <MapPin size={14} className="mr-2 mt-1 flex-shrink-0" />
                              <span>
                                Location: ({order.shopLat.toFixed(4)}, {order.shopLng.toFixed(4)})
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Truck size={16} className="mr-2 text-blue-500" />
                            Customer Details
                          </div>
                          <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                            <div className="font-medium text-lg mb-1">{order.customerName}</div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <Phone size={14} className="mr-2 flex-shrink-0" />
                              {order.customerPhone}
                            </div>
                            <div className="flex items-start mt-2 text-sm text-gray-600">
                              <MapPin size={14} className="mr-2 mt-1 flex-shrink-0" />
                              <span>{order.customerAddress}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Package size={16} className="mr-2 text-blue-500" />
                          Order Items
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(order.items).map(([item, quantity], index) => (
                            <motion.div 
                              key={item} 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + (index * 0.1) }}
                              whileHover={{ scale: 1.03, y: -2 }}
                              className="bg-white bg-opacity-70 p-3 rounded-lg shadow-sm flex justify-between items-center"
                            >
                              <span className="font-medium">{item}</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">×{quantity}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-3 gap-3"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.03, y: -2 }}
                          className="bg-blue-50 p-3 rounded-lg shadow-sm"
                        >
                          <div className="text-xs text-blue-600 font-medium mb-1">Total Distance</div>
                          <div className="font-bold text-lg text-gray-800">{order.distance.toFixed(1)} km</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.03, y: -2 }}
                          className="bg-purple-50 p-3 rounded-lg shadow-sm"
                        >
                          <div className="text-xs text-purple-600 font-medium mb-1">Distance to Store</div>
                          <div className="font-bold text-lg text-gray-800">
                            {order.distanceToShop < 1 
                              ? `${(order.distanceToShop * 1000).toFixed(0)} m` 
                              : `${order.distanceToShop.toFixed(1)} km`}
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.03, y: -2 }}
                          className="bg-amber-50 p-3 rounded-lg shadow-sm"
                        >
                          <div className="text-xs text-amber-600 font-medium mb-1">Est. Travel Time</div>
                          <div className="font-bold text-lg text-gray-800">
                            {order.estimatedTimeToShop < 60 
                              ? `${Math.round(order.estimatedTimeToShop)} sec` 
                              : `${Math.round(order.estimatedTimeToShop / 60)} min`}
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredOrders.length === 0 && filter !== 'ALL' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <motion.div animate={pulseAnimation}>
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">No {filter.toLowerCase()} orders found</p>
            <p className="text-gray-500">Try changing the filter or check back later</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
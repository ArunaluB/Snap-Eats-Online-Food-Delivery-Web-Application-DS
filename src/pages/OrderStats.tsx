// // components/OrderStats.jsx
// import { useState, useEffect } from 'react';
// import { PackageIcon, MapIcon, CalendarIcon, RouteIcon } from 'lucide-react';
// import { OrderTrackingService } from '../utils/OrderTrackingService';

// export default function OrderStats() {
//   const [stats, setStats] = useState({
//     todayOrders: 0,
//     todayDistance: 0,
//     weeklyOrders: 0,
//     weeklyDistance: 0
//   });
  
//   useEffect(() => {
//     // Load stats on component mount
//     const currentStats = OrderTrackingService.getStats();
//     setStats({
//       todayOrders: currentStats.todayOrders,
//       todayDistance: currentStats.todayDistance,
//       weeklyOrders: currentStats.weeklyOrders,
//       weeklyDistance: currentStats.weeklyDistance
//     });
//   }, []);

//   return (
//     <div className="px-4 mt-4">
//       <div className="grid grid-cols-2 gap-3 mb-3">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <PackageIcon className="h-6 w-6 text-orange-500" />
//           <h3 className="mt-1 font-semibold text-sm">Today's Orders</h3>
//           <p className="text-xl font-bold text-gray-800">{stats.todayOrders}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <MapIcon className="h-6 w-6 text-blue-500" />
//           <h3 className="mt-1 font-semibold text-sm">Today's Distance</h3>
//           <p className="text-xl font-bold text-gray-800">{stats.todayDistance.toFixed(1)} km</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-3">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <CalendarIcon className="h-6 w-6 text-green-500" />
//           <h3 className="mt-1 font-semibold text-sm">Weekly Orders</h3>
//           <p className="text-xl font-bold text-gray-800">{stats.weeklyOrders}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <RouteIcon className="h-6 w-6 text-purple-500" />
//           <h3 className="mt-1 font-semibold text-sm">Weekly Distance</h3>
//           <p className="text-xl font-bold text-gray-800">{stats.weeklyDistance.toFixed(1)} km</p>
//         </div>
//       </div>
//     </div>
//   );
// }
// import { useState, useEffect, useRef } from 'react';
// import { PackageIcon, MapIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
// import { OrderTrackingService } from '../utils/OrderTrackingService';
// import { motion } from 'framer-motion';
// import * as THREE from 'three';

// export default function OrderStats() {
//   const [stats, setStats] = useState({
//     todayOrders: 0,
//     todayDistance: 0,
//     weeklyOrders: 0,
//     weeklyDistance: 0
//   });
  
//   const canvasRef = useRef(null);
//   const sceneRef = useRef(null);
  
//   useEffect(() => {
//     // Load stats on component mount
//     const currentStats = OrderTrackingService.getStats();
//     setStats({
//       todayOrders: currentStats.todayOrders,
//       todayDistance: currentStats.todayDistance,
//       weeklyOrders: currentStats.weeklyOrders,
//       weeklyDistance: currentStats.weeklyDistance
//     });
    
//     // Initialize Three.js background
//     initThreeJsBackground();
    
//     return () => {
//       if (sceneRef.current) {
//         cancelAnimationFrame(sceneRef.current.animationId);
//         sceneRef.current.renderer.dispose();
//       }
//     };
//   }, []);
  
//   const initThreeJsBackground = () => {
//     if (!canvasRef.current) return;
    
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       alpha: true,
//       antialias: true
//     });
    
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xf8fafc, 1);
    
//     // Create particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particlesCount = 300;
    
//     const posArray = new Float32Array(particlesCount * 3);
    
//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 5;
//     }
    
//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.02,
//       color: 0xe2e8f0
//     });
    
//     const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particlesMesh);
    
//     camera.position.z = 2;
    
//     // Add some light
//     const ambientLight = new THREE.AmbientLight(0xffffff);
//     scene.add(ambientLight);
    
//     // Animation
//     const animate = () => {
//       particlesMesh.rotation.y += 0.0005;
//       particlesMesh.rotation.x += 0.0002;
      
//       renderer.render(scene, camera);
//       sceneRef.current.animationId = requestAnimationFrame(animate);
//     };
    
//     // Handle window resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
    
//     window.addEventListener('resize', handleResize);
    
//     sceneRef.current = { scene, camera, renderer, animate, animationId: null };
//     animate();
//   };
  
//   return (
//     <div className="relative w-full">
//       {/* 3D Background */}
//       <canvas 
//         ref={canvasRef} 
//         className="fixed top-0 left-0 w-full h-full -z-10" 
//       />
      
//       {/* Stats boxes in a row like the example */}
//       <div className="w-full mt-6 mb-6">
//         <div className="flex flex-wrap">
//           {/* Today's Orders */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="bg-amber-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-amber-100 rounded-full mr-2">
//                   <PackageIcon className="h-5 w-5 text-amber-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Today's Orders</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.todayOrders}</p>
//             </div>
//           </motion.div>
          
//           {/* Today's Distance */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//           >
//             <div className="bg-blue-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-blue-100 rounded-full mr-2">
//                   <MapIcon className="h-5 w-5 text-blue-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Today's Distance</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.todayDistance.toFixed(1)} km</p>
//             </div>
//           </motion.div>
          
//           {/* Weekly Orders */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//           >
//             <div className="bg-green-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-green-100 rounded-full mr-2">
//                   <CalendarIcon className="h-5 w-5 text-green-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Weekly Orders</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.weeklyOrders}</p>
//             </div>
//           </motion.div>
          
//           {/* Weekly Distance */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//           >
//             <div className="bg-purple-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-purple-100 rounded-full mr-2">
//                   <TrendingUpIcon className="h-5 w-5 text-purple-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Weekly Distance</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.weeklyDistance.toFixed(1)} km</p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// import { PackageIcon, MapIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
// import { OrderTrackingService } from '../utils/OrderTrackingService';
// import { motion } from 'framer-motion';

// export default function OrderStats() {
//   const [stats, setStats] = useState({
//     todayOrders: 0,
//     todayDistance: 0,
//     weeklyOrders: 0,
//     weeklyDistance: 0
//   });
  
//   useEffect(() => {
//     // Load stats on component mount
//     const currentStats = OrderTrackingService.getStats();
//     setStats({
//       todayOrders: currentStats.todayOrders,
//       todayDistance: currentStats.todayDistance,
//       weeklyOrders: currentStats.weeklyOrders,
//       weeklyDistance: currentStats.weeklyDistance
//     });
//   }, []);
  
//   return (
//     <div className="relative w-full bg-gray-50">
//       {/* Stats boxes in a row like the example */}
//       <div className="w-full mt-6 mb-6">
//         <div className="flex flex-wrap">
//           {/* Today's Orders */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="bg-amber-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-amber-100 rounded-full mr-2">
//                   <PackageIcon className="h-5 w-5 text-amber-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Today's Orders</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.todayOrders}</p>
//             </div>
//           </motion.div>
          
//           {/* Today's Distance */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//           >
//             <div className="bg-blue-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-blue-100 rounded-full mr-2">
//                   <MapIcon className="h-5 w-5 text-blue-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Today's Distance</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.todayDistance.toFixed(1)} km</p>
//             </div>
//           </motion.div>
          
//           {/* Weekly Orders */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//           >
//             <div className="bg-green-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-green-100 rounded-full mr-2">
//                   <CalendarIcon className="h-5 w-5 text-green-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Weekly Orders</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.weeklyOrders}</p>
//             </div>
//           </motion.div>
          
//           {/* Weekly Distance */}
//           <motion.div 
//             className="w-1/2 lg:w-1/4 p-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//           >
//             <div className="bg-purple-50 rounded-lg p-4 h-full">
//               <div className="flex items-center mb-2">
//                 <div className="p-2 bg-purple-100 rounded-full mr-2">
//                   <TrendingUpIcon className="h-5 w-5 text-purple-500" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-600">Weekly Distance</p>
//               </div>
//               <p className="text-3xl font-bold text-gray-800">{stats.weeklyDistance.toFixed(1)} km</p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }
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
    // Load stats on component mount
    const currentStats = OrderTrackingService.getStats();
    setStats({
      todayOrders: currentStats.todayOrders,
      todayDistance: currentStats.todayDistance,
      weeklyOrders: currentStats.weeklyOrders,
      weeklyDistance: currentStats.weeklyDistance
    });
    
    // Set up interval to update stats periodically
    const intervalId = setInterval(() => {
      const updatedStats = OrderTrackingService.getStats();
      setStats(prevStats => {
        // Only update if values have changed
        if (JSON.stringify(prevStats) !== JSON.stringify(updatedStats)) {
          return { ...updatedStats };
        }
        return prevStats;
      });
    }, 30000); // Check for updates every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Animation variants for the value changes
  const valueVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="relative w-full bg-gray-50">
      {/* Stats boxes in a row like the example */}
      <div className="w-full mt-6 mb-6">
        <div className="flex flex-wrap">
          {/* Today's Orders */}
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
          
          {/* Today's Distance */}
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
          
          {/* Weekly Orders */}
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
          
          {/* Weekly Distance */}
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
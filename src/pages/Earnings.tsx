import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Calendar, BarChart2, DollarSign, MapPin, Clock, Award, Activity } from 'lucide-react';
import * as THREE from 'three';
import Loading from '../components/fod-order/general/Loading';

interface SummaryData {
  dailyTrips: Record<string, { tripCount: number; totalEarnings: number; totalDistance: number }>;
  monthlyTrips: Record<string, { tripCount: number; totalEarnings: number; totalDistance: number }>;
  weeklyData?: { tripCount: number; totalEarnings: number; totalDistance: number };
  totalOrders: number;
  totalEarnings: number;
  totalDistance: number;
}

interface DisplayData {
  tripCount: number;
  totalEarnings: number;
  totalDistance: number;
  title: string;
}

export default function Earnings() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [displayData, setDisplayData] = useState<DisplayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  // Load and manage 3D background effect
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!threeContainerRef.current) return;
      camera.aspect = threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeContainerRef.current) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drivermanager/api/order/summary/driver/1');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: SummaryData = await response.json();

        if (!data.weeklyData) {
          data.weeklyData = {
            tripCount: Math.round(data.totalOrders / 2),
            totalEarnings: Math.round(data.totalEarnings / 2),
            totalDistance: Math.round(data.totalDistance / 2),
          };
        }

        setSummaryData(data);
        setIsLoading(false);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update displayed data when timeframe changes
  useEffect(() => {
    if (!summaryData) return;

    let newDisplayData: DisplayData = {
      tripCount: 0,
      totalEarnings: 0,
      totalDistance: 0,
      title: '',
    };

    const now = new Date();
    const currentDay = now.getDate().toString();
    const currentMonth = (now.getMonth() + 1).toString();

    switch (selectedTimeframe) {
      case 'today':
        newDisplayData = {
          tripCount: summaryData.dailyTrips[currentDay]?.tripCount || 0,
          totalEarnings: summaryData.dailyTrips[currentDay]?.totalEarnings || 0,
          totalDistance: summaryData.dailyTrips[currentDay]?.totalDistance || 0,
          title: 'Today',
        };
        break;
      case 'week':
        newDisplayData = {
          tripCount: summaryData.weeklyData?.tripCount || 0,
          totalEarnings: summaryData.weeklyData?.totalEarnings || 0,
          totalDistance: summaryData.weeklyData?.totalDistance || 0,
          title: 'This Week',
        };
        break;
      case 'month':
        newDisplayData = {
          tripCount: summaryData.monthlyTrips[currentMonth]?.tripCount || 0,
          totalEarnings: summaryData.monthlyTrips[currentMonth]?.totalEarnings || 0,
          totalDistance: summaryData.monthlyTrips[currentMonth]?.totalDistance || 0,
          title: 'Monthly Summary',
        };
        break;
    }

    setDisplayData(newDisplayData);
  }, [selectedTimeframe, summaryData]);

  const timeframes = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ] as const;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDistance = (distance: number) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(distance);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const getChartData = () => {
    if (selectedTimeframe === 'today') {
      return [0.2, 0.4, 0.6, 0.8, 1.0, 0.7, 0.5];
    } else if (selectedTimeframe === 'week') {
      return [0.3, 0.5, 0.2, 1.0, 0.6, 0.4, 0.7];
    } else {
      return [0.2, 0.4, 0.6, 0.3, 0.8, 0.5, 1.0, 0.7, 0.9, 0.4];
    }
  };

  const getChartLabels = () => {
    if (selectedTimeframe === 'today') {
      return { start: 'Morning', end: 'Evening' };
    } else if (selectedTimeframe === 'week') {
      return { start: 'Mon', end: 'Sun' };
    } else {
      return {
        start: `${new Date().toLocaleString('default', { month: 'short' })} 1`,
        end: `${new Date().toLocaleString('default', { month: 'short' })} 30`,
      };
    }
  };

  const getPerformanceLevel = () => {
    if (!displayData) return <Loading/>;

    const avgEarningsPerTrip = displayData.totalEarnings / (displayData.tripCount || 1);

    if (avgEarningsPerTrip > 2500) return 'Excellent';
    if (avgEarningsPerTrip > 2000) return 'Good';
    if (avgEarningsPerTrip > 1500) return 'Average';
    return 'Needs Improvement';
  };

  const getEfficiency = () => {
    if (!displayData) return 0;
    return displayData.totalDistance ? (displayData.totalEarnings / displayData.totalDistance).toFixed(2) : 0;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div ref={threeContainerRef} className="absolute inset-0 pointer-events-none opacity-30" />
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Finance Dashboard</h1>
          <div className="text-sm bg-white bg-opacity-80 backdrop-blur-sm py-1 px-3 rounded-full text-gray-600 flex items-center gap-2 shadow-sm">
            <Calendar size={16} className="text-blue-500" />
            {getCurrentDate()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 shadow-xl overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-20" />
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-blue-100">Current Balance</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white bg-opacity-20 text-blue-50 py-1 px-2 rounded-full">
                {getPerformanceLevel()}
              </span>
              <BarChart2 size={20} className="text-blue-200" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {isLoading ? '...' : formatCurrency(displayData?.totalEarnings || 0)}{' '}
            <span className="text-lg text-blue-200">LKR</span>
          </div>
          <div className="inline-flex items-center text-blue-100 text-xs mt-1 bg-white bg-opacity-10 backdrop-blur-sm px-3 py-1 rounded-full">
            <TrendingUp size={14} className="mr-1" />
            <span>
              {selectedTimeframe === 'today'
                ? "Today's earnings"
                : selectedTimeframe === 'week'
                  ? 'Weekly earnings'
                  : 'Monthly earnings'}
            </span>
          </div>
        </div>
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-2 flex mb-6 shadow-sm">
          {timeframes.map((time) => (
            <button
              key={time.id}
              className={`flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium relative z-10 ${selectedTimeframe === time.id
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
                }`}
              onClick={() => setSelectedTimeframe(time.id)}
            >
              {selectedTimeframe === time.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg -z-10" />
              )}
              {time.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <DollarSign size={20} className="text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Net Earnings</h3>
            <div className="text-xl font-bold text-gray-800">
              {isLoading ? '...' : formatCurrency(displayData?.totalEarnings || 0)}{' '}
              <span className="text-sm text-gray-500">LKR</span>
            </div>
            <div className="text-xs text-green-500 mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1" />
              LKR {getEfficiency()} per km
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <Activity size={20} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Trip Statistics</h3>
            <div className="text-xl font-bold text-gray-800">
              {isLoading ? '...' : displayData?.tripCount || 0}{' '}
              <span className="text-sm text-gray-500">trips</span>
            </div>
            <div className="text-xs text-blue-500 mt-2 flex items-center">
              <MapPin size={12} className="mr-1" />
              {isLoading ? '...' : formatDistance(displayData?.totalDistance || 0)} km total
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Award size={18} className="text-indigo-500 mr-2" />
            Performance Analysis
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <MapPin size={18} className="text-indigo-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Distance</div>
                <div className="text-lg font-semibold">
                  {isLoading ? '...' : formatDistance(displayData?.totalDistance || 0)} km
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock size={18} className="text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Avg per Trip</div>
                <div className="text-lg font-semibold">
                  {isLoading
                    ? '...'
                    : formatCurrency((displayData?.totalEarnings || 0) / (displayData?.tripCount || 1))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Earnings Trend</div>
              <div className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded-full">
                {selectedTimeframe === 'today' ? 'Hourly' : selectedTimeframe === 'week' ? 'Daily' : 'Weekly'}
              </div>
            </div>
            <div className="flex items-end h-24 space-x-1 relative">
              <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between opacity-30">
                <div className="border-b border-dashed border-gray-200 h-0"></div>
                <div className="border-b border-dashed border-gray-200 h-0"></div>
                <div className="border-b border-dashed border-gray-200 h-0"></div>
              </div>
              {isLoading ? (
                Array(7)
                  .fill(0)
                  .map((_, index) => <div key={index} className="bg-gray-200 rounded-t w-full h-3" />)
              ) : (
                getChartData().map((height, index) => (
                  <div
                    key={index}
                    className={`rounded-t w-full ${height === 1 ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-blue-300 to-blue-400'
                      }`}
                    style={{
                      height: `${height * 100}%`,
                      transition: 'height 0.5s ease-in-out',
                      boxShadow: height === 1 ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)' : 'none',
                    }}
                  />
                ))
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{getChartLabels().start}</span>
              <span>{getChartLabels().end}</span>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
            <div className="text-lg font-medium">{displayData?.title || 'Summary'}</div>
            <div className="text-xs opacity-80">Financial performance metrics</div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="text-gray-600 flex items-center">
                <Activity size={16} className="text-blue-500 mr-2" />
                Completed Trips
              </span>
              <span className="font-medium bg-blue-50 py-1 px-3 rounded-full">
                {isLoading ? '...' : displayData?.tripCount || 0}
              </span>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="text-gray-600 flex items-center">
                <DollarSign size={16} className="text-green-500 mr-2" />
                Total Earnings
              </span>
              <span className="font-medium bg-green-50 py-1 px-3 rounded-full">
                {isLoading ? '...' : formatCurrency(displayData?.totalEarnings || 0)} LKR
              </span>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="text-gray-600 flex items-center">
                <MapPin size={16} className="text-indigo-500 mr-2" />
                Total Distance
              </span>
              <span className="font-medium bg-indigo-50 py-1 px-3 rounded-full">
                {isLoading ? '...' : formatDistance(displayData?.totalDistance || 0)} km
              </span>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="text-gray-600 flex items-center">
                <Award size={16} className="text-amber-500 mr-2" />
                Performance Rating
              </span>
              <span className="font-medium bg-amber-50 py-1 px-3 rounded-full">{getPerformanceLevel()}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 text-center">
            <span className="text-sm text-gray-500">Updated as of {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
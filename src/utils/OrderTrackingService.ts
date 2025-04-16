// utils/OrderTrackingService.ts
interface OrderStats {
    todayOrders: number;
    todayDistance: number;
    weeklyOrders: number;
    weeklyDistance: number;
    lastUpdated: string;
  }
  
  export class OrderTrackingService {
    private static STORAGE_KEY = 'driver_order_stats';
    
    static getStats(): OrderStats {
      const defaultStats: OrderStats = {
        todayOrders: 0,
        todayDistance: 0,
        weeklyOrders: 0,
        weeklyDistance: 0,
        lastUpdated: new Date().toISOString()
      };
      
      try {
        const storedStats = localStorage.getItem(this.STORAGE_KEY);
        if (!storedStats) return defaultStats;
        
        const parsedStats = JSON.parse(storedStats) as OrderStats;
        
        // Reset daily stats if it's a new day
        if (this.isNewDay(parsedStats.lastUpdated)) {
          parsedStats.todayOrders = 0;
          parsedStats.todayDistance = 0;
        }
        
        // Reset weekly stats if it's a new week
        if (this.isNewWeek(parsedStats.lastUpdated)) {
          parsedStats.weeklyOrders = 0;
          parsedStats.weeklyDistance = 0;
        }
        
        parsedStats.lastUpdated = new Date().toISOString();
        this.saveStats(parsedStats);
        
        return parsedStats;
      } catch (error) {
        console.error('Error reading order stats from storage:', error);
        return defaultStats;
      }
    }
    
    static saveStats(stats: OrderStats): void {
      try {
        stats.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
      } catch (error) {
        console.error('Error saving order stats to storage:', error);
      }
    }
    
    static recordCompletedOrder(distanceKm: number): OrderStats {
      const stats = this.getStats();
      
      stats.todayOrders += 1;
      stats.todayDistance += distanceKm;
      stats.weeklyOrders += 1;
      stats.weeklyDistance += distanceKm;
      
      this.saveStats(stats);
      return stats;
    }
    
    private static isNewDay(lastUpdatedStr: string): boolean {
      const lastUpdated = new Date(lastUpdatedStr);
      const today = new Date();
      
      return lastUpdated.getDate() !== today.getDate() || 
             lastUpdated.getMonth() !== today.getMonth() || 
             lastUpdated.getFullYear() !== today.getFullYear();
    }
    
    private static isNewWeek(lastUpdatedStr: string): boolean {
      const lastUpdated = new Date(lastUpdatedStr);
      const today = new Date();
      
      const getWeekNumber = (date: Date): number => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      };
      
      const lastWeek = getWeekNumber(lastUpdated);
      const thisWeek = getWeekNumber(today);
      
      return lastWeek !== thisWeek || lastUpdated.getFullYear() !== today.getFullYear();
    }
  }
// utils/OrderStore.ts
interface OrderEarnings {
    orderId: string;
    amount: number;
    date: string;
}

export class OrderStore {
    private static EARNINGS_KEY = 'driver_earnings';


    static addOrderEarnings(orderId: string, amount: number): void {
        try {
            const earnings = this.getEarnings();


            earnings.push({
                orderId,
                amount,
                date: new Date().toISOString()
            });


            localStorage.setItem(this.EARNINGS_KEY, JSON.stringify(earnings));
        } catch (error) {
            console.error('Error saving order earnings:', error);
        }
    }


    static getEarnings(): OrderEarnings[] {
        try {
            const stored = localStorage.getItem(this.EARNINGS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error retrieving earnings:', error);
            return [];
        }
    }


    static getTodayEarnings(): number {
        try {
            const earnings = this.getEarnings();
            const today = new Date().toISOString().split('T')[0];

            return earnings
                .filter(e => e.date.startsWith(today))
                .reduce((total, earning) => total + earning.amount, 0);
        } catch (error) {
            console.error('Error calculating today\'s earnings:', error);
            return 0;
        }
    }


    static getWeeklyEarnings(): number {
        try {
            const earnings = this.getEarnings();
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            return earnings
                .filter(e => new Date(e.date) >= startOfWeek)
                .reduce((total, earning) => total + earning.amount, 0);
        } catch (error) {
            console.error('Error calculating weekly earnings:', error);
            return 0;
        }
    }
    static clearEarnings(): void {
        localStorage.removeItem(this.EARNINGS_KEY);
    }
}
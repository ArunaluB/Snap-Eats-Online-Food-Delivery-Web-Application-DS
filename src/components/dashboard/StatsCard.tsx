import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBg?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBg = 'bg-blue-100'
}) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
            
            {change && (
              <div className="mt-1 flex items-center text-sm">
                {change.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={change.isPositive ? 'text-green-600' : 'text-red-600'}>
                  {change.value}
                </span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-lg ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
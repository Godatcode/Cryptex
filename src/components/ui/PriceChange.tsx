import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  timeframe?: string;
  showIcon?: boolean;
  showPercent?: boolean;
  className?: string;
}

const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  timeframe,
  showIcon = true,
  showPercent = true,
  className = '',
}) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-success-500' : 'text-error-500';
  const Icon = isPositive ? ArrowUpCircle : ArrowDownCircle;
  
  const formattedValue = Math.abs(value).toFixed(2);
  const timeframeText = timeframe ? ` ${timeframe}` : '';

  return (
    <div className={`flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon && <Icon className="h-4 w-4" />}
      <span>
        {isPositive ? '+' : '-'}
        {showPercent ? `${formattedValue}%` : formattedValue}
        {timeframeText}
      </span>
    </div>
  );
};

export default PriceChange;
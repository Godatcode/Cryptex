import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { MarketChartData } from '../../types/coins';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Loader } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CoinChartProps {
  marketData: MarketChartData | undefined;
  isLoading: boolean;
  error: Error | null;
  coinName: string;
  onTimeframeChange: (days: number | 'max') => void;
  currentPrice: number;
  priceChangePercentage: number;
}

type Timeframe = {
  label: string;
  value: number | 'max';
};

const CoinChart: React.FC<CoinChartProps> = ({
  marketData,
  isLoading,
  error,
  coinName,
  onTimeframeChange,
  currentPrice,
  priceChangePercentage
}) => {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<number | 'max'>(7);

  const timeframes: Timeframe[] = [
    { label: '24H', value: 1 },
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 },
    { label: 'All', value: 'max' }
  ];

  const handleTimeframeChange = (timeframe: number | 'max') => {
    setActiveTimeframe(timeframe);
    onTimeframeChange(timeframe);
  };

  // Get chart colors based on theme and price change
  const getChartColors = () => {
    const isPositiveChange = priceChangePercentage >= 0;
    
    if (theme === 'dark') {
      return {
        borderColor: isPositiveChange ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: isPositiveChange 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        pointBackgroundColor: isPositiveChange 
          ? 'rgba(16, 185, 129, 1)' 
          : 'rgba(239, 68, 68, 1)',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        textColor: 'rgba(255, 255, 255, 0.7)'
      };
    } else {
      return {
        borderColor: isPositiveChange ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: isPositiveChange 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        pointBackgroundColor: isPositiveChange 
          ? 'rgba(16, 185, 129, 1)' 
          : 'rgba(239, 68, 68, 1)',
        gridColor: 'rgba(0, 0, 0, 0.1)',
        textColor: 'rgba(0, 0, 0, 0.7)'
      };
    }
  };

  const chartColors = getChartColors();

  // Prepare chart data
  const prepareChartData = () => {
    if (!marketData || !marketData.prices || marketData.prices.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const priceData = marketData.prices;
    
    const labels = priceData.map(item => {
      const date = new Date(item[0]);
      
      // Format based on timeframe
      if (activeTimeframe === 1) {
        // For 24h, show time only
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (activeTimeframe <= 30) {
        // For 7d and 30d, show date with abbreviated month
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        // For longer timeframes, show month and year
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }
    });

    const prices = priceData.map(item => item[1]);

    return {
      labels,
      datasets: [
        {
          label: `${coinName} Price`,
          data: prices,
          borderColor: chartColors.borderColor,
          backgroundColor: chartColors.backgroundColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: chartColors.pointBackgroundColor,
          pointHoverBackgroundColor: chartColors.pointBackgroundColor,
          pointBorderColor: 'transparent',
          pointHoverBorderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          tension: 0.2,
          fill: true
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme === 'dark' ? '#fff' : '#111827',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#4b5563',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label;
          },
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          color: chartColors.textColor,
          font: {
            size: 10
          },
          maxTicksLimit: 8
        },
        border: {
          display: false
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: chartColors.gridColor,
          drawBorder: false,
        },
        ticks: {
          color: chartColors.textColor,
          font: {
            size: 11
          },
          callback: function(value: any) {
            return formatCurrency(value, 0);
          }
        },
        border: {
          display: false
        }
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 0.8,
        to: 0.2,
        loop: false
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
          <div className="flex space-x-2">
            {timeframes.map((_, index) => (
              <div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
            ))}
          </div>
        </div>
        <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Loader className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="text-center py-12">
          <p className="text-error-500 text-lg font-medium">Failed to load chart data</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please try again later or check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(currentPrice)}
          </div>
          <div className={`text-sm font-medium ${
            priceChangePercentage >= 0 
              ? 'text-success-500' 
              : 'text-error-500'
          }`}>
            {priceChangePercentage >= 0 ? '+' : ''}
            {priceChangePercentage.toFixed(2)}%
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value.toString()}
              onClick={() => handleTimeframeChange(timeframe.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeTimeframe === timeframe.value
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80 w-full">
        <Line data={prepareChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default CoinChart;
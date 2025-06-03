import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useWatchlist } from '../../context/WatchlistContext';
import { CoinData } from '../../types/coins';
import PriceChange from './PriceChange';
import SparklineChart from './SparklineChart';
import { formatCurrency } from '../../utils/formatters';

interface CoinCardProps {
  coin: CoinData;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(coin.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the coin details
    if (inWatchlist) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin.id);
    }
  };

  return (
    <Link 
      to={`/coins/${coin.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-gray-900/10 transition duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{coin.name}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</span>
            </div>
          </div>
          <button 
            onClick={handleWatchlistToggle}
            className={`p-1.5 rounded-full transition-colors ${
              inWatchlist 
              ? 'text-accent-500 bg-accent-50 dark:bg-accent-900/20' 
              : 'text-gray-400 hover:text-accent-500 dark:text-gray-500 dark:hover:text-accent-400'
            }`}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Star className="h-5 w-5" fill={inWatchlist ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.current_price)}
            </div>
            <PriceChange value={coin.price_change_percentage_24h} timeframe="24h" />
          </div>
          
          <div className="w-24 h-12">
            {coin.sparkline_in_7d?.price && (
              <SparklineChart 
                data={coin.sparkline_in_7d.price} 
                color={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
              />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="block">Market Cap</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(coin.market_cap, 0)}</span>
          </div>
          <div>
            <span className="block">24h Volume</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(coin.total_volume, 0)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
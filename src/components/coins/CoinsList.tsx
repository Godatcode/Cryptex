import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from 'react-query';
import { getTopCoins } from '../../api/coinGeckoApi';
import { CoinData } from '../../types/coins';
import CoinCard from '../ui/CoinCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Filter, ArrowUpDown } from 'lucide-react';

interface CoinsListProps {
  limit?: number;
}

const CoinsList: React.FC<CoinsListProps> = ({ limit }) => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'market_cap' | 'price' | 'change'>('market_cap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { data: coins, isLoading, isFetching, isError } = useQuery<CoinData[]>(
    ['coins', page],
    () => getTopCoins(page, 20),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const loadMoreCoins = () => {
    if (!isFetching && coins && (!limit || coins.length < limit)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Effect to load more coins when scrolling to the bottom
  React.useEffect(() => {
    if (inView) {
      loadMoreCoins();
    }
  }, [inView]);

  const sortCoins = (coinsToSort: CoinData[]) => {
    return [...coinsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sort) {
        case 'price':
          comparison = a.current_price - b.current_price;
          break;
        case 'change':
          comparison = a.price_change_percentage_24h - b.price_change_percentage_24h;
          break;
        case 'market_cap':
        default:
          comparison = a.market_cap - b.market_cap;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleSortChange = (newSort: 'market_cap' | 'price' | 'change') => {
    if (sort === newSort) {
      toggleSortDirection();
    } else {
      setSort(newSort);
      setSortDirection('desc');
    }
  };

  const displayCoins = coins ? sortCoins(coins).slice(0, limit) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-error-500 text-lg">Error loading cryptocurrency data.</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please try again later or check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sorting controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
        </div>
        
        <button
          onClick={() => handleSortChange('market_cap')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            sort === 'market_cap' 
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Market Cap
          {sort === 'market_cap' && (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </button>
        
        <button
          onClick={() => handleSortChange('price')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            sort === 'price' 
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Price
          {sort === 'price' && (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </button>
        
        <button
          onClick={() => handleSortChange('change')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            sort === 'change' 
              ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          24h Change
          {sort === 'change' && (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Coins grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayCoins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>

      {/* Load more indicator */}
      {!limit && (
        <div ref={ref} className="py-8 flex justify-center">
          {isFetching ? (
            <LoadingSpinner />
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {coins && coins.length >= 100 ? 'End of results' : 'Scroll for more'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinsList;
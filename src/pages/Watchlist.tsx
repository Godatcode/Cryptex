import React from 'react';
import { useQuery } from 'react-query';
import { useWatchlist } from '../context/WatchlistContext';
import { getWatchlistCoins } from '../api/coinGeckoApi';
import CoinCard from '../components/ui/CoinCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BookmarkX, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Watchlist: React.FC = () => {
  const { watchlist } = useWatchlist();
  
  const { data: watchlistCoins, isLoading, isError } = useQuery(
    ['watchlistCoins', watchlist],
    () => getWatchlistCoins(watchlist),
    {
      enabled: watchlist.length > 0,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }
  );

  const EmptyWatchlist = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <BookmarkX className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Your watchlist is empty
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Add cryptocurrencies to your watchlist to track their prices and stay updated on their performance.
      </p>
      <Link to="/">
        <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
          Explore Coins
        </Button>
      </Link>
    </div>
  );

  if (watchlist.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <EmptyWatchlist />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isError || !watchlistCoins) {
    return (
      <div className="text-center py-12">
        <p className="text-error-500 text-lg">Error loading watchlist.</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Please try again later or check your internet connection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Star className="h-6 w-6 text-accent-500 mr-2" />
          My Watchlist
          <span className="ml-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
            {watchlistCoins.length}
          </span>
        </h1>
      </div>

      {watchlistCoins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {watchlistCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      ) : (
        <EmptyWatchlist />
      )}
    </div>
  );
};

export default Watchlist;
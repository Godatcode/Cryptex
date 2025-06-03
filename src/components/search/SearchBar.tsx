import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchCoins } from '../../api/coinGeckoApi';
import { CoinData } from '../../types/coins';
import { formatCurrency } from '../../utils/formatters';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Set focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query search results
  const { data: searchResults, isLoading } = useQuery<CoinData[]>(
    ['search', debouncedTerm],
    () => searchCoins(debouncedTerm),
    {
      enabled: debouncedTerm.length > 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const handleCoinSelect = (coinId: string) => {
    navigate(`/coins/${coinId}`);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex items-center border-b border-gray-300 dark:border-gray-700 pb-2">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coins..."
            className="w-full ml-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Search results */}
        {debouncedTerm.length > 1 && (
          <div className="mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="h-6 w-6 text-primary-500 animate-spin" />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => handleCoinSelect(coin.id)}
                    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                  >
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div className="ml-3 flex-grow">
                      <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </div>
                      <div className={`text-xs ${
                        coin.price_change_percentage_24h >= 0 
                          ? 'text-success-500' 
                          : 'text-error-500'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                No results found for "{debouncedTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
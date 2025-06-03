import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  getCoinDetails, 
  getCoinMarketChart 
} from '../api/coinGeckoApi';
import CoinChart from '../components/coins/CoinChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { useWatchlist } from '../context/WatchlistContext';
import { 
  Star, 
  ArrowLeft, 
  ExternalLink, 
  Globe, 
  Github, 
  Twitter, 
  MessageCircle, 
  Info,
  TrendingUp,
  BarChart3,
  CreditCard,
  Hash,
  Database
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import DOMPurify from 'dompurify';

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<number | 'max'>(7);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  
  const coinId = id || '';
  const inWatchlist = isInWatchlist(coinId);

  // Fetch coin details
  const { 
    data: coinDetails, 
    isLoading: isLoadingDetails, 
    error: detailsError 
  } = useQuery(
    ['coinDetails', coinId],
    () => getCoinDetails(coinId),
    {
      enabled: !!coinId,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }
  );

  // Fetch market chart data
  const {
    data: marketChartData,
    isLoading: isLoadingChart,
    error: chartError,
    refetch: refetchChart
  } = useQuery(
    ['coinMarketChart', coinId, timeframe],
    () => getCoinMarketChart(coinId, timeframe),
    {
      enabled: !!coinId,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }
  );

  const handleTimeframeChange = (newTimeframe: number | 'max') => {
    setTimeframe(newTimeframe);
    refetchChart();
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  const sanitizeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  if (isLoadingDetails) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (detailsError || !coinDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-error-500 text-lg">Error loading coin details.</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
          Please try again later or check your internet connection.
        </p>
        <Button onClick={() => navigate('/')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to Market
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleWatchlistToggle}
            leftIcon={<Star className="h-4 w-4\" fill={inWatchlist ? 'currentColor' : 'none'} />}
            className={inWatchlist ? 'text-accent-500' : ''}
          >
            {inWatchlist ? 'Watchlisted' : 'Add to Watchlist'}
          </Button>
          
          {coinDetails.links.homepage[0] && (
            <Button
              as="a"
              href={coinDetails.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              rightIcon={<ExternalLink className="h-4 w-4" />}
            >
              Website
            </Button>
          )}
        </div>
      </div>
      
      {/* Coin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <img
          src={coinDetails.image.large}
          alt={coinDetails.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
        />
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {coinDetails.name}
            </h1>
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400 uppercase">
              {coinDetails.symbol}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
              Rank #{coinDetails.market_cap_rank}
            </div>
            
            {coinDetails.categories && coinDetails.categories[0] && (
              <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {coinDetails.categories[0]}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Price Chart */}
      <CoinChart 
        marketData={marketChartData}
        isLoading={isLoadingChart}
        error={chartError as Error | null}
        coinName={coinDetails.name}
        onTimeframeChange={handleTimeframeChange}
        currentPrice={coinDetails.market_data.current_price.usd}
        priceChangePercentage={coinDetails.market_data.price_change_percentage_24h}
      />
      
      {/* Market Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary-500" />
            Market Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coinDetails.market_data.market_cap.usd, 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">24h Trading Volume</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coinDetails.market_data.total_volume.usd, 0)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fully Diluted Valuation</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {coinDetails.market_data.fully_diluted_valuation?.usd
                    ? formatCurrency(coinDetails.market_data.fully_diluted_valuation.usd, 0)
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap Change 24h</p>
                <p className={`font-medium ${
                  coinDetails.market_data.market_cap_change_percentage_24h >= 0
                    ? 'text-success-500'
                    : 'text-error-500'
                }`}>
                  {formatPercent(coinDetails.market_data.market_cap_change_percentage_24h)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">All-Time High</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coinDetails.market_data.ath.usd)}
                </p>
                <p className="text-xs text-error-500">
                  {formatPercent(coinDetails.market_data.ath_change_percentage.usd)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">All-Time Low</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(coinDetails.market_data.atl.usd, 6)}
                </p>
                <p className="text-xs text-success-500">
                  {formatPercent(coinDetails.market_data.atl_change_percentage.usd)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Supply Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary-500" />
            Supply Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {formatNumber(coinDetails.market_data.circulating_supply, 0)}
                </p>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${coinDetails.market_data.max_supply 
                      ? (coinDetails.market_data.circulating_supply / coinDetails.market_data.max_supply) * 100 
                      : 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {coinDetails.market_data.total_supply
                    ? formatNumber(coinDetails.market_data.total_supply, 0)
                    : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Max Supply</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {coinDetails.market_data.max_supply
                    ? formatNumber(coinDetails.market_data.max_supply, 0)
                    : 'N/A'}
                </p>
              </div>
            </div>
            
            {coinDetails.hashing_algorithm && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Hashing Algorithm</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {coinDetails.hashing_algorithm}
                </p>
              </div>
            )}
            
            {coinDetails.block_time_in_minutes > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Block Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {coinDetails.block_time_in_minutes} minutes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Description */}
      {coinDetails.description.en && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary-500" />
            About {coinDetails.name}
          </h2>
          
          <div 
            className="prose prose-sm max-w-none dark:prose-invert prose-a:text-primary-600 dark:prose-a:text-primary-400"
            dangerouslySetInnerHTML={sanitizeHTML(coinDetails.description.en)}
          />
        </div>
      )}
      
      {/* Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Links & Resources
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coinDetails.links.homepage[0] && (
            <a
              href={coinDetails.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Globe className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-800 dark:text-gray-200">Website</span>
            </a>
          )}
          
          {coinDetails.links.repos_url.github[0] && (
            <a
              href={coinDetails.links.repos_url.github[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Github className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-800 dark:text-gray-200">GitHub</span>
            </a>
          )}
          
          {coinDetails.links.twitter_screen_name && (
            <a
              href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Twitter className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-800 dark:text-gray-200">Twitter</span>
            </a>
          )}
          
          {coinDetails.links.subreddit_url && (
            <a
              href={coinDetails.links.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-gray-800 dark:text-gray-200">Reddit</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
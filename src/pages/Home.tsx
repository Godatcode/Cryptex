import React, { useState } from 'react';
import CoinsList from '../components/coins/CoinsList';
import { LineChart, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'trending'>('market');
  
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl p-8 mb-8 shadow-md">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Track Cryptocurrencies in Real-Time
          </h1>
          <p className="text-white/90 text-lg mb-6">
            Get comprehensive data on thousands of cryptocurrencies, including prices,
            market caps, volume, and more. Create your personalized watchlist to track your favorite coins.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#coins-list" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors duration-300"
            >
              Explore Market
            </a>
            <a 
              href="/watchlist" 
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              View Watchlist
            </a>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'market'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            <LineChart className="h-5 w-5" />
            Market Overview
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'trending'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            Trending
          </button>
        </div>
        
        <div id="coins-list" className="p-4 md:p-6">
          <CoinsList limit={activeTab === 'trending' ? 12 : undefined} />
        </div>
      </div>
    </div>
  );
};

export default Home;
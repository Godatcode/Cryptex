import axios from 'axios';
import { CoinData, CoinDetailData, MarketChartData } from '../types/coins';

const API_URL = 'https://api.coingecko.com/api/v3';

// Rate limiting helper
const rateLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.warn('Rate limit reached, retrying after 60 seconds');
      await new Promise(resolve => setTimeout(resolve, 60000));
      return rateLimit(fn);
    }
    throw error;
  }
};

export const getTopCoins = async (page = 1, perPage = 20, currency = 'usd'): Promise<CoinData[]> => {
  return rateLimit(async () => {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '24h,7d,30d',
      },
    });
    return response.data;
  });
};

export const getCoinDetails = async (id: string): Promise<CoinDetailData> => {
  return rateLimit(async () => {
    const response = await axios.get(`${API_URL}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  });
};

export const getCoinMarketChart = async (
  id: string,
  days: number | 'max' = 7,
  currency = 'usd'
): Promise<MarketChartData> => {
  return rateLimit(async () => {
    const response = await axios.get(`${API_URL}/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
      },
    });
    return response.data;
  });
};

export const searchCoins = async (query: string): Promise<CoinData[]> => {
  return rateLimit(async () => {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        query,
      },
    });
    
    // We need to fetch full data for the search results
    const coins = response.data.coins;
    if (!coins || coins.length === 0) return [];
    
    const coinIds = coins.slice(0, 10).map((coin: any) => coin.id).join(',');
    if (!coinIds) return [];
    
    const coinsData = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinIds,
        order: 'market_cap_desc',
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return coinsData.data;
  });
};

export const getWatchlistCoins = async (coinIds: string[]): Promise<CoinData[]> => {
  if (coinIds.length === 0) return [];
  
  return rateLimit(async () => {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  });
};
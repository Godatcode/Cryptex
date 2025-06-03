import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useTheme } from './context/ThemeContext';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const CoinDetails = lazy(() => import('./pages/CoinDetails'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <Layout>
        <Suspense fallback={<div className="flex justify-center items-center min-h-[80vh]"><LoadingSpinner size="large" /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coins/:id" element={<CoinDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
};

export default App;
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { WatchlistProvider } from '../../context/WatchlistContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <WatchlistProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </WatchlistProvider>
  );
};

export default Layout;
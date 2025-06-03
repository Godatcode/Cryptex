import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
        <svg
          className="w-24 h-24 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Page Not Found
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          as={Link}
          to="/"
          leftIcon={<Home className="h-5 w-5" />}
        >
          Go Home
        </Button>
        
        <Button
          as="button"
          onClick={() => window.history.back()}
          variant="outline"
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
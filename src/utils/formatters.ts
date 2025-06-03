import { format } from 'date-fns';

/**
 * Format a number as currency
 */
export const formatCurrency = (
  value: number, 
  maximumFractionDigits = 2, 
  currency = 'USD'
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  // For large numbers, use fewer decimal places
  const adjustedMaxDigits = value > 1000 ? Math.min(maximumFractionDigits, 0) : 
                           value > 1 ? Math.min(maximumFractionDigits, 2) : 
                           value > 0.01 ? 4 : 6;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: adjustedMaxDigits,
    notation: value >= 1000000 ? 'compact' : 'standard',
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Format a large number with appropriate suffixes (K, M, B, T)
 */
export const formatNumber = (value: number, maximumFractionDigits = 2): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits,
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Format a percentage
 */
export const formatPercent = (value: number, maximumFractionDigits = 2): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(maximumFractionDigits)}%`;
};

/**
 * Format a date
 */
export const formatDate = (timestamp: string | number | Date): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return format(date, 'MMM d, yyyy');
};

/**
 * Format a time
 */
export const formatTime = (timestamp: string | number | Date): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return format(date, 'h:mm a');
};

/**
 * Format a date and time
 */
export const formatDateTime = (timestamp: string | number | Date): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return format(date, 'MMM d, yyyy h:mm a');
};
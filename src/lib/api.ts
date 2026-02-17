/**
 * Get the API base URL for fetch requests
 * - Development: Uses Vite proxy (empty string)
 * - Production: Uses VITE_API_URL environment variable
 */
export const getApiUrl = (): string => {
  // In development, Vite proxy handles /api requests
  // In production (Vercel), use the backend URL from environment
  if (import.meta.env.MODE === 'development') {
    return '';
  }
  
  const backendUrl = import.meta.env.VITE_API_URL || '';
  if (!backendUrl && import.meta.env.PROD) {
    console.warn('VITE_API_URL is not set in production. API calls may fail.');
  }
  return backendUrl;
};

/**
 * Make an API request with proper URL handling
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${getApiUrl()}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response;
};

/**
 * Get the API base URL for fetch requests
 * - Development: Uses Vite proxy (empty string)
 * - Production on Vercel: Uses empty string (same domain via /api/* serverless functions)
 * - Production on other hosts: Uses VITE_API_URL environment variable
 */
export const getApiUrl = (): string => {
  // In development, Vite proxy handles /api requests
  if (import.meta.env.MODE === 'development') {
    return '';
  }
  
  // In production with Vercel serverless functions, both frontend and backend
  // are served from the same domain, so use empty string
  const backendUrl = import.meta.env.VITE_API_URL || '';
  
  if (!backendUrl && import.meta.env.PROD) {
    console.log('Using same-domain API (Vercel serverless functions)');
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

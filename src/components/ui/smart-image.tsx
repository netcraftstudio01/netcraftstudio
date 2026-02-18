import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Smart Image component that handles both base64 and Cloudinary URLs
 * Automatically detects the format and renders appropriately
 */
export const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/img/placeholder.jpg" 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isBase64 = src && src.startsWith('data:');
  const isCloudinaryUrl = src && src.includes('cloudinary.com');
  const isLocalStorage = src && src.startsWith('storage:');

  const handleLoad = () => setLoading(false);
  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  // Handle different image sources
  let imageSrc = src;
  
  if (isLocalStorage) {
    // For legacy localStorage references, show placeholder
    imageSrc = fallbackSrc;
  } else if (!isBase64 && !isCloudinaryUrl && src) {
    // For relative URLs, keep as is
    imageSrc = src;
  }

  // If no valid image source, show error state
  if (!imageSrc) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">📷 No image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <Skeleton className={`absolute inset-0 rounded-lg ${className}`} />
      )}
      
      {error ? (
        <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-gray-400 text-sm">📷 Image unavailable</span>
        </div>
      ) : (
        <img 
          src={imageSrc}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default SmartImage;
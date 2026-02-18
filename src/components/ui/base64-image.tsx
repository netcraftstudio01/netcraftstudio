import { useState, useCallback, memo, ImgHTMLAttributes } from 'react';

interface Base64ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Base64 encoded image data (with or without data URI prefix) */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional fallback image URL */
  fallback?: string;
  /** CSS class for the loading skeleton */
  skeletonClass?: string;
  /** Whether to lazy load the image */
  lazy?: boolean;
}

/**
 * Optimized Base64 image component
 * - Handles both raw base64 and data URI formats
 * - Shows skeleton during load
 * - Graceful error handling with fallback
 * - Native lazy loading support
 */
const Base64Image = memo(({
  src,
  alt,
  fallback = '/placeholder.svg',
  skeletonClass = 'bg-muted animate-pulse',
  lazy = true,
  className = '',
  ...props
}: Base64ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize base64 source - add data URI prefix if missing
  const normalizedSrc = useCallback(() => {
    if (!src) return fallback;
    
    // Already has data URI prefix
    if (src.startsWith('data:')) return src;
    
    // URL (http/https or relative path)
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('./')) {
      return src;
    }
    
    // Raw base64 - detect format from magic bytes
    const base64Data = src.trim();
    
    // PNG magic bytes (iVBORw0KGgo)
    if (base64Data.startsWith('iVBORw0KGgo')) {
      return `data:image/png;base64,${base64Data}`;
    }
    
    // JPEG magic bytes (/9j/)
    if (base64Data.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${base64Data}`;
    }
    
    // GIF magic bytes (R0lGOD)
    if (base64Data.startsWith('R0lGOD')) {
      return `data:image/gif;base64,${base64Data}`;
    }
    
    // WebP magic bytes (UklGR)
    if (base64Data.startsWith('UklGR')) {
      return `data:image/webp;base64,${base64Data}`;
    }
    
    // SVG (PHN2Zz or PD94bWw for <?xml)
    if (base64Data.startsWith('PHN2Zz') || base64Data.startsWith('PD94bWw')) {
      return `data:image/svg+xml;base64,${base64Data}`;
    }
    
    // Default to JPEG (most common)
    return `data:image/jpeg;base64,${base64Data}`;
  }, [src, fallback]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const imageSrc = hasError ? fallback : normalizedSrc();

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className={`absolute inset-0 ${skeletonClass}`} />
      )}
      
      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

Base64Image.displayName = 'Base64Image';

export { Base64Image };
export default Base64Image;
export type { Base64ImageProps };

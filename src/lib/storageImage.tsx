interface Base64ImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

/**
 * Component to display base64 encoded images
 * Use directly with base64 data URIs from database
 */
export const Base64Image = ({ src, alt, className = '', fallback = '' }: Base64ImageProps) => {
  if (!src) {
    return fallback ? <img src={fallback} alt={alt} className={className} /> : null;
  }

  return <img src={src} alt={alt} className={className} />;
};

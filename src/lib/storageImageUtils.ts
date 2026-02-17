/**
 * Check if a string is a valid base64 data URI
 * @param str - String to check
 * @returns true if string is a base64 data URI
 */
export const isBase64DataURI = (str: string): boolean => {
  if (!str) return false;
  return str.startsWith('data:') && str.includes('base64');
};

/**
 * Get image source - handles both base64 data URIs and regular URLs
 * @param imageSource - Base64 data URI or URL
 * @returns The image source ready to use in img tag
 */
export const getImageSource = (imageSource: string): string | null => {
  if (!imageSource) return null;
  // Return as-is since it should be ready to use (either base64 or URL)
  return imageSource;
};

/**
 * Convert a file or URL to base64 data URI
 * @param fileOrUrl - File object or URL string
 * @returns Promise of base64 data URI
 */
export const convertToBase64 = (fileOrUrl: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof fileOrUrl === 'string') {
      // If it's already a base64 URI, return it as-is
      if (isBase64DataURI(fileOrUrl)) {
        resolve(fileOrUrl);
        return;
      }

      // If it's a URL, fetch and convert to base64
      fetch(fileOrUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    } else {
      // It's a File object
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    }
  });
};

/**
 * Batch convert multiple images to base64
 * @param images - Array of files or URLs or mixed
 * @returns Promise of array of base64 data URIs
 */
export const convertImagesToBase64 = async (images: (File | string)[]): Promise<string[]> => {
  return Promise.all(images.map(img => convertToBase64(img)));
};

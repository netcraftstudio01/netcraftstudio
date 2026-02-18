import { useState } from 'react';

interface StoredImage {
  id: string;
  name: string;
  data: string;
  folder: string;
  uploadDate: string;
  size: number;
}

export const useLocalStorageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Get all stored images from localStorage
  const getStoredImages = (): StoredImage[] => {
    try {
      const stored = localStorage.getItem('netcraft-images');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored images:', error);
      return [];
    }
  };

  // Store image in localStorage and return the storage key
  const storeImage = (imageData: string, folder: string, customName: string): string => {
    const images = getStoredImages();
    const imageId = `${folder}/${customName}_${Date.now()}`;
    
    const newImage: StoredImage = {
      id: imageId,
      name: customName,
      data: imageData,
      folder,
      uploadDate: new Date().toISOString(),
      size: imageData.length
    };

    images.push(newImage);
    
    try {
      localStorage.setItem('netcraft-images', JSON.stringify(images));
      return imageData; // Return the base64 data for immediate use
    } catch (error) {
      console.error('Error storing image:', error);
      throw new Error('Failed to store image in localStorage');
    }
  };

  // Get image data by ID
  const getImage = (imageId: string): string | null => {
    const images = getStoredImages();
    const image = images.find(img => img.id === imageId);
    return image ? image.data : null;
  };

  // Delete image from localStorage
  const deleteImage = (imageId: string): boolean => {
    try {
      const images = getStoredImages();
      const filteredImages = images.filter(img => img.id !== imageId);
      localStorage.setItem('netcraft-images', JSON.stringify(filteredImages));
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  };

  // Upload and store image
  const uploadImage = async (file: File, folder: string = 'local-storage', customName?: string): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadError(null);

      // Validate file size (max 5MB to prevent localStorage issues)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const base64String = reader.result as string;
            
            // Use custom name or filename without extension
            const fileName = customName || file.name.replace(/\.[^/.]+$/, "");
            
            // Store in localStorage and return the base64 data
            const storedData = storeImage(base64String, folder, fileName);
            
            setUploading(false);
            resolve(storedData);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setUploadError(errorMessage);
            setUploading(false);
            reject(null);
          }
        };
        reader.onerror = () => {
          setUploadError('Failed to read file');
          setUploading(false);
          reject(null);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadError(errorMessage);
      setUploading(false);
      return null;
    }
  };

  // Get storage statistics
  const getStorageStats = () => {
    const images = getStoredImages();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    return {
      count: images.length,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
    };
  };

  return { 
    uploadImage, 
    uploading, 
    uploadError,
    getStoredImages,
    getImage,
    deleteImage,
    getStorageStats
  };
};

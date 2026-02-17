import { useState } from 'react';

export const useLocalStorageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder: string = 'local-storage', customName?: string): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadError(null);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const base64String = reader.result as string;
            
            // Use custom name or filename without extension
            const fileName = customName || file.name.replace(/\.[^/.]+$/, "");
            
            // Return the base64 data URI directly as the value
            setUploading(false);
            resolve(base64String);
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

  return { uploadImage, uploading, uploadError };
};

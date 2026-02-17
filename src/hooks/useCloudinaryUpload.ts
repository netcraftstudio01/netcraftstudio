import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, folder: string = 'netcraft-studio', customName?: string): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadError(null);

      // Convert file to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64String = reader.result as string;
            
            // Use custom name or filename without extension
            const fileName = customName || file.name.replace(/\.[^/.]+$/, "");

            // Upload to Cloudinary via your backend (proxy handles routing)
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/upload`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                file: base64String,
                folder: folder,
                publicId: fileName,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setUploading(false);
            resolve(data.url);
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

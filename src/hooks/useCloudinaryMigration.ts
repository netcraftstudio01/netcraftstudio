import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { useState } from 'react';

export const useCloudinaryMigration = () => {
  const { uploadImage } = useCloudinaryUpload();
  const [migrating, setMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const migrateBase64ToCloudinary = async (
    base64Data: string, 
    folder: string = 'netcraft-studio', 
    customName?: string
  ): Promise<string | null> => {
    try {
      setMigrating(true);
      setMigrationError(null);

      // Convert base64 string to File object
      const byteCharacters = atob(base64Data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Determine file type from base64 string
      const mimeType = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const extension = mimeType.split('/')[1];
      
      const file = new File([byteArray], `${customName || 'migrated'}.${extension}`, {
        type: mimeType
      });

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadImage(file, folder, customName);
      setMigrating(false);
      
      return cloudinaryUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Migration failed';
      setMigrationError(errorMessage);
      setMigrating(false);
      return null;
    }
  };

  const isBase64DataURI = (str: string): boolean => {
    return typeof str === 'string' && str.startsWith('data:image/');
  };

  return {
    migrateBase64ToCloudinary,
    isBase64DataURI,
    migrating,
    migrationError
  };
};
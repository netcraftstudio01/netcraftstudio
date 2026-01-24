import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import HomePage from '@/components/HomePage';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      {!isLoading && <HomePage />}
    </>
  );
};

export default Index;

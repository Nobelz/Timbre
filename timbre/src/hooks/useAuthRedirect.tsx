import { useEffect, useState } from 'react';

export default function useAuthRedirect (isAuthenticated) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== true) {
      setIsLoading(false);

    }
  }, [isAuthenticated, isLoading]);

  return isLoading;
};
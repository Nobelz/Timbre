import { useState, useEffect } from 'react';

export default function useAuthentication() {
  const [access_token, setAccessToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  return {
    access_token,
    isAuthenticated,
    setAccessToken,
    setIsAuthenticated,
  };
}

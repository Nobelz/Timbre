import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthRedirect = ({ isLoading, isAuth, setIsAuthenticated, setAccessToken, children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      // TODO: This is not needed for now, just for reference
      /*
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('token_type');
      localStorage.removeItem('scope');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userProfile');
      setIsAuthenticated(false);
      setAccessToken(null);
      */
      router.push('/'); // Redirect to login page if not authenticated
      // clear the local storage
      console.log("Logged out");

    }
  }, [isAuth]);

  return <>{children}</>;
};

export default AuthRedirect;

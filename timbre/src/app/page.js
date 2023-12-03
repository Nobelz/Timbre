"use client";

import Head from 'next/head'
import { authorize } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Navigation from '../components/Navigation';
import useAuthentication from '../hooks/useAccessToken';
import useAuthRedirect from '../hooks/useAuthRedirect';
import useUserProfile from '../hooks/useUserProfile';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* 
 The landing page of the application where users will have to sign in to their Spotify account.
 */
export default function Login() {
  const { access_token, isAuthenticated, setAccessToken, setIsAuthenticated } = useAuthentication();

  const userProfile = useUserProfile(access_token);

  const isLoading = useAuthRedirect(isAuthenticated);

  const router = useRouter();

  useEffect (() => {
    if (isAuthenticated && !isLoading) {
      router.push('/homepage');
    }
  }, [isAuthenticated]);
  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navigation isAuthenticated={false} authorizeApp={authorize} />
    </div>
  )
}
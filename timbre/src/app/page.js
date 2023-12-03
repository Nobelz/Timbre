"use client";

import Head from 'next/head'
import { authorize } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navigation from '../components/Navigation';
import useAuthentication from '../hooks/useAccessToken';
import useAuthRedirect from '../hooks/useAuthRedirect';
import useUserProfile from '../hooks/useUserProfile';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col } from 'react-bootstrap';
import Image from 'next/image';

/* 
 The landing page of the application where users will have to sign in to their Spotify account.
 */
export default function Login() {
  const { access_token, isAuthenticated, setAccessToken, setIsAuthenticated } = useAuthentication();

  const userProfile = useUserProfile(access_token);

  const isLoading = useAuthRedirect(isAuthenticated);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/homepage');
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container className="d-flex vh-100 justify-content-center align-items-center">
        <Row>
          <Col md={6} className="text-center">
            <Image src="/logo.png" width={500} height={500} style={{ borderRadius: '20px' }} />
          </Col>
          <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
            <div>
              <h1>Welcome to Timbre</h1>
              <p className="lead mb-4">
                Connect with fellow music lovers, discover new tracks, and share your favorite tunes.
                Join Timbre, where music brings us together.
              </p>

              <Button variant="success" size="lg" onClick={authorize} style={{ backgroundColor: "#1DB954", color: "black" }}>Sign in with Spotify</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
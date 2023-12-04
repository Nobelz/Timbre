// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshSpotifyToken, authorize } from "../app/api/auth/authorize";

// profilePage is false by default
// profilePage is true when the user is on the profile page

const Navigation = ({ isAuthenticated, setIsAuthenticated, setAccessToken, accessToken }) => {
  
  const [spotifyID, setSpotifyID] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const [refreshToken, setRefreshToken] = useState('');

  const getInitials = (name) => {
    // if name, then first character, else empty string
    return name &&
      name.length > 0 &&
      name[0].toUpperCase() &&
      name.split(' ').map(part => part[0].toUpperCase()).join('');
  };

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('scope');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('spotify_id');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setAccessToken(null);
    console.log("Logged out");
  }

  const [userProfile, setUserProfile] = React.useState(null);

  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };
  
  const fetchUserProfile = async () => {
    // Fetch user profile using Spotify ID
    try {
      let data = {
        command: 'GET_USER_PROFILE',
        spotify_id: spotifyID,
      };

      const response = await fetch('../api/endpoint', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
      });

      const res = await response.json();
      
      setUserProfile(res.data.rows[0]);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchRefreshToken = async () => {
    try {
      let response = await refreshSpotifyToken(refreshToken);
      if (response.error) {
        await authorize();
      }
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem('expires_in', (response.expires_in * 1000 + Date.now()).toString());
      setRefreshToken(response.refresh_token);
      setAccessToken(response.access_token);
      setExpiresIn(response.expires_in * 1000 + Date.now());
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  useEffect(() => {
    if (!refreshToken) {
      setRefreshToken(localStorage.getItem('refresh_token') || '');
      return;
    }
    if (!expiresIn) {
      setExpiresIn(parseInt(localStorage.getItem('expires_in') || '0'));
      return;
    }
    if (!spotifyID) {
      setSpotifyID(localStorage.getItem('spotify_id') || '');
      return;
    }
    if (expiresIn && spotifyID && refreshToken && accessToken) {
      fetchUserProfile();
    }
  }, [accessToken, refreshToken, spotifyID, expiresIn]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) {
      return;
    }

    if (Date.now() + 600 * 1000 > expiresIn) { // Check refresh upon loading of page
      console.log('Refreshing token');
      fetchRefreshToken();
    }

    const interval = setInterval(() => {
      if (Date.now() + 600 * 1000 > expiresIn) { // Check refresh every 9 minutes
        console.log('Refreshing token');
        fetchRefreshToken();
      }
    }, 540 * 1000); // Check every 9 minutes
  
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn])

  return (
    <Navbar bg="dark" variant="dark" style={{ fontFamily: 'Lexend, sans-serif', height: '60px'}}>
      <Container fluid>
        <Navbar.Brand href="/homepage">
          Timbre
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/matches">Matches</Nav.Link>
          <Nav.Link href="/friends">Friends</Nav.Link>
        </Nav>

        {isAuthenticated && userProfile && (
          <Nav style={{padding: '5px'}}>
            {userProfile['pic_link'] ? (
              <img src={userProfile['pic_link']} alt="Profile" style={{ borderRadius: '50%', width: '40px' }} />
            ) : (
              // make it white so it's visible on the dark navbar
              <div style={{ backgroundColor: 'white', borderRadius: '50%', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', fontSize: '20px' }}>
                {getInitials(userProfile['display_name'])}</div>
            )}
          </Nav>
      )}
      <Dropdown align="end">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Account
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleNavigation('/profile')}>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={logout}>
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Container>
  </Navbar>
);
};

export default Navigation;
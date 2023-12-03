// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Link from 'next/link';
import { authorize, getToken } from "../api/auth/authorize";
import { useEffect, useState } from 'react';



// profilePage is false by default
// profilePage is true when the user is on the profile page

const Navigation = ({ isAuthenticated, setIsAuthenticated, setAccessToken, authorizeApp, accessToken }) => {

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
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
    setAccessToken(null);
    console.log("Logged out");
  }

  const [userProfile, setUserProfile] = React.useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accessToken) {
        // Fetch user profile using the access_token
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  


return (
  <Navbar bg="dark" variant="dark">
    <Container fluid>
      <Navbar.Brand href="/homepage">
        Timbre
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/matches">Matches</Nav.Link>
        <Nav.Link href="/friends">Friends</Nav.Link>
      </Nav>

      {isAuthenticated && userProfile && (
        <Nav>
          {userProfile?.images?.length > 0 ? (
            <img src={userProfile.images[0].url} alt="Profile" style={{ borderRadius: '50%', width: '40px' }} />
          ) : (
            // make it white so it's visible on the dark navbar
            <div style={{ backgroundColor: 'white', borderRadius: '50%', width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', fontSize: '20px' }}>
              {getInitials(userProfile.display_name)}</div>
          )}
        </Nav>

      )}
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Account
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/profile"><Link href="/profile"><Button>My Profile</Button></Link></Dropdown.Item>
          {/* Log out button */}
          <Dropdown.Item><Button onClick={logout}>Log Out</Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  </Navbar>
);
};

export default Navigation;
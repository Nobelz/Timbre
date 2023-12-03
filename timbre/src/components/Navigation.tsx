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
import { useRouter } from 'next/navigation';



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

  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };
  

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
            {//userProfile?.images?.length > 0 &&
              <img 
                src="https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3dhdGVyLXVwZGF0ZS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjgyOH0sInRvRm9ybWF0IjoiYXZpZiJ9fQ==" 
                alt="Profile" 
                style={{ 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  objectFit: 'cover', // ensures the image covers the area without distortion
                  objectPosition: 'center' // ensures the image is centered
                }} 
              />
              }
              <div style={{
                backgroundColor: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                textAlign: 'center',
                lineHeight: '40px',
                fontSize: '20px'
              }}>
                {getInitials(userProfile.display_name)}
              </div>
          </Nav>
        )}
      <Dropdown align="end">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
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
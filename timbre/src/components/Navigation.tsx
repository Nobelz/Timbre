// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { authorize, getToken } from "../api/auth/authorize";



// profilePage is false by default
// profilePage is true when the user is on the profile page

const Navigation = ({ isAuthenticated, authorizeApp, userProfile }) => {

  const getInitials = (name) => {
    return name.split(' ').map(part => part[0].toUpperCase()).join('');
  };


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
        <Button onClick={authorizeApp}>{isAuthenticated ? "Refresh Token" : "Sign In"}</Button>
      </Container>
    </Navbar>
  );
};

export default Navigation;
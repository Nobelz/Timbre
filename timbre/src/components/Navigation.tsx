// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { authorize, getToken } from "../api/auth/authorize";



// profilePage is false by default
// profilePage is true when the user is on the profile page

const Navigation = ({ isAuthenticated, authorizeApp}) => {


  return (
    <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            Timbre
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/matches">Matches</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
          </Nav>
          <Button onClick={authorizeApp}>{isAuthenticated ? "Refresh Token" : "Sign In"}</Button>
        </Container>
      </Navbar>
  );
};

export default Navigation;
// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { authorize, getToken } from "../api/auth/authorize";



// userAuth prop

export default Navigation = ({ isAuthenticated, authorizeApp}) => {


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
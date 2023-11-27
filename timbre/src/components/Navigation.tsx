// Navbar for the application using React Bootstrap

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../hooks/useRefreshToken";
import { authorize, getToken } from "../app/api/auth/authorize";


export default Navigation = () => {

  return (
    <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            Timbre
          </Navbar.Brand>
          <Button onClick={authorize}>Sign In</Button>
        </Container>
      </Navbar>
  );
};
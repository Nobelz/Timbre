"use client";

import Head from 'next/head'
import { authorize } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

/* 
 The landing page of the application where users will have to sign in to their Spotify account.
 */
export default function Login() {
  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>e
            Timbre
          </Navbar.Brand>
          <Button onClick={authorize}>Sign In</Button>
        </Container>
      </Navbar>
    </div>
  )
}
"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head'
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function Home() {

  const { data: session } = useSession();

  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            Timbre
          </Navbar.Brand>
          {session && <Button onClick={() => signOut()}>Sign Out</Button>}
          {!session && <Button onClick={() => signIn()}>Sign In</Button>}
        </Container>
      </Navbar>
    </div>
  )
}
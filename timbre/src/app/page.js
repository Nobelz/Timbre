"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../hooks/useRefreshToken";
import { authorize, getToken } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function Home() {

  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  useRefreshToken(String(code));

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
          <Button onClick={authorize}>Authorize</Button>
        </Container>
      </Navbar>
    </div>
  )
}
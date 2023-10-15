"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../hooks/useRefreshToken";
import { authorize, getToken } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default function Login() {

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
          <Button onClick={authorize}>Sign In</Button>
        </Container>
      </Navbar>
    </div>
  )
}
"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import { topTracks } from "../../lib/spotify";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../hooks/useRefreshToken";

/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home() {
  const [codeVerifier, setCodeVerifier] = useState("");
  const [access_token, setAccessToken] = useState("");
  const [userTopTracks, setTopTracks] = useState([]);

  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  useRefreshToken(String(code));

  const authorizeApp = async () => {
    await authorize();
  };

  const fetchTopTracks = async () => {
    let response = await topTracks();
    setTopTracks(response.items);
  };

  // Runs once when accessing this webpage. Fetches the user's top tracks
  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setAccessToken(token || "");
    fetchTopTracks();
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
  }, []);

  console.log(userTopTracks);

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
          <Button onClick={authorizeApp}>Refresh Token</Button>
        </Container>
      </Navbar>
    </div>
  )
}
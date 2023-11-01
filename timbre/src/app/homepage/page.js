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


export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/endpoint');
  const props = await res.json();
  return {
      props: {
          props,
      },
  }
}

/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home({ props }) {
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

  useEffect(() => {
    console.log(props);
  }, [props])

  // Function to test connection to db called on button press
  // makes a call to the route.js file in app/api/endpoint folder
  const test = async () => {
    const res = await fetch('http://localhost:3000/api/endpoint');
    const output = await res.json();
    console.log(output);
  }

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
      <Button onClick={test}>Test API Endpoint</Button>
    </div>
  )
}
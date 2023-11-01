"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import { topTracks, topArtists } from "../../lib/spotify";
import Navbar from 'react-bootstrap/Navbar';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';


/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home() {
  const dummyFriends = [
    { id: 1, name: "Friend A", email: "frienda@email.com", profilePictureUrl: "path/to/imageA.jpg" },
    { id: 2, name: "Friend B", email: "friendb@email.com", profilePictureUrl: "path/to/imageB.jpg" },
    // ... add more friends as needed
  ];
  const [codeVerifier, setCodeVerifier] = useState("");
  const [access_token, setAccessToken] = useState("");
  //const [userTopArtists, setTopArtists] = useState([]);
  const [userTopTracks, setTopTracks] = useState([]);
  //const [userTopGenres, setUserTopGenres] = useState([]);

  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  useRefreshToken(String(code));

  const authorizeApp = async () => {
    await authorize();
  };

  const fetchTopTracks = async () => {
    try {
      // Assuming topTracks() returns a promise that resolves with the response data.
      let response = await topTracks(access_token); // passing the token if required
      if (response.items) {
        setTopTracks(response.items);
      } else {
        console.error("Unexpected response", response);
      }
    } catch (error) {
      console.error("An error occurred while fetching top tracks:", error);
    }
  };
  // Runs once when accessing this webpage. Fetches the user's top tracks
  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setAccessToken(token || "");
    fetchTopTracks();
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
  }, []);

  console.log(userTopTracks);

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
          <Link href="/friends">Friends</Link>
        </Container>
      </Navbar>
      <Button onClick={test}>Test API Endpoint</Button>
      <div>
        <Card>
          <Card.Title>Your Top Tracks</Card.Title>
          <Container>
            <Row>
              {
                userTopTracks.map(track => (
                  <Col md={3} key={track.id}>
                    <Card>
                      <Card.Img variant="top" src={track.album.images[0]?.url || ''} />
                      <Card.Body>
                        <Card.Title>{track.name}</Card.Title>
                        <Card.Text>
                          {track.artists.map(artist => artist.name).join(', ')}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              }
            </Row>
          </Container>
        </Card>
      </div>
    </div>
  )
}
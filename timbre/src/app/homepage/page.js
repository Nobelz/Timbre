"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import { topTracks, topArtists } from "../../lib/spotify";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, ListGroup, Button } from 'react-bootstrap';
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSearchParams, useRouter } from "next/navigation";
import { Row, Col, Card } from 'react-bootstrap';

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
  const [userTopTracks, setTopTracks] = useState([]);

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
    if (!access_token) {
      let token = localStorage.getItem("access_token");
      setAccessToken(token || "");
    } else {
      fetchTopTracks(); // This should now only be called when you have a token
    }
  }, [access_token]); // Dependency array

  // Function to test connection to db called on button press
  // makes a call to the route.js file in app/api/endpoint folder
  const test = async () => {
    const res = await fetch('../api/endpoint', {
      method: 'GET',
    });
    const output = await res.json();
    console.log(access_token);
    // console.log(output);
  }

  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/homepage">
            Timbre
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/matches">Matches</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
          </Nav>
          <Button onClick={authorize}>Refresh Token</Button>
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
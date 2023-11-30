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
import Navigation from '../../components/Navigation';

/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home() {
  const dummyFriends = [
    { id: 1, name: "Friend A", email: "frienda@email.com", profilePictureUrl: "path/to/imageA.jpg" },
    { id: 2, name: "Friend B", email: "friendb@email.com", profilePictureUrl: "path/to/imageB.jpg" },
    { id: 3, name: "Friend C", email: "friendc@email.com", profilePictureUrl: "path/to/imageC.jpg" },
    { id: 4, name: "Friend D", email: "friendd@email.com", profilePictureUrl: "path/to/imageD.jpg" },
    // ... add more friends as needed
  ];

  const dummyMatches = [
    { id: 1, name: "Match A", email: "matcha@email.com", profilePictureUrl: "path/to/imageM1.jpg" },
    { id: 2, name: "Match B", email: "matchb@email.com", profilePictureUrl: "path/to/imageM2.jpg" },
    { id: 3, name: "Match C", email: "matchc@email.com", profilePictureUrl: "path/to/imageM3.jpg" },
    { id: 4, name: "Match D", email: "matchd@email.com", profilePictureUrl: "path/to/imageM4.jpg" }
    // ... add more matches as needed
  ];

  const [access_token, setAccessToken] = useState("");
  const [userTopTracks, setTopTracks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add this inside your Home component or in a suitable place
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (access_token) {
      fetchUserProfile();
    }
  }, [access_token]);


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
      if (token) setIsAuthenticated(true);
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
      <Navigation isAuthenticated={isAuthenticated} authorizeApp={authorizeApp} userProfile={userProfile} />
      <Button onClick={test}>Test API Endpoint</Button>

      <Container>
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Welcome to Timbre</Card.Title>
                <Card.Text>
                  Connect with your music matches and explore new tracks!
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Title>Matches</Card.Title>
              <ListGroup variant="flush" style={{ maxHeight: '5em', overflowY: 'scroll' }}>
                {dummyMatches.map(match => (
                  <ListGroup.Item key={match.id} href={`/profile/${match.id}`}>
                    <img src={match.profilePictureUrl} alt={match.name} />
                    {match.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Title>Friends</Card.Title>
              <ListGroup variant="flush" style={{ maxHeight: '5em', overflowY: 'scroll' }}>
                {dummyFriends.map(friend => (
                  <ListGroup.Item key={friend.id} href={`/profile/${friend.id}`}>
                    <img src={friend.profilePictureUrl} alt={friend.name} />
                    {friend.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
        {/* Add some space between the two sections */}
        {/*}
        <Row className="mb-4">
          <Col>
            <br />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
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
          </Col>
                </Row> */}
      </Container>
    </div>
  )
}
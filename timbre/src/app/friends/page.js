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
import Navigation from '../../components/Navigation';

/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home() {
    const dummyFriends = [
        { id: 1, name: "Friend A", email: "frienda@email.com", profilePictureUrl: "path/to/imageA.jpg", compatibilityScore: "90%" },
        { id: 2, name: "Friend B", email: "friendb@email.com", profilePictureUrl: "path/to/imageB.jpg", compatibilityScore: "90%" },
    ];
    const [codeVerifier, setCodeVerifier] = useState("");
    const [access_token, setAccessToken] = useState("");
    //const [userTopArtists, setTopArtists] = useState([]);
    const [userTopTracks, setTopTracks] = useState([]);
    //const [userTopGenres, setUserTopGenres] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        if (!access_token) {
            let token = localStorage.getItem("access_token");
            setAccessToken(token || "");
            if (token) setIsAuthenticated(true);
        } else {
            fetchTopTracks(); // This should now only be called when you have a token
        }
    }, [access_token]); // Dependency array


    console.log(userTopTracks);

    // Function to test connection to db called on button press
    // makes a call to the route.js file in app/api/endpoint folder
    function test() {
        const apiReq = fetch('http://localhost:3000/api/endpoint', {
            method: 'PUT',
            body: JSON.stringify("this is a test")
        });
    }

    return (
        <div>
            <Head>
                <title>Timbre</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation isAuthenticated={isAuthenticated} authorizeApp={authorizeApp} />
            <Button onClick={test}>Test API Endpoint</Button>
            <Container>
                <h2>My Friends</h2>
                <ListGroup>
                    {dummyFriends.map(friend => (
                        <ListGroup.Item key={friend.id}>
                            <img src="/profile.png" /*src={friend.profilePictureUrl}*/ alt={friend.name} width={50} className="mr-3" />
                            {friend.name} ({friend.email})
                            <Button variant="danger" className="float-right ml-2">Remove</Button>
                            <Button variant="primary" className="float-right" href={`/profile/${friend.id}`}>View Profile</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        </div>
    )
}
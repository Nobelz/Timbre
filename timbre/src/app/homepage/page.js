"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import { topTracks, topArtists } from "../../lib/spotify";
import { Container, ListGroup, Button } from 'react-bootstrap';
import useUserProfile from "../../hooks/useUserProfile";
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { useSearchParams, useRouter } from "next/navigation";
import { Row, Col, Card } from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import AuthRedirect from '../../components/AuthRedirect';
import TrackSearchResult from '../../components/TrackSearchResult';
import styles from '../styles/homepage.module.css';
import Player from '../../components/Player';

/*
 Homepage of the application where users can get matched with other users.
 *******Most of it right now is just placeholder code for testing purposes*******
 */
export default function Home() {
  const [userTopTracks, setTopTracks] = useState([]);
  const { access_token, isAuthenticated, setAccessToken, setIsAuthenticated } = useAuthentication();
  const [spotify_id, setSpotifyID] = useState("");
  const isLoading = useAuthRedirect(isAuthenticated);
  const userProfile = useUserProfile(access_token);

  // Add this inside your Home component or in a suitable place
  const [playingTrack, setPlayingTrack] = useState();
  const [showPlayer, setShowPlayer] = useState(false);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setShowPlayer(true);
  }

  function hidePlayer() {
    setShowPlayer(false);
  }

  const updateRecommendations = async (track, rating) => {
    let data = {
        command: 'RATE_SONG',
        spotify_id: spotify_id,
        track_id: track.song_id,
        rating: rating,
        insert_song: false,
    };

    const response = await fetch('../api/endpoint', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    await response.json();

    if (spotify_id) {
      fetchTopTracks();
    }
}

  const fetchTopTracks = async () => {
    try {
      let data = {
        command: 'GET_TOP_TRACKS',
        spotify_id: localStorage.getItem('spotify_id'),
        access_token: access_token,
      }
      const response = await fetch('../api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      let res = await response.json();

      if (res.data) {
        setTopTracks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!access_token || !spotify_id) {
        let token = localStorage.getItem("access_token");
        let spotifyID = localStorage.getItem("spotify_id");
        setAccessToken(token);
        setSpotifyID(spotifyID);
        if (token) setIsAuthenticated(true);
    }
    if (spotify_id && access_token) {
        fetchTopTracks();
    }
  }, [access_token, spotify_id]);

  if (isLoading) {
    return null; // Or any other loading indicator
  }

  return (
    <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken} accessToken={access_token}>
      <div className={`${styles.homepage}`}>
        <Head>
          <title>Timbre</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Navigation isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setAccessToken={setAccessToken}
          accessToken={access_token}/>
        <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
        <Player track={playingTrack} show={showPlayer} onHide={hidePlayer} onUpdateRating={updateRecommendations} />
        <Container>
          <Row className={`${styles.row}`}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title >Welcome to Timbre, {userProfile?.display_name}!</Card.Title>
                  <Card.Text>
                    Connect with your music matches and explore new tracks!

                    See some of your favorite songs below and click play to listen.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <br />
            </Col>
          </Row>
          { /* if user logs out then don't show anything */ isAuthenticated && <Row>
            <Col md={12}>

              <Card className={`${styles.card}`}>
                <Card.Title className={`${styles.top_tracks}`}>Your Top Tracks</Card.Title>

                <Container className={`${styles.trackContainer}`}>
                  <Row>
                    {
                      userTopTracks.map(track => (
                        <Col md={3} key={track.song_id}>
                          <TrackSearchResult
                            track={track}
                            chooseTrack={chooseTrack}
                          />
                        </Col>
                      ))
                    }
                  </Row>
                </Container>
              </Card>
            </Col>
          </Row>}
        </Container>
      </div>
    </AuthRedirect>
  )
}
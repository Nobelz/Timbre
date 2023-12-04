"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import { topTracks, topArtists } from "../../lib/spotify";
import { Container, Form } from 'react-bootstrap';
import useUserProfile from "../../hooks/useUserProfile";
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { useSearchParams, useRouter } from "next/navigation";
import { Row, Col, Card, Dropdown} from 'react-bootstrap';
import Navigation from '../../components/Navigation';
import AuthRedirect from '../../components/AuthRedirect';
import TrackSearchResult from '../../components/TrackSearchResult';
import styles from '../styles/homepage.module.css';
import Player from '../../components/Player';
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: "b19d3fc2519f47b69da48d2a75142499",
})

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

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [playingTrack, setPlayingTrack] = useState();
  const [showPlayer, setShowPlayer] = useState(false);

  const chooseSearchTrack = async (track) => {
    let data = {
      command: 'GET_SONG_RATING',
      spotify_id: spotify_id,
      track: track,
    };

    const response = await fetch('../api/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    let res = await response.json();

    if (res.data) {
      chooseTrack(res.data);
    }
  };

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
        spotifyApi.setAccessToken(access_token);
    }
  }, [access_token, spotify_id]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!access_token) return;

    spotifyApi.searchTracks(search).then(res => {
      setSearchResults(res.body.tracks.items.map(track => {
        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
          if (image.height < smallest.height) return image;
          return smallest;
        }, track.album.images[0])

        return {
          artists: track.artists.map(artists => {
            return artists.name;
          }),
          artist_ids: track.artists.map(artists => {
            return artists.id;
          }),
          song_id: track.id,
          title: track.name,
          uri: track.uri,
          albumImageUrl: smallestAlbumImage.url
        }
      }))
    });
  }, [search, access_token]);


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

                    See some of your favorite songs below or search a song to listen or rate!
                  </Card.Text>

                  <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                  <Row style={{alignItems: 'center'}}>
                    <Col xs={5} style={{width: '10px'}}>
                      <i class="fa fa-search" aria-hidden="true"></i>
                    </Col>
                    <Col>
                      <Form.Control className={`${styles.search}`} type="search" placeholder="Search for Songs/Artists" value={search} onChange={e => setSearch(e.target.value)} />
                    </Col>
                  </Row>
                  
                  <div className={styles.songs}>
                    {searchResults.map(track => (
                      <TrackSearchResult track={track} chooseTrack={chooseSearchTrack} key={track.uri} />
                    ))}
                  </div>
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
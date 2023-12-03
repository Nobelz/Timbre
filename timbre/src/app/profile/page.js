"use client";

import Head from 'next/head'
import { useState, useEffect, utate, useRef } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, ListGroup, Button, Form } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList';
import Navigation from '../../components/Navigation';
import useRefreshToken from "../../hooks/useRefreshToken";
import useUserProfile from "../../hooks/useUserProfile";
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import AuthRedirect from '../../components/AuthRedirect';
import { useSearchParams, useRouter } from "next/navigation";
import { authorize, getToken } from "../api/auth/authorize";
import styles from '../styles/profile.module.css';
import UpdateTextPopup from "../../components/BioPopup";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function Profile({content}) {

    const [showBioPopup, setShowBioPopup] = useState(false);
    const [access_token, setAccessToken] = useState("");
    const [userInfo, setUserInfo] = useState({})
    const [spotify_id, setSpotifyID] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isLoading = useAuthRedirect(isAuthenticated);

    const handleBio = (e) => {
        e.stopPropagation();
        setShowBioPopup(true);
    }

    const handleBioPopupClose = () => {
        setShowBioPopup(false);
    }

    const authorizeApp = async () => {
        await authorize();
    };
    

    const fetchUserProfile = async () => {
        try {
            let data = {
                command: 'GET_USER_PROFILE',
                spotify_id: spotify_id,
            };

            const response = await fetch('../api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const resJson = await response.json();
            setUserInfo(resJson.data.rows[0]);
        } catch (error) {
            console.error(error);
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
        if (spotify_id) {
            fetchUserProfile();
        }
    }, [access_token, spotify_id]); 

    if (isLoading){
        return null;
    }

    return (
        <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken} >
        <div >
            <Head>
                <title>Timbre</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation isAuthenticated={isAuthenticated} setAccessToken={setAccessToken} setIsAuthenticated={setIsAuthenticated} authorizeApp={authorizeApp} accessToken={access_token}/>

            <div className={`${styles.profile}`}>
            <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
            <Container className={`${styles.container}`}>
                <h1 className={`${styles.row}`}>Personal Details</h1>
                <Row>
                    <Col className={`${styles.info}`}>
                        <Row>
                            <Col className={`${styles.title_col}`}>Display Name</Col>
                            <Col className={`${styles.content_col}`}>{userInfo.display_name}</Col>
                        </Row>
                        <Row>
                            <Col className={`${styles.title_col}`}>Email</Col>
                            <Col className={`${styles.content_col}`}>{userInfo.user_email}</Col>
                        </Row>
                        <Row>
                            <Col className={`${styles.title_col}`}>Bio</Col>
                            <Col className={`${styles.content_col}`}>{userInfo.bio}</Col>
                        </Row>
                    </Col>
                    <Col className={`${styles.button_col}`}>
                        <Button className={styles.button} onClick={(event) => handleBio(event)}>Edit Bio</Button>
                        <UpdateTextPopup show={showBioPopup} onHide={handleBioPopupClose} props={content}/>
                    </Col>
                </Row>

                <h1 className={`${styles.row}`}>Spotify</h1>
                <Row>
                    <Col className={`${styles.info}`}>
                        <Row>
                            <Col className={`${styles.title_col}`}>Spotify ID</Col>
                            <Col className={`${styles.content_col}`}>{spotify_id}</Col>
                        </Row>
                        <Row>
                            <Col className={`${styles.title_col}`}>Last Synced</Col>
                            <Col className={`${styles.content_col}`}>{userInfo.last_refresh}</Col>
                        </Row>
                    </Col>
                    <Col className={`${styles.button_col}`}>
                        <Button className={styles.button} onClick={authorizeApp}>Resync Now</Button>
                    </Col>
                </Row>

                <Row className={`${styles.row}`}>
                    <Button className={styles.logoutbutton}>Log Out</Button>
                </Row>

            </Container>
            </div>
            
        </div>
        </AuthRedirect>
    )
}
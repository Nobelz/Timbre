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

    const { access_token, isAuthenticated, setAccessToken, setIsAuthenticated } = useAuthentication();

    const userProfile = useUserProfile(access_token);

    const isLoading = useAuthRedirect(isAuthenticated);

    const authorizeApp = async () => {
        await authorize();
      };

    const handleBio = (e) => {
        e.stopPropagation();
        setShowBioPopup(true);
    }

    const handleBioPopupClose = () => {
        setShowBioPopup(false);
    }

    if (isLoading){
        return null;
    }


    return (
        <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken} >
        <div className={`${styles.profile}`}>
                <Head>
                    <title>Timbre</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Navigation isAuthenticated={isAuthenticated} userProfile={userProfile} setAccessToken={setAccessToken} setIsAuthenticated={setIsAuthenticated} authorizeApp={authorizeApp}/>

                <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
                <Container class={`${styles.container}`}>
                    <h1 class={`${styles.row}`}>Personal Details</h1>
                    <Row>
                        <Col class={`${styles.info}`}>
                            <Row>
                                <Col class={`${styles.title_col}`}>Display Name</Col>
                                <Col class={`${styles.content_col}`}>display_name</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Email</Col>
                                <Col class={`${styles.content_col}`}>email_info</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Bio</Col>
                                <Col class={`${styles.content_col}`}>bio_info</Col>
                            </Row>
                        </Col>
                        <Col class={`${styles.button_col}`}>
                            <Button className={styles.button} onClick={(event) => handleBio(event)}>Edit Bio</Button>
                            <UpdateTextPopup show={showBioPopup} onHide={handleBioPopupClose} props={content}/>
                        </Col>
                    </Row>

                    <h1 class={`${styles.row}`}>Spotify</h1>
                    <Row>
                        <Col class={`${styles.info}`}>
                            <Row>
                                <Col class={`${styles.title_col}`}>Spotify ID</Col>
                                <Col class={`${styles.content_col}`}>spotify_id</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Last Synced</Col>
                                <Col class={`${styles.content_col}`}>last_synced_info</Col>
                            </Row>
                        </Col>
                        <Col class={`${styles.button_col}`}>
                            <Button className={styles.button} onClick={authorizeApp}>Resync Now</Button>
                        </Col>
                    </Row>

                    <Row class={`${styles.row}`}>
                        <Button className={styles.button}>Log Out</Button>
                    </Row>

                </Container>
                
            </div>
            </AuthRedirect>
    )
}
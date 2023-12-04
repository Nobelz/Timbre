"use client";

import Head from 'next/head'
import { useState, useEffect } from "react";
import { Container, ListGroup, Button } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList'
import styles from '../styles/matches.module.css';
import Navigation from '../../components/Navigation';
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import AuthRedirect from '../../components/AuthRedirect';
import { authorize, getToken } from "../api/auth/authorize";
import ToastComponent from '../../components/ToastComponent';
import useUserProfile from "../../hooks/useUserProfile";
import { match } from 'assert';


export default function Matches() {
    const [matchcards, setMatchcards] = useState([]);

    const [access_token, setAccessToken] = useState("");
    const [spotify_id, setSpotifyID] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isLoading = useAuthRedirect(isAuthenticated);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const authorizeApp = async () => {
        await authorize();
    };

    useEffect(() => {
        if (!access_token || !spotify_id) {
            let token = localStorage.getItem("access_token");
            let spotifyID = localStorage.getItem("spotify_id");
            setAccessToken(token);
            setSpotifyID(spotifyID);
            if (token) setIsAuthenticated(true);
        }
        if (spotify_id) fetchMatches();
    }, [access_token, spotify_id]);

    const fetchMatches = async () => {
        try {
            let data = {
                command: 'GET_MATCHES',
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
            setMatchcards(resJson.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowToast = (error, message, variant) => {
        setErrorMessage(error);
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken}>
            <div className={`${styles.matches}`}>
                <Head>
                    <title>Timbre</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Navigation isAuthenticated={isAuthenticated} setAccessToken={setAccessToken} setIsAuthenticated={setIsAuthenticated} accessToken={access_token} />

                <div className={`${styles.matches}`}>
                    <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet' />
                    <div className={`${styles.header}`}>
                        Your Matches
                    </div>
                    <div className={`${styles.container}`}>
                        <MatchcardList matchcards={matchcards} handleToast={handleShowToast}/>
                    </div>
                </div>
            </div>
            <ToastComponent show={showToast} variant={toastVariant} title={errorMessage} message={toastMessage} />
        </AuthRedirect>
    )
}
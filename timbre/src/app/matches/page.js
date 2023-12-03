"use client";

import Head from 'next/head'
import { useState, useEffect} from "react";
import { Container, ListGroup, Button } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList'
import styles from '../styles/matches.module.css';
import Navigation from '../../components/Navigation';
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import AuthRedirect from '../../components/AuthRedirect';
import { authorize, getToken } from "../api/auth/authorize";
import useUserProfile from "../../hooks/useUserProfile";


export default function Matches() {
    const [matchcards, setMatchcards] = useState([
        { "username": "billy" },
        { "username": "joe" },
        { "username": "steve" }
    ]);
    
    const [access_token, setAccessToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isLoading = useAuthRedirect(isAuthenticated);

    return (
        <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken}>
        <div className={`${styles.matches}`}>
            <Head>
                <title>Timbre</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation isAuthenticated={isAuthenticated} setAccessToken={setAccessToken} setIsAuthenticated={setIsAuthenticated} accessToken={access_token}/>

            <div className={`${styles.matches}`}>
                <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
                <div className={`${styles.header}`}>
                    Your Matches
                </div>
                <div className={`${styles.container}`}>
                    <MatchcardList matchcards={matchcards} />
                </div>
            </div>
        </div>
        </AuthRedirect>
    )
}
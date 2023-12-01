"use client";

import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import Navigation from '../../components/Navigation';
import styles from '../styles/friends.module.css';
import FriendsTab from '../../components/FriendsTab'

export default function Friends() {
    const [access_token, setAccessToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [friends, setFriends] = useState([
        { "username": "bob" },
        { "username": "billy" },
        { "username": "joe" },
        { "username": "steve" },
        { "username": "jane" }
    ]);
    const [friendRequests, setFriendRequests] = useState([
        { "username": "bob" },
        { "username": "billy" },
        { "username": "joe" },
        { "username": "steve" },
        { "username": "jane" }
    ]);

    const authorizeApp = async () => {
        await authorize();
    };

    useEffect(() => {
        if (!access_token) {
            let token = localStorage.getItem("access_token");
            setAccessToken(token || "");
            if (token) setIsAuthenticated(true);
        }
    }, [access_token]); 
    
    return (
        <div className={`${styles.friends}`}>
            <Navigation isAuthenticated={isAuthenticated} authorizeApp={authorizeApp} />
            <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
            <div className={`${styles.header}`}>
                View Your Friends and Song Recommendations
            </div>
            <div className={`${styles.container}`}>
                <FriendsTab friends={friends} friendRequests={friendRequests}/>
            </div>
        </div>
    )
}
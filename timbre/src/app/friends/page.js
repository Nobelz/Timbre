"use client";

import { useEffect, useState } from "react";
import { authorize, getToken } from "../api/auth/authorize";
import Navigation from '../../components/Navigation';
import styles from '../styles/friends.module.css';
import FriendsTab from '../../components/FriendsTab'

export default function Friends() {
    const [access_token, setAccessToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [friendRequests, setFriendRequests] = useState([
        { "username": "bob" },
        { "username": "billy" },
        { "username": "joe" },
        { "username": "steve" },
        { "username": "jane" }
    ]);
    const [songRecommendations, setSongRecommendations] = useState([
        {
            "albumImageUrl": "https://i.scdn.co/image/ab67616d00004851e4179b3fb74beaf0cdfa7a13",
            "artists": ["League of Legends", "New Jeans"],
            "title": "GODS",
            "uri": "spotify:track:210JJAa9nJOgNa0YNrsT5g"
        },
        {
            "albumImageUrl": "https://i.scdn.co/image/ab67616d000048517282412ad025c14f7039f516",
            "artists": ['JAY-Z', 'Linkin Park'],
            "title": "Numb / Encore",
            "uri": "spotify:track:5sNESr6pQfIhL3krM8CtZn"
        },
    ]);
    const [friends, setFriends] = useState([]);

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

    useEffect(() => {
        fetch('../api/endpoint', {
            body: JSON.stringify({
                command: 'GET_FRIENDS'
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setFriends(data)
            })
    }, []);

    return (
        <div className={`${styles.friends}`}>
            <Navigation isAuthenticated={isAuthenticated} authorizeApp={authorizeApp} />
            <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet' />
            <div className={`${styles.header}`}>
                View Your Friends and Song Recommendations
            </div>
            <div className={`${styles.container}`}>
                <FriendsTab friends={friends} friendRequests={friendRequests} recs={songRecommendations}/>
            </div>
        </div>
    )
}
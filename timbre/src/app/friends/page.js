"use client";

import { useEffect, useState } from "react";
import Navigation from '../../components/Navigation';
import styles from '../styles/friends.module.css';
import FriendsTab from '../../components/FriendsTab'

export default function Friends() {
    const [access_token, setAccessToken] = useState("");
    const [spotify_id, setSpotifyID] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
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

    const fetchFriends = async () => {
        try {
            let data = {
                command: 'GET_FRIENDS',
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
            setFriends(resJson.data.rows);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            let data = {
                command: 'GET_FRIEND_REQUESTS',
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
            setFriendRequests(resJson.data.rows);
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
            fetchFriends();
            fetchFriendRequests();
        }
    }, [access_token, spotify_id]); 
    
    return (
        <div className={`${styles.friends}`}>
            <Navigation isAuthenticated={isAuthenticated} />
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
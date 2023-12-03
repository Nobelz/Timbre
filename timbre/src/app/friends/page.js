"use client";

import { useEffect, useState } from "react";
import Navigation from '../../components/Navigation';
import styles from '../styles/friends.module.css';
import FriendsTab from '../../components/FriendsTab';
import ToastComponent from '../../components/ToastComponent';

export default function Friends() {
    const [access_token, setAccessToken] = useState("");
    const [spotify_id, setSpotifyID] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [songRecommendations, setSongRecommendations] = useState([]);
    const [friends, setFriends] = useState([]);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [titleMessage, setTitleMessage] = useState('');

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
            console.log(error);
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
            console.log(error);
        }
    };

    const fetchRecommendations = async() => {
        try {
            let data = {
                command: 'GET_RECOMMENDATIONS',
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
            setSongRecommendations(resJson.data.tracks);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowToast = (title, message, variant) => {
        setTitleMessage(title);
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Function that updates the friends after any friend-related action is taken
    const updateFriends = () => {
        if (spotify_id) {
            fetchFriends();
            fetchFriendRequests();
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
            updateFriends();
            fetchRecommendations();
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
                <FriendsTab friends={friends} friendRequests={friendRequests} recs={songRecommendations} updateFriends={updateFriends} handleToast={handleShowToast} />
            </div>
            <ToastComponent show={showToast} variant={toastVariant} title={errorMessage} message={toastMessage} />
        </div>
    )
}
"use client";

import { useEffect, useState } from "react";
import Navigation from '../../components/Navigation';
import styles from '../styles/friends.module.css';
import FriendsTab from '../../components/FriendsTab';
import ToastComponent from '../../components/ToastComponent';
import useAuthentication from '../../hooks/useAccessToken';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import AuthRedirect from '../../components/AuthRedirect';

export default function Friends() {
    const [spotify_id, setSpotifyID] = useState("");
    const { access_token, isAuthenticated, setAccessToken, setIsAuthenticated } = useAuthentication();

    const [friendRequests, setFriendRequests] = useState([]);
    const [songRecommendations, setSongRecommendations] = useState([]);
    const [friends, setFriends] = useState([]);
    const isLoading = useAuthRedirect(isAuthenticated);

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

    const fetchRecommendations = async () => {
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
            fetchRecommendations();
        }
    }

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
        <AuthRedirect isLoading={isLoading} isAuth={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setAccessToken={setAccessToken} >
            <div className={`${styles.friends}`}>
                <Navigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} accessToken={access_token} setAccessToken={setAccessToken} />
                <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet' />
                <div className={`${styles.header}`}>
                    View Your Friends and Song Recommendations
                </div>
                <div className={`${styles.container}`}>
                    <FriendsTab friends={friends} friendRequests={friendRequests} recs={songRecommendations} updateFriends={updateFriends} updateRecs={updateRecommendations} handleToast={handleShowToast} />
                </div>
                <ToastComponent show={showToast} variant={toastVariant} title={titleMessage} message={toastMessage} />
            </div>
        </AuthRedirect>
    )
}
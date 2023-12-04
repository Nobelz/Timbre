import React, { useState, useEffect } from "react";
import { Container, Modal } from "react-bootstrap";
import SpotifyPlayer from "react-spotify-web-playback"
import styles from '../app/styles/player.module.css'
import { Rating } from 'react-simple-star-rating'

export default function Player({ track, show, onHide, updateRecommendations }) {
    const [accessToken, setAccessToken] = useState();
    const [play, setPlay] = useState(false);
    const [rating, setRating] = useState(0);
    const [trackUri, setTrackUri] = useState([]);

    useEffect(() => {
        setAccessToken(window !== 'undefined' ? localStorage.getItem("access_token") : null)
    }, []);

    useEffect(() => {
        if (show) {
            setPlay(true);
            if (track) {
                setTrackUri([track.uri]);
                if (track.rating) {
                    setRating(track.rating / 2);
                } else {
                    setRating(0);
                }
            }
        }
    }, [show]);

    const handleRating = (rating) => {
        setRating(rating);
        updateRecommendations(track, rating * 2);
    }

    if (!accessToken) return null;
    return (
        <Modal show={show} onHide={onHide} dialogClassName={`${styles.popup}`} centered>
            <Modal.Header closeButton>
                <Modal.Title>Click play and rate this song!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={`${styles.container}`}>
                    <SpotifyPlayer
                        token={accessToken}
                        play={play}
                        showSaveIcon
                        callback={state => {
                            if (!state.isPlaying) setPlay(false);
                        }}
                        uris={trackUri}
                    />
                    <Rating 
                        onClick={handleRating}
                        initialValue={rating}
                        allowFraction={true}
                        transition={true}
                    />
                </Container>
            </Modal.Body>
        </Modal>
    )
}
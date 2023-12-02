import React, { useState, useEffect } from "react";
import { Container, Modal } from "react-bootstrap";
import SpotifyPlayer from "react-spotify-web-playback"
import styles from '../app/styles/player.module.css'
import { Rating } from 'react-simple-star-rating'

export default function Player({ trackUri, show, onHide }) {
    const [accessToken, setAccessToken] = useState();
    const [play, setPlay] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        setAccessToken(window !== 'undefined' ? localStorage.getItem("access_token") : null)
    }, []);

    useEffect(() => {
        setPlay(true);
    }, [trackUri]);

    const handleRating = (rating) => {
        setRating(rating);
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
                        uris={trackUri ? [trackUri] : []}
                    />
                    <Rating 
                        onClick={handleRating}
                        allowFraction={true}
                        transition={true}
                    />
                </Container>
            </Modal.Body>
        </Modal>
    )
}
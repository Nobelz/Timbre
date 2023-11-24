import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/matches.module.css';
import { Button } from "react-bootstrap";
import RecSongPopup from "./RecSongsPopup"

export default function Matchcard({ content }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showRecSongPopup, setShowRecSongPopup] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleRecommendSong = (e) => {
        e.stopPropagation();
        setShowRecSongPopup(true);
    }

    const handleRecSongPopupClose = () => {
        setShowRecSongPopup(false);
    }

    return (
        <div>
            <div
                className={`${styles.card} ${isFlipped ? styles.flip : ''}`}
                onClick={handleFlip}
            >
                <div className={`${styles.cardFace}`}>
                    {/* this is to be changed to content prop as input */}
                    <p>Front Side</p>
                </div>
                <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                    <p>Compatibility Score:</p>
                    <Button onClick={(event) => handleRecommendSong(event)}>Recommend Songs</Button>
                </div>
            </div>
            <RecSongPopup show={showRecSongPopup} onHide={handleRecSongPopupClose} props={content}/>
        </div>
    )
}
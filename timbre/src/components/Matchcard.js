import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/matches.module.css';
import { Button } from "react-bootstrap";

export default function Matchcard({ content }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleAddFriend = (e) => {
        e.stopPropagation();
        // add logic here for adding a friend
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
                    <Button onClick={(event) => handleAddFriend(event)}>Add Friend</Button>
                </div>
            </div>
        </div>
    )
}
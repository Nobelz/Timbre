import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/matches.module.css';

export default function Matchcard({ content }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`${styles.card} ${isFlipped ? styles.flip : ''}`}
            onClick={handleFlip}
        >
            <div className={`${styles.cardFace}`}>
                {/* this is to be changed to content prop as input */}
                <p>Front Side</p>
            </div>
            <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                <p>Back Side</p>
            </div>
        </div>
    )
}
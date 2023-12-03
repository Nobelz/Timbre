import React from "react";
import styles from '../app/styles/trackSearchRes.module.css'

export default function TrackSearchResult({ track, chooseTrack }) {

    function handleClick() {
        console.log(track);
        chooseTrack(track);
    }

    return (
        <div className={styles.searchCard} onClick={handleClick}>
            <img src={track.albumImageUrl} className={styles.trackImage} />
            <div className={styles.trackInfo}>
                <div>{track.title}</div>
                <div className="text-muted">
                    {track.artists.map((artist, index) => (
                        <span key={index} className={styles.artists}>
                            {artist}
                            {index < track.artists.length - 1 && ','}
                        </span>
                    ))}
                </div>
            </div>
        </div>

    )
}
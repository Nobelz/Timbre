import { useState } from "react";
import { Col, Row, Button } from "react-bootstrap"
import TrackSearchResult from "./TrackSearchResult"
import Player from './Player'
import styles from '../app/styles/songRecs.module.css'
import UpdateRatingPopup from "../components/RatingPopup";


export default function Recommendations({ recs }) {
    const [playingTrack, setPlayingTrack] = useState();

    function chooseTrack(track) {
        setPlayingTrack(track);
    }

    
    const [showRatingPopup, setShowRatingPopup] = useState(false);

    const handleRating = (e) => {
        e.stopPropagation();
        setShowRatingPopup(true);
    }

    const handleRatingPopupClose = () => {
        setShowRatingPopup(false);
    }


    return (
        <div>
            <div className={`${styles.yourRecs}`}>
                Your Song Recommendations
            </div>
            <Player trackUri={playingTrack?.uri} />

            <Button className={styles.button} onClick={(event) => handleRating(event)}>Rate</Button>
            <UpdateRatingPopup show={showRatingPopup} onHide={handleRatingPopupClose}/>
            
            <Row>
                {recs.map((track, index) => (
                    <Col key={index} md={6}>
                        <TrackSearchResult track={track} chooseTrack={chooseTrack} />
                    </Col>
                ))}
            </Row>
        </div>
    )
}
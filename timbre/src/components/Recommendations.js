import { useState } from "react";
import { Col, Row } from "react-bootstrap"
import TrackSearchResult from "./TrackSearchResult"
import Player from './Player'
import styles from '../app/styles/songRecs.module.css'

export default function Recommendations({ recs, updateRecs }) {
    const [playingTrack, setPlayingTrack] = useState();
    const [showPlayer, setShowPlayer] = useState(false);

    function chooseTrack(track) {
        setPlayingTrack(track);
        setShowPlayer(true);
    }

    function hidePlayer() {
        setShowPlayer(false);
    }
    
    return (
        <div>
            <div className={`${styles.yourRecs}`}>
                Your Song Recommendations
            </div>
            <Player track={playingTrack} show={showPlayer} onHide={hidePlayer} onUpdateRating={updateRecs} />
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
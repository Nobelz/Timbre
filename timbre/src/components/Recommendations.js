import { useState } from "react";
import { Col, Row } from "react-bootstrap"
import TrackSearchResult from "./TrackSearchResult"
import Player from './Player'
import styles from '../app/styles/songRecs.module.css'

export default function Recommendations({ recs }) {
    const [playingTrack, setPlayingTrack] = useState();

    function chooseTrack(track) {
        setPlayingTrack(track);
    }

    return (
        <div>
            <div className={`${styles.yourRecs}`}>
                Your Song Recommendations
            </div>
            <Player trackUri={playingTrack?.uri} />
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
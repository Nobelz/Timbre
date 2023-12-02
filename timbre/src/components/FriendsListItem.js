import { useState } from "react";
import styles from '../app/styles/friends.module.css';
import { ListGroup } from "react-bootstrap";
import RecSongPopup from '../components/RecSongsPopup'

export default function FriendsListItem({ friend }) {
    const [showRecSongPopup, setShowRecSongPopup] = useState(false);

    const handleRecommendSongs = (e) => {
        e.stopPropagation();
        setShowRecSongPopup(true);
        // add logic here for recommending a song
    }

    const handleRecSongPopupClose = () => {
        setShowRecSongPopup(false);
    }

    return (
        <div>
            <ListGroup.Item className={`${styles.listItem}`} onClick={(e) => handleRecommendSongs(e)}>
                {friend.username}
                <span className={`text-muted ${styles.listItemHidden}`}>Recommend Songs to {friend.username}?</span>
            </ListGroup.Item>
            <RecSongPopup show={showRecSongPopup} onHide={handleRecSongPopupClose} props={friend} />
        </div>
    )
}
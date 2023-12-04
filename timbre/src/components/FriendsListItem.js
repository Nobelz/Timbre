import { useState } from "react";
import styles from '../app/styles/friends.module.css';
import { ListGroup } from "react-bootstrap";
import RecSongPopup from '../components/RecSongsPopup'

export default function FriendsListItem({ friend, handleToast }) {
    const [showRecSongPopup, setShowRecSongPopup] = useState(false);

    const handleRecommendSongs = (e) => {
        e.stopPropagation();
        setShowRecSongPopup(true);
    }

    const handleRecSongPopupClose = () => {
        setShowRecSongPopup(false);
    }

    return (
        <div>
            <ListGroup.Item className={`${styles.listItem}`} onClick={(e) => handleRecommendSongs(e)}>
                <img src={friend.profile_pic} height="64" width="70" className={`${styles.profilePic}`} />
                {friend.display_name}
                <span className={`text-muted ${styles.score}`}>
                    Compatibility score: {Math.round((friend.score + Number.EPSILON) * 100)}{'%'}
                </span>
                <span className={`text-muted ${styles.listItemHidden}`}>Recommend Songs to {friend.display_name}?</span>
            </ListGroup.Item>
            <RecSongPopup show={showRecSongPopup} onHide={handleRecSongPopupClose} props={friend} handleToast={handleToast} />
        </div>
    )
}
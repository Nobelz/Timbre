import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/matches.module.css';
import { Button } from "react-bootstrap";

export default function Matchcard({ content, handleToast }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleAddFriend = (e) => {
        e.stopPropagation();
        addFriend();
    }

    const addFriend = async () => {
        try {
            let data = {
                command: 'MAKE_FRIEND_REQUEST_WITH_ID',
                current_id: localStorage.getItem("spotify_id"),
                match_id: content.match_id,
            };

            const response = await fetch('../api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            let res = await response.json();
            console.log(res)
            
            if (res.success) {
                handleToast('Friend Request Sent', `Friend request sent to ${content.display_name}!`, 'success');
            } else {
                if (res.data.code == 404) { // Check if user not found
                    handleToast('Friend Request Error', 'User with that email does not exist!', 'danger');
                } else if (res.data.code == 400) {
                    handleToast('Friend Request Error', res.data.message, 'danger');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div
                className={`${styles.card} ${isFlipped ? styles.flip : ''}`}
                onClick={handleFlip}
            >
                <div className={`${styles.cardFace}`}>
                    <img src={content.profile_pic} className={`${styles.profilePic}`}/>
                    <p className={`${styles.name}`}>{content.display_name}</p>
                </div>
                <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                    <div className={`${styles.compatability}`}>Compatibility Score</div>
                    <div className={`${styles.score}`}>{Math.round((content.score + Number.EPSILON) * 100)}%</div>
                    <Button onClick={(event) => handleAddFriend(event)}>Add Friend</Button>
                </div>
            </div>
        </div>
    )
}
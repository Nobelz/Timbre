import { useState } from "react";
import styles from '../app/styles/friendRequests.module.css';
import { ListGroup } from "react-bootstrap";

export default function FriendRequestItem({ request, index, handleDeny, handleAccept }) {
    
    const deny = () => {
        handleDeny(index, request.spotify_id);
    }

    const accept = () => {
        handleAccept(index, request.spotify_id);
    }

    return (
        <div id={index}>
            <ListGroup.Item className={`${styles.listItem}`}>
                <img src={request.profile_pic} height="64" width="70" className={`${styles.profilePic}`} />
                {request.display_name}
                <span className={`text-muted ${styles.listItemHidden}`}>
                    <span className={`${styles.accept}`} onClick={(event) => accept(event)}>
                        Accept
                    </span>
                    <span className={`${styles.deny}`} onClick={(event) => deny(event)}>
                        Deny
                    </span>
                </span>
            </ListGroup.Item>
        </div>
    )
}
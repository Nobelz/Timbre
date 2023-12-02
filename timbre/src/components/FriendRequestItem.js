import { useState } from "react";
import styles from '../app/styles/friendRequests.module.css';
import { ListGroup } from "react-bootstrap";

export default function FriendRequestItem({ request }) {

    const handleAccept = (e) => {
        e.stopPropagation();
        console.log("accept");
    }

    const handleDeny = (e) => {
        e.stopPropagation();
        console.log("deny");
    }

    return (
        <div>
            <ListGroup.Item className={`${styles.listItem}`}>
                {request.username}
                <span className={`text-muted ${styles.listItemHidden}`}>
                    <span className={`${styles.accept}`} onClick={(event) => handleAccept(event)}>
                        Accept
                    </span> 
                    <span className={`${styles.deny}`} onClick={(event) => handleDeny(event)}>
                        Deny
                    </span>
                </span>
            </ListGroup.Item>
        </div>
    )
}
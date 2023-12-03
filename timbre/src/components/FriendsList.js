import { ListGroup } from "react-bootstrap";
import FriendsListItem from '../components/FriendsListItem'
import styles from '../app/styles/friends.module.css'
import { useEffect, useState } from "react";

export default function FriendsList({ friends, handleToast }) {
    return (
        <div>
            <div className={`${styles.yourFriends}`}>
                Your Friends
            </div>
            <ListGroup variant="flush">
                {friends.map((friend, index) => {
                    return (
                        <FriendsListItem friend={friend} handleToast={handleToast} key={index} />
                    )
                })}
            </ListGroup>
        </div>
    )
}
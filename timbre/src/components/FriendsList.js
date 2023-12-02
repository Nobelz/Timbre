import { ListGroup } from "react-bootstrap";
import FriendsListItem from '../components/FriendsListItem'
import styles from '../app/styles/friends.module.css'

export default function FriendsList({ friends }) {
    return (
        <div>
            <div className={`${styles.yourFriends}`}>
                Your Friends
            </div>
            <ListGroup variant="flush">
                {friends.map((friend, index) => {
                    return (
                        <FriendsListItem friend={friend} key={index} />
                    )
                })}
            </ListGroup>
        </div>
    )
}
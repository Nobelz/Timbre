import { ListGroup } from "react-bootstrap";
import FriendsListItem from '../components/FriendsListItem'

export default function FriendsList({ friends }) {
    return (
        <ListGroup variant="flush">
            {friends.map((friend, index) => {
                return (
                    <FriendsListItem friend={friend} key={index}/>
                )
            })}
        </ListGroup>
    )
}
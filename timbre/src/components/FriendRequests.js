import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from '../app/styles/friendRequests.module.css'

export default function FriendRequests({ friendRequests }) {
    const [search, setSearch] = useState("");

    const handleAddFriend = (e) => {
        e.stopPropagation();
        // add logic here for adding a friend
    }

    return (
        <Container className={`${styles.container}`}>
            <Form.Control type="search" placeholder="Search for Friends by Email" value={search} onChange={e => setSearch(e.target.value)} />
            <Button className={`${styles.addFriend}`} onClick={(event) => handleAddFriend(event)}>Add</Button>
        </Container>
    )
}
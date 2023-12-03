import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from '../app/styles/friendRequests.module.css'
import { ListGroup } from "react-bootstrap";
import FriendRequestItem from './FriendRequestItem';
import { useEffect } from "react";

export default function FriendRequests({ friendRequests, updateFriends, handleToast }) {
    const [search, setSearch] = useState("");
    
    useEffect(() => {
        console.log('Update friend requests');
    }, [friendRequests]);

    const handleAddFriend = (e) => {
        e.stopPropagation();
        addFriend(search);
    }

    const handleDeny = (index, deniedUserId) => {
        friendRequests.splice(index, 1);
        denyFriend(deniedUserId);
        document.getElementById(index).remove()
    }

    const handleAccept = (index, acceptedUserId) => {
        friendRequests.splice(index, 1);
        acceptFriend(acceptedUserId);
        document.getElementById(index).remove()
    }

    const addFriend = async (email) => {
        try {
            let data = {
                command: 'MAKE_FRIEND_REQUEST',
                current_id: localStorage.getItem("spotify_id"),
                email: email,
            };

            const response = await fetch('../api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            let res = await response.json();
            
            if (res.data && res.data.code) {
                if (res.data.code == 404) { // Check if user not found
                    handleToast('Friend Request Error', 'User with that email does not exist!', 'danger');
                } else if (res.data.code == 400) {
                    handleToast('Friend Request Error', `You can't add yourself as a friend!`, 'danger');
                }
            } else {
                handleToast('Friend Request Sent', `Friend request sent to ${email}!`, 'success');
                updateFriends();
            }
            setSearch("");
        } catch (error) {
            console.error(error);
        }
    }

    const denyFriend = async (deniedUserId) => {
        try {
            let data = {
                command: 'DENY_FRIEND_REQUEST',
                current_id: localStorage.getItem("spotify_id"),
                friend_id: deniedUserId
            };

            const response = await fetch('../api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error(error);
        }
    };

    const acceptFriend = async (acceptedUserId) => {
        try {
            let data = {
                command: 'ACCEPT_FRIEND_REQUEST',
                current_id: localStorage.getItem("spotify_id"),
                friend_id: acceptedUserId
            };

            const response = await fetch('../api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Container className={`${styles.container}`}>
                <Form.Control type="search" placeholder="Search for Friends by Email" value={search} onChange={e => setSearch(e.target.value)} />
                <Button className={`${styles.addFriend}`} onClick={(event) => handleAddFriend(event)}>Add</Button>
            </Container>
            <div className={`${styles.requests}`}>
                Friend Requests
            </div>
            <ListGroup className='mt-3' variant="flush">
                {friendRequests.map((request, index) => {
                    return (
                        <FriendRequestItem request={request} index={index} handleDeny={handleDeny} handleAccept={handleAccept} key={index}/>
                    )
                })}
            </ListGroup>
        </div>
    )
}
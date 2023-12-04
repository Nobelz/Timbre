import { ModalHeader } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function ViewBio({ username, bio, show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{username}'s Bio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {bio
                    ? <div>{bio}</div>
                    : <div>Sorry, this user does not have a bio.</div>}
            </Modal.Body>
        </Modal>
    )
}
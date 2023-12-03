import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Container, Form, Button } from "react-bootstrap";
import styles from "../app/styles/bioPopup.module.css"

export default function UpdateTextPopup({ show, onHide, updateBackend }) {
    const [inputText, setInputText] = useState("");

    const updateBio = async (newBio) => {
        try {
            let data = {
                command: 'UPDATE_BIO',
                spotify_id: localStorage.getItem('spotify_id'),
                new_bio: newBio
            };

            await fetch('../api/endpoint', {
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

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleUpdate = async () => {
        try {
            // Call the function to update the backend with the input text
            await updateBio(inputText);
            setInputText(""); // Clear the input after updating backend (if required)
            onHide(); // Close the modal after updating
        } catch (error) {
            console.error('Error handling update:', error);
            // Handle the error, display a message, or log it as needed
        }
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName={styles.recModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Bio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={styles.container}>
                    <Form.Group>
                        <Form.Control className={styles.form}
                            type="text"
                            placeholder="Enter new bio here..."
                            value={inputText}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button className={styles.button} variant="primary" onClick={handleUpdate}>
                        Done
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
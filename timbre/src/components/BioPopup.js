import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Container, Form, Button } from "react-bootstrap";
import styles from "../app/styles/bioPopup.module.css"

export default function UpdateTextPopup({ show, onHide, updateBackend }) {
    const [inputText, setInputText] = useState("");

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleUpdate = () => {
        // Call the function to update the backend with the input text
        updateBio(inputText);
        setInputText(""); // Clear the input after updating backend (if required)
        onHide(); // Close the modal after updating
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
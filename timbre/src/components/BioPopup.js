import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Container, Form, Button } from "react-bootstrap";

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
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Bio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Form.Group>
                        <Form.Label>New Bio:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter text..."
                            value={inputText}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
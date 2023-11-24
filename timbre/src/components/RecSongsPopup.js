import { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function RecSongPopup({ show, onHide, props }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recommend songs for {props.username}</Modal.Title>
            </Modal.Header>
            {/* The next step is to implement a spotify song searcher as the modal body */}
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        </Modal>
    )
}
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ToastComponent = ({ show, variant, title, message }) => {
  return (
    <ToastContainer position="bottom-end">
        <Toast
            show={show}
            className="d-inline-block m-1"
            bg={variant}
            delay={3000}
            autohide
        >
            <Toast.Header>
                <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body>
                {message}
            </Toast.Body>
        </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, ListGroup, Button } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList'
import styles from '../styles/matches.module.css';

export default function Matches() {
    const [matchcards, setMatchcards] = useState([1, 2, 3, 4, 5]);

    return (
        <div className={`${styles.matches}`}>
            <Navbar bg="dark" variant="dark">
                <Container fluid>
                    <Navbar.Brand href="/homepage">
                        Timbre
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/matches">Matches</Nav.Link>
                        <Nav.Link href="/friends">Friends</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className={`${styles.header}`}>
                Your Matches
            </div>
            <div className={`${styles.container}`}>
                <MatchcardList matchcards={matchcards} />
            </div>
        </div>
    )
}
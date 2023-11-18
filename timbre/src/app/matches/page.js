"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styles from '../styles/matches.module.css';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function Matches() {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div>
            <Head>
                <title>Timbre</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
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
            {/* Fix this: each card should be in a separate component and also possibly in a container (will test) as it is its own entity */}
            <div className={styles.container}>
                <div
                    className={`${styles.card} ${isFlipped ? styles.flip : ''}`}
                    onClick={handleFlip}
                >
                {/* can change these divs to bootstrap cards instead to make things easier */}
                    <div className={styles.cardFace}>
                        <p>Front Side</p>
                    </div>
                    <div className={`${styles.cardFace} ${styles.cardFaceBack}`}>
                        <p>Back Side</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
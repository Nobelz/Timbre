"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container, ListGroup, Button } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList'

export default function Matches() {
    const [matchcards, setMatchcards] = useState([1, 2, 3, 4, 5]);

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
            <div className='container'>
                <MatchcardList matchcards={matchcards} />
            </div>
        </div>
    )
}
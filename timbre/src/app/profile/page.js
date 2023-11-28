"use client";

import Head from 'next/head'
import { useEffect, utate } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, ListGroup, Button } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList';
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSearchParams, useRouter } from "next/navigation";
import { authorize, getToken } from "../api/auth/authorize";
import styles from '../styles/profile.module.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function Matches() {

    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    useRefreshToken(String(code));

    const authorizeApp = async () => {
        await authorize();
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
                    
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            TO BE FILL ICON
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">My Account</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                </Container>
            </Navbar>

            <div>
                <Container class={`${styles.container}`}>
                    <h1 class={`${styles.row}`}>Personal Details</h1>
                    <Row>
                        <Col class={`${styles.title}`}>
                            <Row>Name</Row>
                            <Row>Username</Row>
                            <Row>Email</Row>
                        </Col>
                        <Col class={`${styles.content}`}>
                            <Row>INFO</Row>
                            <Row>Info</Row>
                            <Row>info</Row>
                        </Col>
                    </Row>

                    <h1 class={`${styles.row}`}>Spotify</h1>
                    <Row>
                        <Col class={`${styles.title}`}>
                            <Row>Account</Row>
                            <Row>Last Synced: </Row>
                        </Col>
                        <Col class={`${styles.s_content}`}>
                            <Row>INFO</Row>
                            <Row>Info</Row>
                        </Col>
                        <Col class={`${styles.s_button}`}>
                            <Button className={styles.greenButton} onClick={authorizeApp}>RESYNC NOW</Button>
                        </Col>
                    </Row>

                    <Row class={`${styles.row}`}>
                        <Button className={styles.greenButton}>Log Out</Button>
                    </Row>

                </Container>

            

                
            </div>
        </div>
    )
}
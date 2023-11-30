"use client";

import Head from 'next/head'
import { useState, useEffect, utate, useRef } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, ListGroup, Button, Form } from 'react-bootstrap';
import MatchcardList from '../../components/MatchcardList';
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSearchParams, useRouter } from "next/navigation";
import { authorize, getToken } from "../api/auth/authorize";
import styles from '../styles/profile.module.css';
import UpdateTextPopup from "../../components/BioPopup";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function Profile({content}) {

    const [showBioPopup, setShowBioPopup] = useState(false);

    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    useRefreshToken(String(code));

    const authorizeApp = async () => {
        await authorize();
      };

    const handleBio = (e) => {
        e.stopPropagation();
        setShowBioPopup(true);
    }

    const handleBioPopupClose = () => {
        setShowBioPopup(false);
    }


    return (
        
            <div className={`${styles.profile}`}>
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

                <link href='https://fonts.googleapis.com/css?family=Lexend' rel='stylesheet'/>
                <Container class={`${styles.container}`}>
                    <h1 class={`${styles.row}`}>Personal Details</h1>
                    <Row>
                        <Col class={`${styles.info}`}>
                            <Row>
                                <Col class={`${styles.title_col}`}>Name</Col>
                                <Col class={`${styles.content_col}`}>first_name_last_name</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Email</Col>
                                <Col class={`${styles.content_col}`}>email_info</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Bio</Col>
                                <Col class={`${styles.content_col}`}>bio_info</Col>
                            </Row>
                        </Col>
                        <Col class={`${styles.button_col}`}>
                            <Button className={styles.greenButton} onClick={(event) => handleBio(event)}>Edit Bio</Button>
                            <UpdateTextPopup show={showBioPopup} onHide={handleBioPopupClose} props={content}/>
                        </Col>
                    </Row>

                    <h1 class={`${styles.row}`}>Spotify</h1>
                    <Row>
                        <Col class={`${styles.info}`}>
                            <Row>
                                <Col class={`${styles.title_col}`}>Username</Col>
                                <Col class={`${styles.content_col}`}>spotify_username</Col>
                            </Row>
                            <Row>
                                <Col class={`${styles.title_col}`}>Last Synced</Col>
                                <Col class={`${styles.content_col}`}>last_synced_info</Col>
                            </Row>
                        </Col>
                        <Col class={`${styles.button_col}`}>
                            <Button className={styles.greenButton} onClick={authorizeApp}>Resync Now</Button>
                        </Col>
                    </Row>

                    <Row class={`${styles.row}`}>
                        <Button className={styles.greenButton}>Log Out</Button>
                    </Row>

                </Container>
                
            </div>
    )
}
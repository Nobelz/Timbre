import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/friends.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button, ListGroup } from "react-bootstrap";

export default function FriendsTab({ friends }) {

    const handleRecommendSongs = (e) => {
        e.stopPropagation();
        console.log("he")
        // add logic here for recommending a song
    }

    return (
        <div className={`${styles.tabContainer}`}>
            <Tabs
                defaultActiveKey="friends"
                className={`${styles.navTab}`}
            >
                <Tab className={`${styles.navTabContent}`} eventKey="friends" title="Friends">
                    <ListGroup variant="flush">
                        <ListGroup.Item className={`${styles.listItem}`} onClick={(e) => handleRecommendSongs(e)}>
                            Cras justo odio
                            <span className={`text-muted ${styles.listItemHidden}`}>Recommend Songs to Bob?</span>
                        </ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    </ListGroup>
                </Tab>
                <Tab eventKey="recommendations" title="Recommendations">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="requests" title="Requests">
                    Tab content for Loooonger Tab
                </Tab>
            </Tabs>
        </div>
    )
}
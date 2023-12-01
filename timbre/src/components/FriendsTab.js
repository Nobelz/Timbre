import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/friends.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import FriendsList from '../components/FriendsList'

export default function FriendsTab({ friends }) {
    return (
        <div className={`${styles.tabContainer}`}>
            <Tabs
                defaultActiveKey="friends"
                className={`${styles.navTab}`}
            >
                <Tab className={`${styles.navTabContent}`} eventKey="friends" title="Friends">
                    <FriendsList friends={friends} />
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
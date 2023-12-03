import { useState, useEffect, useRef } from "react";
import styles from '../app/styles/friends.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import FriendsList from '../components/FriendsList';
import FriendsRequests from '../components/FriendRequests';
import Recommendations from '../components/Recommendations'

export default function FriendsTab({ friends, friendRequests, recs, updateFriends, handleToast}) {
    return (
        <div className={`${styles.tabContainer}`}>
            <Tabs
                defaultActiveKey="friends"
                className={`${styles.navTab}`}
            >
                <Tab className={`${styles.navTabContent}`} eventKey="friends" title="Friends">
                    <FriendsList friends={friends} />
                </Tab>
                <Tab className={`${styles.navTabContent}`} eventKey="recommendations" title="Recommendations">
                    <Recommendations recs={recs} />
                </Tab>
                <Tab className={`${styles.navTabContent}`} eventKey="requests" title="Requests">
                    <FriendsRequests friendRequests={friendRequests} updateFriends={updateFriends} handleToast={handleToast} />
                </Tab>
            </Tabs>
        </div>
    )
}
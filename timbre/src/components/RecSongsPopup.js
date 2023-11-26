import { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { Container, Form } from "react-bootstrap";
import styles from "../app/styles/recSongPopup.module.css"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'

const spotifyApi = new SpotifyWebApi({
    clientId: "b19d3fc2519f47b69da48d2a75142499",
})

export default function RecSongPopup({ show, onHide, props }) {
    const [search, setSearch] = useState("");
    const [accessToken, setAccessToken] = useState(
        typeof window !== 'undefined' ? sessionStorage.getItem("access_token") : null
    );
    const [searchResults, setSearchResults] = useState([]);

    console.log(searchResults);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image;
                    return smallest;
                }, track.album.images[0])

                return {
                    artists: track.artists.map(artists => {
                        return artists.name;
                    }),
                    title: track.name,
                    uri: track.uri,
                    albumImageUrl: smallestAlbumImage.url
                }
            }))
        })
        return () => (cancel = true)
    }, [search, accessToken]);

    return (
        <Modal show={show} onHide={onHide} dialogClassName={styles.recModal} scrollable={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recommend songs for {props.username}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={styles.container}>
                    <Form.Control type="search" placeholder="Search for Songs/Artists" value={search} onChange={e => setSearch(e.target.value)} />
                    <div className={styles.songs}>
                        {searchResults.map(track => (
                            <TrackSearchResult track={track} key={track.uri} />
                        ))}
                    </div>
                </Container>
            </Modal.Body>
        </Modal>
    )
}
// need to display the search results and then be able to select them for recommending
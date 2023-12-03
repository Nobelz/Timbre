import { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { Container, Form } from "react-bootstrap";
import styles from "../app/styles/recSongPopup.module.css"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'

const spotifyApi = new SpotifyWebApi({
    clientId: "b19d3fc2519f47b69da48d2a75142499",
})

export default function RecSongPopup({ show, onHide, props, handleToast }) {
    const [search, setSearch] = useState("");
    const [accessToken, setAccessToken] = useState(
        typeof window !== 'undefined' ? localStorage.getItem("access_token") : null
    );
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        spotifyApi.searchTracks(search).then(res => {
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image;
                    return smallest;
                }, track.album.images[0])
                
                return {
                    artists: track.artists.map(artists => {
                        return artists.name;
                    }),
                    artist_ids: track.artists.map(artists => {
                        return artists.id;
                    }),
                    song_id: track.id,
                    title: track.name,
                    uri: track.uri,
                    albumImageUrl: smallestAlbumImage.url
                }
            }))
        })
    }, [search, accessToken]);

    const recommendSong = async (track) => {
        try {
            let data = {
                command: 'MAKE_RECOMMENDATION',
                current_id: localStorage.getItem('spotify_id'),
                friend_id: props.friend_id,
                song: track,
            };

            const response = await fetch('../api/endpoint', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            const resJson = await response.json();
            
            onHide(); // Hide popup
            setSearch(''); // Clear search bar
            handleToast('Recommendation Made', `Song '${track.title}' was recommended successfully!`, 'success');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal show={show} onHide={onHide} dialogClassName={styles.recModal} scrollable={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>Recommend songs for {props.display_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className={styles.container}>
                    <Form.Control type="search" placeholder="Search for Songs/Artists" value={search} onChange={e => setSearch(e.target.value)} />
                    <div className={styles.songs}>
                        {searchResults.map(track => (
                            <TrackSearchResult track={track} chooseTrack={recommendSong} key={track.uri} />
                        ))}
                    </div>
                </Container>
            </Modal.Body>
        </Modal>
        // NOTE: in TrackSearchResult pass a handleClick prop to handle recommending songs
    )
}
// need to display the search results and then be able to select them for recommending
import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ trackUri }) {
    const [accessToken, setAccessToken] = useState();
    const [play, setPlay] = useState(false);

    useEffect(() => {
        setAccessToken(window !== 'undefined' ? localStorage.getItem("access_token") : null)
    }, []);

    useEffect(() => {
        setPlay(true);
    }, [trackUri]);

    if (!accessToken) return null;
    return (
        <SpotifyPlayer
            styles={{
                bgColor: '#F8F8F8'
            }}
            token={accessToken}
            play={play}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false);
            }}
            uris={trackUri ? [trackUri] : []}
        />
    )
}
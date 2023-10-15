const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';
const TOP_ARTIST_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/artists/{id}/top-tracks'; // Change for id
const TRACK_FEATURES_REQUEST = 'https://api.spotify.com/v1/audio-features';

export const topTracks = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            'https://api.spotify.com/v1/me/top/tracks',
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );
        return response.json();
    } catch (err) {
        console.log(err);
    }
};


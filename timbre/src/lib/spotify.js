const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';
const TOP_ARTIST_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/artists/{id}/top-tracks'; // Change for id
const TRACK_FEATURES_REQUEST = 'https://api.spotify.com/v1/audio-features';

export const getUsersPlaylists = async (refresh_token) => {
    const { access_token } = await getAccessToken(refresh_token);

    return fetch(PLAYLISTS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const topTracks = async (refresh_token) => {
    const { access_token } = await getAccessToken(refresh_token);

    return fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

export const topArtists = async (refresh_token) => {
    const { access_token } = await getAccessToken(refresh_token);

    return fetch(TOP_ARTISTS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};

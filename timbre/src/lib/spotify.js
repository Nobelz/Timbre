const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';

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


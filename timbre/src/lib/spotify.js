const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';

/*
 These are functions responsible for making api requests to the Spotify api.
 Each function must get the access token generated from the user logging in 
 and pass that as authorization to the Spotify api.
 */

// Gets the playlists of the current user
export const playlists = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            PLAYLISTS_ENDPOINT,
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

// Gets the top tracks of the current user
export const topTracks = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            TOP_TRACKS_ENDPOINT,
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

// Gets the top artists of the current user
export const topArtists = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            TOP_ARTISTS_ENDPOINT,
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

// Gets 20 of the current user's recently played songs
export const recentlyPlayed = async () => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            RECENTLY_PLAYED_ENDPOINT,
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

// Gets the top tracks on an artist given their id
export const artistsTopTracks = async (id) => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${id}/top-tracks`,
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

// Gets the audio features of a track given its id
// ids should be a comma separated string of track ids
export const trackFeatures = async (ids) => {
    const token = sessionStorage.getItem("access_token");
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/audio-features/${ids}`,
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


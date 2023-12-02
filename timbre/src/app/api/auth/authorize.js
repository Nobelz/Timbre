const SPOTIFY_CLIENT_ID = "058f825752a846299e9ae732eda6e7e1";
// Upon successful authentication by the user, redirect to this url
const redirectUri = 'http://localhost:3000/api/callback';

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}

let codeVerifier = generateRandomString(128);

if (typeof window !== "undefined") {
  let urlParams = new URLSearchParams(window.location.search);
}

/*
 Main authorize method to log the user into their Spotify account by sending a request to Spotify's /authorize endpoint. 
 The authentication method used is PKCE where we do not need a client secret id.
 The scope variable is responsible for access privileges to the user's information. 
 */
export const authorize = async () => {
    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
        const state = generateRandomString(16);
        const scope = "user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-top-read user-library-read user-library-modify user-read-recently-played";

        localStorage.setItem("code_verifier", codeVerifier);
        localStorage.setItem("state", state);

        const args = new URLSearchParams({
            response_type: "code",
            client_id: SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
        });

        window.location.href = "https://accounts.spotify.com/authorize?" + args;
    });
};

// Gets the access token from Spotify api after the user is authenticated
export const getToken = async (code) => {
    const codeVerifier = localStorage.getItem("code_verifier");

    console.log("getting token");
    const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code", 
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
    });

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        });
        
        return response.json();
    } catch (error) {
        window.location.href = "/";
    }
};

// Gets the refresh token (token that allows users to get more access tokens without having to log back in again) from Spotify api after the user is authenticated
export const refreshSpotifyToken = async (refresh_token) => {
    const body = new URLSearchParams({
        grant_type: "refresh_token" || "",
        refresh_token: refresh_token,
        client_id: SPOTIFY_CLIENT_ID || "",
    });
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
        });

        return response.json();
    } catch (err) {
        console.log(err);
    }
};
const SPOTIFY_CLIENT_ID = "b19d3fc2519f47b69da48d2a75142499";
const redirectUri = 'http://localhost:3000/callback';

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
let urlParams = new URLSearchParams();
if (typeof window !== "undefined") {
  urlParams = new URLSearchParams(window.location.search);
}
let code = urlParams.get('code');

export const authorize = async () => {
    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
        const state = generateRandomString(16);
        const scope = "user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state";

        sessionStorage.setItem("code_verifier", codeVerifier);

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

export const getToken = async (code) => {
    const codeVerifier = sessionStorage.getItem("code_verifier");

    const body = new URLSearchParams({
        grant_type: "authorization_code" || "",
        code: code || "",
        redirect_uri: redirectUri || "",
        client_id: SPOTIFY_CLIENT_ID || "",
        code_verifier: codeVerifier || "",
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
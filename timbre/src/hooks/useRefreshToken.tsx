import { useEffect, useState, useRef } from "react";
import { getToken, refreshSpotifyToken } from "../app/api/auth/authorize";
import { useRouter } from "next/navigation";

/* 
 Whenever a page is loaded this function should be called.
 This function fetched the access token and allows for access into the Spotify api.
 The access token is stored into localStorage which can be then accessed with getItem().
 */
export default function useRefreshToken(code: string) {
  const [expiresIn, setExpiresIn] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [spotifyID, setSpotifyID] = useState("");
  const lock = useRef(false);
  const router = useRouter();

  // Gets a new access token upon login
  const fetchToken = async (code) => {
    if (lock.current)
      return;

    lock.current = true;

    try {
      let response = await getToken(code);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      localStorage.setItem('expires_in', response.expires_in + Date.now());
      setRefreshToken(response.refresh_token);
      setAccessToken(response.access_token);
      setExpiresIn(response.expires_in);
    } finally {
      lock.current = false;
    }
  };

  // // Gets a new access token after the previous one expired
  // const fetchRefreshToken = async () => {
  //   if (lock.current)
  //     return;

  //   lock.current = true;

  //   try {
  //     let response = await refreshSpotifyToken(refreshToken);
  //     localStorage.setItem("access_token", response.access_token);
  //     localStorage.setItem("refresh_token", response.refresh_token);
  //     localStorage.setItem('expires_in', (response.expires_in * 1000 + Date.now()).toString());
  //     setRefreshToken(response.refresh_token);
  //     setAccessToken(response.access_token);
  //     setExpiresIn(response.expires_in);
  //   } finally {
  //     lock.current = false;
  //   }
  // };

  const pullSpotifyData = async () => {
    let data = {
      command: 'GENERATE_SPOTIFY_DATA',
      access_token: accessToken,
    };

    const response = await fetch('./endpoint', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data ),
    });

    const res = await response.json();
    localStorage.setItem("spotify_id", res.data.spotify_id);
    setSpotifyID(res.data.spotify_id);
  }

  // Immediately get an access token upon the users first login
  // This needs to be debugged and might be the cause of bad responses because the refresh token is never used
  useEffect(() => {
    fetchToken(code);
  }, []);

  useEffect(() => {
    if (accessToken && accessToken !== 'undefined') {
      pullSpotifyData();
    }
  }, [accessToken]);

  useEffect(() => {
    if (spotifyID && spotifyID !== 'undefined') {
      router.push('../homepage');
    }
  }, [spotifyID]);
}
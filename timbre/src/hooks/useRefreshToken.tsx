import { useEffect, useState, useRef } from "react";
import { getToken, refreshSpotifyToken } from "../app/api/auth/authorize";

/* 
 Whenever a page is loaded this function should be called.
 This function fetched the access token and allows for access into the Spotify api.
 The access token is stored into localStorage which can be then accessed with getItem().
 */
export default function useRefreshToken(code: string) {
  const [expiresIn, setExpiresIn] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const lock = useRef(false);

  // Gets a new access token upon login
  const fetchToken = async (code) => {
    if (lock.current)
      return;

    lock.current = true;

    try {
      let response = await getToken(code);
      localStorage.setItem("access_token", response.access_token);
      setRefreshToken(response.refresh_token);
      setAccessToken(response.access_token);
      setExpiresIn(response.expires_in);
    } finally {
      lock.current = false;
    }
  };

  // Gets a new access token after the previous one expired
  const refreshTokenFn = async () => {
    if (lock.current)
      return;

    lock.current = true;

    try {
      let response = await refreshSpotifyToken(refreshToken);
      localStorage.setItem("access_token", response.access_token);
      setAccessToken(response.access_token);
      setExpiresIn(response.expires_in);
    } finally {
      lock.current = false;
    }
  };

  // Immediately get an access token upon the users first login
  // This needs to be debugged and might be the cause of bad responses because the refresh token is never used
  useEffect(() => {
    fetchToken(code);
  }, []);

  useEffect(() => {
    if (accessToken && accessToken !== 'undefined') {
      window.location.href = '../homepage'; //TODO change back once done debugging Oswin says use Router
    }
  }, [accessToken]);

  // Sets up a countdown for when the access token will expire and upon expiration gets a new one with the refresh token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      refreshTokenFn();
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
}
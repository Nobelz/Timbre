import { useEffect, useState } from "react";
import { getToken, refreshSpotifyToken } from "../app/api/auth/authorize";

/* 
 Whenever a page is loaded this function should be called.
 This function fetched the access token and allows for access into the Spotify api.
 The access token is stored into sessionStorage which can be then accessed with getItem().
 */
export default function useRefreshToken(code: string) {
  const [expiresIn, setExpiresIn] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  // Gets a new access token upon login
  const fetchToken = async (code) => {
    let response = await getToken(code);
    setRefreshToken(response.refresh_token);
    setAccessToken(response.access_token);
    setExpiresIn(response.expires_in);
    sessionStorage.setItem("access_token", response.access_token);
  };

  // Gets a new access token after the previous one expired
  const refreshTokenFn = async () => {
    let response = await refreshSpotifyToken(refreshToken);
    setAccessToken(response.access_token);
    setExpiresIn(response.expires_in);
    sessionStorage.setItem("access_token", response.access_token);
  };

  // Immediately get an access token upon the users first login
  // This needs to be debugged and might be the cause of bad responses because the refresh token is never used
  useEffect(() => {
    fetchToken(code);
  }, [code]);

  // Sets up a countdown for when the access token will expire and upon expiration gets a new one with the refresh token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      refreshTokenFn();
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
}
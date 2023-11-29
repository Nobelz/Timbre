"use client";

import Head from 'next/head'
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../../hooks/useRefreshToken";
import { useState, useEffect } from 'react';

export default function Callback() {
  const [access_token, setAccessToken] = useState("");
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useRefreshToken(String(code));

  const pullSpotifyData = async () => {
    let data = {
      command: 'GENERATE_SPOTIFY_DATA',
      access_token: access_token,
    };

    const response = await fetch('./endpoint', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data ),
    });

    await response.json();
  }

  // Runs once when accessing this webpage. Fetches the user's Spotify data
  useEffect(() => {
    try {
      if (!access_token || access_token === 'undefined') {
        let token = localStorage.getItem("access_token");
        setAccessToken(token || "");
      } else {
        pullSpotifyData();
      }
    } catch (err) {
      console.log(err);
    }
  }, [access_token]);

  // TODO: Make this page look nicer
  return (
    <title>Logging you in...</title>
  );
}
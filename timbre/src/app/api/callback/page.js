"use client";

import Head from 'next/head'
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../../../hooks/useRefreshToken";
import { useState, useEffect } from 'react';


export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [done, setDone] = useState(false);

  useRefreshToken(String(code));
  
  useEffect(() => {
    if (done && done !== null) {
      console.log('test');
      window.location.href = '../../homepage';
    }
  }, [done]);

  useEffect(() => {
    // Set done to true when useRefreshToken is done running
    setDone(true);
  }, []);

  return (
    <title>Logging you in...</title>
  );
}
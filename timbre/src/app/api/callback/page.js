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

  return (
    <title>Logging you in...</title>
  );
}
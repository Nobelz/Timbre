"use client";

import Head from 'next/head'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useRefreshToken from "../hooks/useRefreshToken";
import { authorize, getToken } from "./api/auth/authorize";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Navigation from '../components/Navigation';

/* 
 The landing page of the application where users will have to sign in to their Spotify account.
 */
export default function Login() {
  return (
    <div>
      <Head>
        <title>Timbre</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navigation></Navigation>
    </div>
  )
}
import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import '../app/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default MyApp;

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Music Social Network
        </Typography>
        <Button color="inherit" href="/">Home</Button>
        <Button color="inherit" href="/profile">Profile</Button>
        <Button color="inherit" href="/recommendations">Recommendations</Button>
        <Button color="inherit" href="/friends">Friends</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

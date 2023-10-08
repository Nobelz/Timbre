import React from 'react';
import { Container, Typography } from '@mui/material';
import Survey from '../components/Survey';

const Profile = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Survey />
    </Container>
  );
};

export default Profile;

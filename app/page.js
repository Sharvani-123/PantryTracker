"use client";

import React from 'react';
import { Button, Container, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation'; // Import from 'next/navigation'
import './styles.css'; // Import the CSS file
import '@fontsource/ubuntu'; // Import Ubuntu font

const Home = () => {
  const router = useRouter();

  const goToDashboard = () => {
    console.log('goToDashboard function called');
    router.push('./dashboard');
  };

  return (
    <Container
      maxWidth="false"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/pantryBg2.jpg)', // Replace with your image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      ></Box>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: 'black',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{fontFamily: 'monospace', color: 'black' }}>
          Pantry Tracker
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: 'black', mb: 2 }}>
          Track your pantry items effortlessly and stay organized!
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={goToDashboard} 
          className="animated-button"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Home;


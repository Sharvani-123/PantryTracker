import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 0',
        position: 'fixed', // Use 'fixed' if you want it always at the bottom of the viewport
        bottom: 0,
        width: '100%',
        fontSize: '14px',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Sharvani. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

import React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ForumDisplay } from './ForumDisplay';

const Home = () => {
  return (
    <Stack sx={{ display: 'flex', alignItems: 'center' }}>
      <h1>Threads</h1>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>Sort Threads</Box>
        <Button>Create New Thread</Button>
      </Box>
      <ForumDisplay />
    </Stack>
  );
};

export default Home;

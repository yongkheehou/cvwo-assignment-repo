import React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ForumDisplay } from './ForumDisplay';
import SortButton from '../../components/forum/SortButton';
import CreateIcon from '@mui/icons-material/Create';

const Home = () => {
  return (
    <Stack sx={{ display: 'flex', alignItems: 'center' }}>
      <h1>Threads</h1>
      <Box sx={{ minWidth: 600, maxWidth: 700 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 1,
            margin: 1,
          }}
        >
          <SortButton />
          <Button variant="contained" endIcon={<CreateIcon />}>
            New Thread
          </Button>
        </Box>
        <Box sx={{ alignItems: 'center' }}>
          <ForumDisplay />
        </Box>
      </Box>
    </Stack>
  );
};

export default Home;

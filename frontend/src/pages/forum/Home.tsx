import React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { ForumDisplay } from './ForumDisplay';
import SortButton from '../../components/forum/SortButton';
import CreateIcon from '@mui/icons-material/Create';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHooks';
import { getAllThreads } from '../../features/forum/ThreadSlice';
import { INCREASING, TITLE } from '../../utils/Constants';
import { Thread } from '../../features/forum/ForumModels';
import { sortThreadsTwo } from './Helpers';

const Home = () => {
  const dispatch = useAppDispatch();
  const [criteria, setCriteria] = useState(TITLE);
  const [direction, setDirection] = useState(INCREASING);

  const [threadUpdated, setThreadUpdated] = useState(false);

  async function getThreads() {
    await dispatch(getAllThreads()).unwrap();
  }

  useEffect(() => {
    console.log('rerendered');
    getThreads();
    setThreadUpdated(false);
    // threadInfo = sortThreadsTwo(criteria, direction, threadInfo);
    // console.log('thread info');
    // console.log(threadInfo);
  }, [threadUpdated, criteria, direction]);

  const threadInfo = useAppSelector((state) => state.thread.ThreadArr);

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
          <SortButton
            criteria={criteria}
            setCriteria={setCriteria}
            direction={direction}
            setDirection={setDirection}
          />
          <Button variant="contained" endIcon={<CreateIcon />}>
            New Thread
          </Button>
        </Box>
        <Box sx={{ alignItems: 'center' }}>
          <ForumDisplay
            criteria={criteria}
            direction={direction}
            threadInfo={threadInfo}
            setThreadUpdated={setThreadUpdated}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default Home;
